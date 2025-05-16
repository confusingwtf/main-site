// inspired by insect.christmas | speed is stolen and stealed from there
const divContainer = document.getElementById("trail-container");
// configureationndagion
var TRAILCONTENT = ":3";
var TRAILAMOUNT = 70;
const idleFramesThreshold = 100//100;

var curSpeed = 0;
var collectEnabled = true;

//
var speed = 0.5;
var speedModes = ["constant", "trailing", "tomfoolery"];
var currentSpeedMode = speedModes[curSpeed];

// consts
var PLACEHOLDER = '<div width="75" class="trail">{TRAILCONTENTPLACEHOLDER}</div>';
const OFFSET = 1;
var CONSTSPEED = 0.5;

// runtime shit
// for setup
var trailHolders = [];
// actually used | these both will be empty because we dynamically create the elements but this means you can preadd some
var trailObjects = document.querySelectorAll(".trail");
var posTracker = Array.from({ length: trailObjects.length }, () => ({ x: 0, y: 0 }));

// track mouse pos
var mouseTrail = [];
mouseX = window.screen.availWidth / 2;
mouseY = window.screen.availHeight / 2;
var dropCounter = 0;
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dropCounter++
  // dont update too often on small movements
  if (dropCounter < 2) return;
  dropCounter = 0;
  // 
  if (mouseTrail.length > TRAILAMOUNT * (OFFSET + 2)) mouseTrail.pop();
  // push to start of the array
  mouseTrail.unshift({ x: mouseX, y: mouseY });
});


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
const randomChance = Math.random() * 1000;

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

// document.addEventListener("click", (e) => {
//   mouseTrail = mouseTrail.map((trail, index) => {
//     return mouseTrail[index - 1] || { x: mouseX, y: mouseY };
//     // return { x: mouseX, y: mouseY };
//   });
//   // mouseTrail = new Array(mouseTrail.length).fill({ x: mouseX, y: mouseY });
// });

document.addEventListener("click", changeSpeedMode);
window.oncontextmenu = toggleCollect;

const sleep = ms => new Promise(r => setTimeout(r, ms));

var idleFrames = 0;
var oldestMouseTrail = {x: 0, y: 0};
function update() {
  // very creative solution to merge all trails on idle
  // if (oldestMouseTrail && oldestMouseTrail == mouseTrail[0]) mouseTrail.pop();
  // oldestMouseTrail = mouseTrail[0];

  
  // if (collectEnabled && idleFrames > 100) {
  //     posTracker = posTracker.map((trail, index) => {
  //       return posTracker[index - 1] || { x: mouseX, y: mouseY };
  //       // return { x: mouseX, y: mouseY };
  //     });
  // }

  
  posTracker.forEach((pos, index) => {
    trailObject = trailObjects[index];

    speed = getSpeed();
    // first trailObject will follow the mouse (directly looks like shortest path), others will follow the leader :3
    // const target = index === 0 ? { x: mouseX, y: mouseY } : posTracker[index - 1];
    // follow mouse path not just directly (looks epicer)
    var target = mouseTrail[index * OFFSET] || mouseTrail[0] || { x: pos.x, y: pos.y };
    // random funni
    target.x += randomPosOffset.x();
    target.y += randomPosOffset.y();

    // for collect
    if (collectEnabled && posTracker[(index - 1) * OFFSET] && idleFrames > idleFramesThreshold) {
      target = posTracker[(index - 1) * OFFSET];
      mouseTrail[index * OFFSET] = target;//mouseTrail[(index - 1) * OFFSET] = target;
      speed = Math.max(0.01, 0.05 / index);//Math.max(0.05, 0.1 / index);//
      // idleFrames = 0;
    }

    pos.x += (target.x - pos.x) * speed;
    pos.y += (target.y - pos.y) * speed;

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
// read :3 (creates trail elements on the page)
function setupTrailObjects(trailContent, trailAmount) {
  trailHolders = [];
  trailObjects = [];

  for (let i = 0; i < trailAmount; i++) {
    trailObject = PLACEHOLDER.replace("{TRAILCONTENTPLACEHOLDER}", trailContent);
    trailHolders.push(trailObject);
  }

  trailHolders.forEach((trailObject) => {
    divContainer.innerHTML += trailObject;
  });

  trailObjects = document.querySelectorAll(".trail");
  posTracker = Array.from({ length: trailObjects.length }, () => ({ x: Math.random() * mouseX * Math.max(3, TRAILAMOUNT / 150), y: Math.random() * mouseY * Math.max(3, TRAILAMOUNT / 150) }));

  trailObjects.forEach((trailObject, index) => {
    trailObject.style.opacity = Math.max(1 - index / (TRAILAMOUNT - 1), 0.005);
  });
}

function setup() {
  setupTrailObjects(TRAILCONTENT, TRAILAMOUNT);
  update();
}

if (divContainer && trailHolders.length == 0) setup();
