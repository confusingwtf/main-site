
var isSetup = false;

const oldRan = randomChance;
var epicTogle = false
var fml = false
const baseDir = "/assets/meow";
const BOYKISSER = '<img src="assets/img/boykisser.svg" onclick="epicTogle = !epicTogle; runRand((epicTogle) ? 69 : oldRan, false)" width="75" style="float: right; user-select: none; -moz-user-select: none;"></img>';
const RANDOMIMAGE = '<img src="{BASEDIRPLACEHOLDER}/{RANDOMIMAGEPLACEHOLDER}" width="75" style="float: right"></img>';
// could add var onvidend, return in setupelem so rolls cant happen until vid finished, maybe setup dict, certain longer vids can be skipped/rerolled and ignore var some cant some loop
const RANDOMVID = '<video id="funni-vid" autoplay meow onloadstart="this.volume=0.3;lastVidEnded=false" src="{BASEDIRPLACEHOLDER}/{RANDOMVIDPLACEHOLDER}" poster="{BASEDIRPLACEHOLDER}/{RANDOMPOSTERPLACEHOLDER}" width="125" style="float: right"></video>';
var clicked = false;

var missedCombo = 0;
var lastVidIndex = -1;
var lastVidEnded = true;

const missChance = 15//33;
const missThreshold = 3;
const updateTime = (!DEBUG) ? 30000 : 5000 //5000

document.onclick = (event) => {
    clicked = true;
    const delay = Math.max(Math.random() * 15000, 1000)
    console.log(`delayed ban commencing ${Math.floor(delay)}ms`)
    setTimeout(updateB, (!DEBUG) ? delay : 0);
    document.onclick = () => {};
}

// dw about it
function toggleSpotifyThing() {
    fml = !fml;
    document.getElementById("fml-thing").style = (fml) ? "z-index:-1;position:absolute;height:100vh;border-radius:12px" : "position:absolute;width:0;height:0;border:0"
}
// dw about it


function dragImage() {
    
}


//<img> tag is both img and gif/webm so
function getRandomImage() {
    const index = Math.round(Math.random() * 100) % 10;
    const filePath = `img/${index}.funni`;

    return "img/cape.funni"//filePath;
}

const mraow = 2;
const BUGGIN = true;
function getRandomVid() {
    const index = (!DEBUG || !BUGGIN) ? Math.round(Math.random() * 100) % 11 : mraow; // & numOfFiles#
    // no repeats :3
    if (index == lastVidIndex && index !== mraow) {
        console.log("boring... reroll vid");
        return getRandomVid();
    }

    const filePath = `vids/${index}.mp4`;

    // theres some fucked ternary u can do to put in in the return but no
    // if (index == mraow && Math.round(Math.random() * 100) < 80) {
    //     console.log(":3");
    //     if (!DEBUG) return getRandomVid();
    // }
    if (index == mraow) {
        console.log("hit");
        if (Math.round(Math.random() * 100) < 80) {
            console.log(":3");
            if (!DEBUG) return getRandomVid();
        }
    }

    lastVidIndex = index;
    return filePath;
}


var mutedVidToggle = false
function toggleVidAudio() {
    mutedVidToggle = !mutedVidToggle;
    // epik hack ngl
    const vid = document.getElementById("funni-vid");
    if (!vid) return;
    vid.outerHTML = vid.outerHTML.replace('muted=""', 'meow=""').replace('meow=""', (mutedVidToggle) ? 'muted=""' : 'meow=""')
    console.log(vid.outerHTML);
}


function updateB() {
    // console.log("meow")
    const rolledChance = Math.round(Math.random() * 100);
    // console.log(rolledChance);
    if (rolledChance <= missChance && missedCombo <= missThreshold) {
        missedCombo += 1;
        console.log(`succesfully missed ${missedCombo} funnis${"!".repeat(missedCombo)}`)
        return;
    }
    missedCombo = 0;
    setupElem();
}
setInterval(updateB, updateTime);


function setupKissing() {

}

function setupElem() {
    if (!clicked) return;
    funniContainer = document.getElementById("funni-container");
    // wtf do i name this
    var mediaChoice = RANDOMVID//(Math.random() * 100 < 50) ? RANDOMVID : RANDOMIMAGE;
    var placeholderText = (mediaChoice == RANDOMVID) ? "{RANDOMVIDPLACEHOLDER}" : "{RANDOMIMAGEPLACEHOLDER}";
    var placeholderFunc = (mediaChoice == RANDOMVID) ? getRandomVid : getRandomImage;
    var randItem = placeholderFunc();

    // dont end
    if (DEBUG && BUGGIN && !lastVidEnded) return;

    var element = mediaChoice.replaceAll("{BASEDIRPLACEHOLDER}", baseDir).replace(placeholderText, randItem).replace('meow', (mutedVidToggle) ? "muted" : 'meow');
    // AWESOME HACK
    element = element.replace("{RANDOMPOSTERPLACEHOLDER}", getRandomImage());
    // console.log(element)
    // console.log(funniContainer)
    

    funniContainer.innerHTML = element;

    const vid = document.getElementById("funni-vid");
    vid.onended = () => {
        vid.style.display = "none";
        lastVidEnded = true;
    }
    // funniContainer.appendChild(element);
}

function setupBoykisser() {
    // boyContainer.innerHTML += BOYKISSER;
    boyContainer.innerHTML = `${BOYKISSER}${boyContainer.innerHTML}`;
}

function setupBoys() {
    setupBoykisser();

    setupElem();

    isSetup = true;
}

const boyContainer = document.getElementById("boy-container");
var funniContainer = document.getElementById("funni-container");
if (boyContainer && !isSetup) setupBoys();