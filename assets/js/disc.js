(() => {
    const discordID = "709547527334002829"
    const baseUrl = "https://api.lanyard.rest/v1/"
    const updateInterval = 7000

    const profileHtmlTemplate = `
    <div class="disc-profile">
        <div class="disc-profile-body">
            <img src=^avatar^ height="64" width="64"/>
            <div class="disc-profile-main">
                <h2>^display^</h2>
                <div class="disc-spotify">
                    <img src=^spotify-song-img^ height="32" width="32" onerror="this.style.display='none';"/>
                    
                    <div class="disc-spotify-main">
                        <span class="disc-spotify-name">^spotify-song-name^</span>
                        <span class="disc-spotify-artist">^spotify-song-artist^</span>
                    </div>
                </div>
                
                <a class="twitter-button" href="https://twitter.com/@nvidiartx3090" target="_blank" rel="noopener noreferrer" tabindex="0" data-react-aria-pressable="true" role="link" title="Twitter"><svg height="24" viewBox="0 0 24 24" width="24" class="text-default-500"><path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z" fill="currentColor"></path></svg></a>                
            </div>
        </div>
    </div>
    `

    const activityHtmlTemplate = `
    <div class="disc-activity">
        <div class="disc-activity-body">
            <div class="disc-activity-main">
                <div class="disc-activity-icons">
                    <img src=^activity-large-img^ height="72" width="72" onerror="this.style.display='none';"/>
                    <img class="disc-activity-small" src=^activity-small-img^ height="28" width="28" onerror="this.style.display='none';"/>
                </div>
                <div>
                    <h2>^name^</h2>
                    <h3>^details^</h3>
                    <h3>^state^</h3>
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
        },
    }

    const discContainer = document.getElementById("disc-container")
    const activityContainer = document.getElementById("activity-container")

    var currentData = null

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
    async function fetchAsset(url) {
        return await fetch(decodeURIComponent(url))
        .then((resp) => {
            if (!resp.ok) throw new Error("NOT_OK_ASSET");
            return resp.blob();
        })
        .then(async (blob) => {
            // const buffer = Buffer.from(await blob.arrayBuffer());
            // return buffer.toString("base64");
            return await blobToBase64(blob);
        })
        .catch((excep) => {
            console.error("asset fetch err:", excep)
            return null;
        });
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

        const avatarExtension =
        data.discord_user.avatar &&
        data.discord_user.avatar.startsWith("a_")
        ? "gif"
        : "webp";

        const avatarData = await fetchAsset(
            `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${
            data.discord_user.avatar
            }.${avatarExtension}?size=${avatarExtension === "gif" ? "64" : "256"}`
        );

        result.status = data.discord_status;
        result.username = data.discord_user.username;
        result.display = data.discord_user.display_name;
        result.avatar = avatarData || "";

        var spotify = data.spotify;
        if (spotify) {
            spotify.song = spotify.song;
            spotify.artist = spotify.artist.split(";")[0];
            spotify.img = spotify.album_art_url ?? "";
            result.spotify = spotify;
        }

        var activity = data.activities.find(a => !a.name.includes("Spotify") && !a.name.includes("Custom"));
        if (activity) {
            var assets = activity.assets;
            var url = 

            activity.name = activity.name;
            activity.assets = activity.assets;
            if (assets.large_image) {
                activity.large_image = await fetchAsset(
                    assets?.large_image.startsWith("mp:external/")
                    ? `${assets.large_image.replace(/mp:external\/([^\/]*)\/(http[s])/g, "$2:/")}`
                    : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${assets.large_image}.webp`
                );
            }
            if (assets.small_image) {
                activity.small_image = await fetchAsset(
                    assets?.small_image.startsWith("mp:external/")
                    ? `${assets.small_image.replace(/mp:external\/([^\/]*)\/(http[s])/g, "$2:/")}`
                    : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${assets.small_image}.webp`
                );
            }
            result.activity = activity;
        }

        return result;
    }

    async function updateElem(data) {
        const parsed = await parseData(data);
        const spotify = parsed.spotify;
        const activity = parsed.activity;

        discContainer.innerHTML = profileHtmlTemplate
        .replace("^avatar^", parsed.avatar)
        .replace("^username^", parsed.username)
        .replace("^display^", parsed.display)
        
        // if (spotify) {
        discContainer.innerHTML = discContainer.innerHTML
        .replace("^spotify-song-name^", spotify.song)
        .replace("^spotify-song-artist^", spotify.artist)
        .replace("^spotify-song-img^", spotify.img);

        if (activity) {
            activityContainer.innerHTML = activityHtmlTemplate
            .replace("^name^", activity.name)
            .replace("^details^", activity.details)
            .replace("^state^", activity.state)
            .replace("^activity-large-img^", activity.large_image)
            .replace("^activity-small-img^", activity.small_image)
        } else {
            activityContainer.innerHTML = "";
        }
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