// inspired by insect.christmas | speed is stolen and stealed from there
const divContainer = document.getElementById("trail-container");
const randomChance = Math.random() * 1000;

// configureationndagion
var TRAILCONTENT = ":3";
var TRAILAMOUNT = 70;
const idleFramesThreshold = 100//100;

var curSpeed = 1;
var collectEnabled = true;

//
var speed = 0.5;
var speedModes = ["constant", "trailing", "tomfoolery"];
var currentSpeedMode = speedModes[curSpeed];

// consts
var PLACEHOLDER = '<div width="75" class="trail">{TRAILCONTENTPLACEHOLDER}</div>';
const DEFAULTELEMENT = PLACEHOLDER.replace("{TRAILCONTENTPLACEHOLDER}", TRAILCONTENT);
const OFFSET = 1;
var CONSTSPEED = 0.5;

const keybinds = {
  "o" : {"func" : () => runRand(444, false)},
  "ö" : {"func" : () => runRand(444, false)},
  "ArrowUp" : {"func": () => setTrail(currentElement, () => {return {x: Math.random() * mouseX * Math.max(3, TRAILAMOUNT / 150), y: Math.random() * mouseY * Math.max(3, TRAILAMOUNT / 150)} || posTracker[0] || {x: 0, y: 0}}, 10)}
}

// runtime shit
// for setup
var trailHolders = [];
// actually used | these both will be empty because we dynamically create the elements but this means you can preadd some
var trailObjects = document.querySelectorAll(".trail");
var posTracker = Array.from({ length: trailObjects.length }, () => ({ x: 0, y: 0 }));
var currentElement = DEFAULTELEMENT;

// track mouse pos
var mouseTrail = [];
var mouseX = window.screen.availWidth / 2;
var mouseY = window.screen.availHeight / 2;
var dropCounter = 0;
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dropCounter++
  // dont update too often on small movements
  if (dropCounter < 2) return;
  dropCounter = 0;
  // 
  if (mouseTrail.length > trailObjects.length * (OFFSET + 2)) mouseTrail.pop();
  // push to start of the array
  mouseTrail.unshift({ x: mouseX, y: mouseY });
});

document.onkeyup = (event) => {
  var funky = keybinds[event.key]?.func || (() => {});
  funky();
}

document.addEventListener("click", (event) => {event.pointerType !== "touch" && changeSpeedMode()});
window.oncontextmenu = toggleCollect;

const sleep = ms => new Promise(r => setTimeout(r, ms));



/* epic speeds
// laser speed lmao leave trails behind
// speedReplacement = () => {return Math.min(1.2, (Math.random() * 200) / 100)}
// gpu split
// speedReplacement = () => {return Math.max(1.2, (Math.random() * 2) + 1)}
*/

// funni meme
var disableControls = false;
var randomPosOffset = {x: () => 0, y: () => 0};
var speedReplacement;

function runRand(num, first = true) {
  switch (num) {
    case 123:
      disableControls = true;
      collectEnabled = false;
      CONSTSPEED = 2;
      // speedReplacement = () => {return Math.random() > 0.5 ? 2 : 1.9}
      TRAILAMOUNT = 900//750;
      TRAILCONTENT = "?";
      randomPosOffset.x = () => { let rand = Math.random() * 0.1; return Math.random() > 0.5 ? rand : -rand};
      randomPosOffset.y = () => { let rand = Math.random() * 0.1; return Math.random() > 0.5 ? rand : -rand};
      break;
    case 69:
      PLACEHOLDER = '<img src="assets/img/boykisser.svg" width="75" class="trail">{TRAILCONTENTPLACEHOLDER}</img>';
      // CONSTSPEED = 2;
      TRAILAMOUNT = TRAILAMOUNT;
      TRAILCONTENT = "";
      break;
    case 444:
      TRAILAMOUNT = 220;
      break;
    default:
      PLACEHOLDER = '<div width="75" class="trail">{TRAILCONTENTPLACEHOLDER}</div>';
      TRAILCONTENT = ":3";
      speedReplacement = null;
      randomPosOffset = {x: () => 0, y: () => 0};
      disableControls = false;
      break;
  }

  // reinit | move to func eventually
  if (!first) {
    divContainer.innerHTML = "";
    mouseTrail = [];
    setup();
  }
}
runRand(randomChance);


