
var isSetup = false;

const oldRan = randomChance;
var epicTogle = false
var fml = false
const imageDir = "/assets/img/meow";
const BOYKISSER = '<img src="assets/img/boykisser.svg" onclick="epicTogle = !epicTogle; runRand((epicTogle) ? 69 : oldRan, false)" width="75" style="float: right; user-select: none; -moz-user-select: none;"></img>';
const RANDOMIMAGE = '<img src="{IMAGEDIRPLACEHOLDER}/{RANDOMIMAGEPLACEHOLDER}" width="75" style="float: right"></img>';

// dw about it
function toggleSpotifyThing() {
    fml = !fml
    document.getElementById("fml-thing").style = (fml) ? "z-index:-1;position:absolute;height:100vh;border-radius:12px" : "position:absolute;width:0;height:0;border:0"
}
// dw about it

function dragImage() {
    
}

function getRandomImage() {
    const index = Math.floor(Math.random() * 10);
    const filePath = `${index}.png`;

    return filePath;
}

function setupKissing() {

}

function setupImage() {
    var element = RANDOMIMAGE.replace("{IMAGEDIRPLACEHOLDER}", imageDir).replace("{RANDOMIMAGEPLACEHOLDER}", getRandomImage());
    boyContainer.innerHTML += element;
}

function setupBoykisser() {
    boyContainer.innerHTML += BOYKISSER;
}

function setupBoys() {
    setupBoykisser();
    isSetup = true;
}

const boyContainer = document.getElementById("boy-container");
if (boyContainer && !isSetup) setupBoys();