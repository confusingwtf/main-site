
var isSetup = false;

// const oldRan = randomChance;
var epicTogle = false
const imageDir = "/assets/img/meow";
const BOYKISSER = '<img src="assets/img/boykisser.svg" onclick="epicTogle = !epicTogle; runRand((epicTogle) ? 69 : oldRan, false)" width="75" style="float: right"></img>';
const RANDOMIMAGE = '<img src="{IMAGEDIRPLACEHOLDER}/{RANDOMIMAGEPLACEHOLDER}" width="75" style="float: right"></img>';


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