var idleFrames = 0;
var oldestMouseTrail = {x: 0, y: 0};
function update() {
  // very creative solution to merge all trails on idle
  // if (oldestMouseTrail && oldestMouseTrail == mouseTrail[0]) mouseTrail.pop();
  // oldestMouseTrail = mouseTrail[0];
  
  posTracker.forEach((pos, index) => {
    trailObject = trailObjects[index];

    speed = getSpeed();
    // this decides how they collect at the start
    var target = mouseTrail[index * OFFSET] || { x: pos.x, y: pos.y };

    // random funni
    target.x += randomPosOffset.x();
    target.y += randomPosOffset.y();

    // for collect
    if (collectEnabled && index > 0 && idleFrames > idleFramesThreshold) {
      if (index == 100) console.log(`${mouseTrail.length} t: ${posTracker[index - 1].x}, ${posTracker[index - 1].y} | m: ${mouseTrail[(index - 1) * OFFSET].x}, ${mouseTrail[(index - 1) * OFFSET].y}`)
      // mouseTrail = []
      target = posTracker[(index - 1) * OFFSET];
      // posTracker[index * OFFSET] = posTracker[(index - 1) * OFFSET];
      // target = mouseTrail[(index - 1) * OFFSET];
      
      mouseTrail[index * OFFSET] = target;//mouseTrail[(index - 1) * OFFSET] = target;
      // speed = 0.01

      speed = Math.max(0.01, 0.05 / index);//Math.max(0.05, 0.1 / index);//
      // idleFrames = 0;
    }


    pos.x += (target.x - pos.x) * speed;
    pos.y += (target.y - pos.y) * speed;
    // if (collectEnabled && index > 0 && idleFrames > idleFramesThreshold)
    // mouseTrail[index * OFFSET] = pos;

    trailObject.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
  });

  if (oldestMouseTrail == mouseTrail[0]) idleFrames++;
  // you choose else if selection on every tick or assignment what better
  else if (idleFrames > 0) {
    idleFrames = 0;
    // mouseTrail = mouseTrail.map((trail, index) => {
    //   // return mouseTrail[index - 1] || { x: mouseX, y: mouseY };
    //   return { x: mouseX, y: mouseY };
    // });
  }
  oldestMouseTrail = mouseTrail[0];

  // this calls the callback on the monitors refresh rate, pretty epic | not called on unfocus
  requestAnimationFrame(update);
}

function getSpeed() {
  if (speedReplacement) return speedReplacement();
  switch (currentSpeedMode) {
    case "trailing":
      speed = Math.random() * (0.1 - 0.01) + 0.01;
      break;
    case "constant":
      speed = CONSTSPEED;
      break;
    case "tomfoolery":
      speed = Math.random();
      break;
  }
  return speed;
}

// config shit
function changeSpeedMode() {
  if (disableControls) return;
  curSpeed = (curSpeed + 1) % speedModes.length;
  currentSpeedMode = speedModes[curSpeed]; 
}

// toggles if, on idle, they merge on the mouse still
function toggleCollect() {
  if (disableControls) return;
  collectEnabled = !collectEnabled;
}


// setup shit
function setTrail(trailElement, pos, size = 0, replace = true) {
  currentElement = trailElement;
  trailObjects = document.querySelectorAll(".trail");

  if (replace) {
    trailObjects.forEach((element, index) => {
      element = trailElement;
    });
    posTracker = Array.from({ length: trailObjects.length }, () => (pos()));
    trailObjects.forEach((trailObject, index) => {
      trailObject.style.opacity = Math.max(1 - index / (trailObjects.length - 1), 0.005);
    });
  }

  for (let i = 0; i < size; i++) {
    trailObject = trailElement.replace(":3", trailObjects.length + i);
    trailHolders.push(trailObject);
  }

  trailHolders.forEach((trailObject) => {
    divContainer.innerHTML += trailObject;
  });

  trailObjects = document.querySelectorAll(".trail");
  posTracker = Array.from({ length: trailObjects.length }, () => (pos()));
  setupOpacity(trailObjects);
  TRAILAMOUNT = trailObjects.length;
}

function setupOpacity(objects) {
  objects.forEach((object, index) => {
    object.style.opacity = Math.max(1 - index / (objects.length - 1), 0.005);
  });
}

// read :3 (creates trail elements on the page)
function setupTrailObjects(trailContent, trailAmount) {
  var randomScreenPos = () => {return {x: Math.random() * mouseX * Math.max(3, TRAILAMOUNT / 150), y: Math.random() * mouseY * Math.max(3, TRAILAMOUNT / 150) }};
  setTrail(currentElement, randomScreenPos, trailAmount, false);
  // setTrail(trailElement);
  

  trailObjects = document.querySelectorAll(".trail");
  posTracker = Array.from({ length: trailObjects.length }, () => (randomScreenPos()));

  setupOpacity(trailObjects);
}

function setup() {
  trailHolders = [];
  trailObjects = [];
  setupTrailObjects(TRAILCONTENT, TRAILAMOUNT);
  update();
}

if (divContainer && trailHolders.length == 0) setup();
