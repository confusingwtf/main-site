(() => {
    const discordID = "709547527334002829"
    const baseUrl = "https://api.lanyard.rest/v1/"
    const updateInterval = 7000

    const htmlTemplate = `
    <div class="disc-profile">
        <div class="disc-profile-body">
            <img class="disc-profile-avatar" src=^avatar^ height="64" width="64"/>
            <div class="disc-profile-main">
                <h2 class="disc-profile-display">^display^</h2>
                <div class="disc-spotify">
                    <img class="disc-spotify-img" src=^spotify-song-img^ height="32" width="32" />
                    
                    <div class="disc-spotify-main">
                        <span class="disc-spotify-name">^spotify-song-name^</span>
                        <span class="disc-spotify-artist">^spotify-song-artist^</span>
                    </div>
                </div>                
            </div>
        </div>
    </div>
    `

    var parsedData = {
        status: "offline",
        username: "",
        display: "",
        avatar: "",

        spotify: {
            song: "",
            artist: "",
            img: "",

        }
    }

    const discContainer = document.getElementById("disc-container")

    var currentData = null;

    async function fetchData() {
        return (await fetch(`${baseUrl}users/${discordID}`, {})
        .then((resp) => {
            if (!resp.ok) throw new Error('NOT_OK');
            return resp;
        })
        .then(async (resp) => {
            const data = await resp.json();
            if (!data || !data.success) throw new Error('NOT_SUCCESS');
            return data;
        })
        .then((json) => json)
        .catch((excep) => {
            console.error("fetch err: ", excep)
            return null;
        }));
    }

    // https://github.com/cnrad/lanyard-profile-readme/blob/main/src/utils/fetchUserImages.ts
    // prob should also do this for the spotify img but whatever
    async function fetchAvatar(data) {
        const avatarExtension =
        data.discord_user.avatar &&
        data.discord_user.avatar.startsWith("a_")
        ? "gif"
        : "webp";

        return await fetch(`https://cdn.discordapp.com/avatars/${data.discord_user.id}/${
            data.discord_user.avatar
            }.${avatarExtension}?size=${avatarExtension === "gif" ? "64" : "256"}`)
        .then((resp) => {
            if (!resp.ok) throw new Error("NOT_OK_AVATAR");
            return resp.blob();
        })
        .then(async (blob) => {
            // const buffer = Buffer.from(await blob.arrayBuffer());
            // return buffer.toString("base64");
            return await blobToBase64(blob);
        })
        .catch((excep) => {
            console.error("avatar fetch err:", excep)
            return null;
        })
    }

    // https://stackoverflow.com/questions/18650168/convert-blob-to-base64
    function blobToBase64(blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

    async function parseData(data) {
        result = parsedData;
        if (!data || !data.success) return result;
        data = data.data
        const avatarData = await fetchAvatar(data);

        result.status = data.discord_status;
        result.username = data.discord_user.username;
        result.display = data.discord_user.display_name;
        result.avatar = avatarData || "";

        if (data.spotify) {
            result.spotify.song = data.spotify.song;
            result.spotify.artist = data.spotify.artist.split(";")[0];
            result.spotify.img = data.spotify.album_art_url;
        }

        return result;
    }

    async function updateElem(data) {
        const parsed = await parseData(data);

        discContainer.innerHTML = htmlTemplate
        .replace("^avatar^", parsed.avatar)
        .replace("^username^", parsed.username)
        .replace("^display^", parsed.display)
        .replace("^spotify-song-name^", parsed.spotify.song)
        .replace("^spotify-song-artist^", parsed.spotify.artist)
        .replace("^spotify-song-img^", parsed.spotify.img);

        return discContainer.innerHTML;
    }

    async function updateDisc() {
        const data = await fetchData();
        if (JSON.stringify(currentData) == JSON.stringify(data)) return;

        currentData = data;
        await updateElem(currentData);

    }

    updateDisc()
    setInterval(updateDisc, updateInterval)
})();