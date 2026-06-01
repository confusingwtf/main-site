// bad
const currentSite = window.origin.substring(window.origin.indexOf("://") + 3);
const ringNavTemplate = `
<p>
    <a href="^LAST_SITE^">←</a>
    <a href="^RING_SITE^">bhop webring</a>
    <a href="^NEXT_SITE^">→</a>
</p>
`

fetch(`https://bhop.gay/sites`).then(async (resp) => {
    if (!resp.ok) return;
    const sites = (await resp.text()).split("\n");
    const frag = document.createDocumentFragment();

    for (site of sites) {
        site = site.replace("\r", "");
        const link = document.createElement("a");
        link.href = `https://${site}`;
        link.innerText = site;
        frag.append(link);

        const seperator = document.createTextNode(" / ");
        frag.append(seperator);
    }

    frag.lastChild.remove();

    const ringList = document.getElementById("ring-list");
    if (ringList) ringList.append(frag);

    const ringNav = document.getElementById("ring-nav");
    if (ringNav) {
        const currentSiteIdx = (sites.indexOf(currentSite) != -1 ? sites.indexOf(currentSite) : 0) + sites.length;
        let nav = ringNavTemplate;
        nav = nav.replace("^RING_SITE^", "https://bhop.gay");
        nav = nav.replace("^LAST_SITE^", "https://" + sites[(currentSiteIdx - 1) % sites.length]);
        nav = nav.replace("^NEXT_SITE^", "https://" + sites[(currentSiteIdx + 1) % sites.length]);
        ringNav.innerHTML = nav;
    }
});
