const DEBUG = false;

String.prototype.reverse = function() {
  var s = "";
  var i = this.length;
  while (i>0) {
      s += this.substring(i-1,i);
      i--;
  }
  return s;
}

// inspired by insect.christmas | speed is stolen and stealed from there
const divContainer = document.getElementById("trail-container");
const mainTable = document.getElementById("main-table");
const randomChance = Math.floor(Math.random() * 1000);

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
// var PLACEHOLDER = '<img src="assets/img/spiny.gif" width="100" class="trail"></img>';
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


var keylogger = [];
var passwordString = "";
var lastToggled = "";
document.onkeyup = (event) => {
  lastToggled = "";
  if (keylogger.length == 20) keylogger.pop();
  keylogger.unshift(event.key);
  passwordString = keylogger.join("").reverse();
  console.log(passwordString);
  
  
  var funky = keybinds[event.key]?.func || (() => {});
  funky();
}

document.addEventListener("click", (event) => {event.pointerType !== "touch" && changeSpeedMode()});
window.oncontextmenu = toggleCollect;

const sleep = ms => new Promise(r => setTimeout(r, ms));


var speedReplacement = null;
/* epic speeds
// laser speed lmao leave trails behind
// speedReplacement = (target, pos) => {return Math.min(1.2, (Math.random() * 200) / 100)}
// gpu split
// speedReplacement = (target, pos) => {return Math.max(1.2, (Math.random() * 2) + 1)}
*/
// speedReplacement = (target, pos) => {return Math.min(1.2, (Math.random() * 200) / 100)}
// speedReplacement = (target, pos) => {return Math.max(1.2, (Math.random() * 2) + 1)}

// funni meme
var disableControls = false;
var randomPosOffset = {x: () => 0, y: () => 0};
// speedReplacement = (target, pos) => {return pos.x}

var posReplacement = null;
// posReplacement = (target, pos, speed, totalFrames) => {return {x: totalFrames % screen.availWidth, y: (totalFrames % screen.availHeight)}};

var velocity = {x: 1.5, y: 1.5}
// var velocity = {x: 0, y: 1}
// var velocity = {x: 0, y: 0};
var DAMPANEING = 0.99
var enableTableBounds = false;
var posReplacementDVD = (index, target, pos, speed, totalFrames) => {
  var borderHeight = screen.availHeight - 150;
  var borderWidth = screen.availWidth - 75;
  frameCounter = totalFrames % 1000

  if (pos.x >= borderWidth || pos.x <= 0) {
    velocity = {x: (pos.x >= borderWidth) ? (-Math.abs(velocity.x)) : Math.abs(velocity.x), y: (velocity.y)}
    
    // ohhh its so damp :333
    // velocity = {x: velocity.x * DAMPANEING, y: velocity.y * DAMPANEING}
  }

  if (pos.y >= borderHeight || pos.y <= 0 ) {
    velocity = {x: velocity.x, y: (pos.y >= borderHeight) ? (-Math.abs(velocity.y)) : Math.abs(velocity.y)}
    
    // ohhh its so damp :333
    // velocity = {x: velocity.x * DAMPANEING, y: velocity.y * DAMPANEING}
  }

  if (enableTableBounds) {
    var tableBounds = mainTable.getBoundingClientRect();

    // && pos.y < top && pos.y > bottom
    if (pos.x > tableBounds.left && pos.x < tableBounds.right && pos.y > tableBounds.top && pos.y < tableBounds.bottom) {
      velocity = {x: (pos.x >= tableBounds.left) ? (-Math.abs(velocity.x)) : Math.abs(velocity.x), y: (pos.y >= tableBounds.top) ? (-Math.abs(velocity.y)) : Math.abs(velocity.y)}
      console.log()
      
      // ohhh its so damp :333
      // velocity = {x: velocity.x * DAMPANEING, y: velocity.y * DAMPANEING}
    }
  }

  console.log(`${index}: ${pos.x}/${velocity.x}, ${pos.y}/${velocity.y} | ${screen.availHeight}`)
  return {x: pos.x += velocity.x, y: pos.y += velocity.y};
}


function runRand(num, first = true) {
  switch (num) {
    case 123:
      disableControls = true;
      collectEnabled = false;
      // CONSTSPEED = 2;
      speedReplacement = () => {return Math.random() > 0.5 ? 2 : 1.9}
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
      // speedReplacement = null;
      randomPosOffset = {x: () => 0, y: () => 0};
      disableControls = false;
      break;
  }
  currentElement = PLACEHOLDER.replace("{TRAILCONTENTPLACEHOLDER}", TRAILCONTENT);

  // reinit | move to func eventually
  if (!first) {
    divContainer.innerHTML = "";
    mouseTrail = [];
    setup();
  }
}
runRand(randomChance);

var dvdToggle = false;
var funniDVDToggle = false

var totalFrames = 0
var idleFrames = 0;
var oldestMouseTrail = {x: 0, y: 0};
function update() {
  totalFrames += 1
  // very creative solution to merge all trails on idle
  // if (oldestMouseTrail && oldestMouseTrail == mouseTrail[0]) mouseTrail.pop();
  // oldestMouseTrail = mouseTrail[0];
  
  posTracker.forEach((pos, index) => {
    trailObject = trailObjects[index];

    // this decides how they collect at the start
    var target = mouseTrail[index * OFFSET] || { x: pos.x, y: pos.y };

    // random funni
    target.x += randomPosOffset.x();
    target.y += randomPosOffset.y();

    speed = getSpeed(target, pos);

    // for collect
    if (collectEnabled && index > 0 && idleFrames > idleFramesThreshold) {
      if (index == 100) console.log(`${mouseTrail.length} t: ${posTracker[index - 1].x}, ${posTracker[index - 1].y} | m: ${mouseTrail[(index - 1) * OFFSET].x}, ${mouseTrail[(index - 1) * OFFSET].y}`)
      // mouseTrail = []
      target = posTracker[(index - 1) * OFFSET];
      // pos = target;
      // posTracker[index * OFFSET] = posTracker[(index - 1) * OFFSET];
      // target = mouseTrail[(index - 1) * OFFSET];
      
      mouseTrail[index * OFFSET] = target;//mouseTrail[(index - 1) * OFFSET] = target;
      // speed = 0.01

      speed = Math.max(0.01, 0.05 / index);//Math.max(0.05, 0.1 / index);//
      // idleFrames = 0;
    }

    var tableBounds = mainTable.getBoundingClientRect();
    if (target.x > tableBounds.left && target.x < tableBounds.right && target.y > tableBounds.top && target.y < tableBounds.bottom) {
      velocity = {x: velocity.x, y: (target.y >= tableBounds.left) ? (-Math.abs(velocity.y)) : Math.abs(velocity.y)}
      // console.log("meow | bounds hit")
      
      // ohhh its so damp :333
      // velocity = {x: velocity.x * DAMPANEING, y: velocity.y * DAMPANEING}
    }
  
    // pos = {x: target.x += velocity.x, y: target.y += velocity.y};

    pos = applyPos(index, target, pos, speed, totalFrames)
    
    
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

  passCheck();

  // this calls the callback on the monitors refresh rate, pretty epic | not called on unfocus
  requestAnimationFrame(update);
}

function applyPos(index, target, pos, speed, totalFrames) {
  if (posReplacement) return posReplacement(index, target, pos, speed, totalFrames);
  pos.x += (target.x - pos.x) * speed;
  pos.y += (target.y - pos.y) * speed;
  return pos;
}

function getSpeed(target, pos) {
  if (speedReplacement) return speedReplacement(target, pos);
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

function passCheck() {
  if (passwordString.endsWith("iluvluma")) {
    lastToggled = "iluvluma";
    dvdToggle = !dvdToggle;
    enableTableBounds = false;
    posReplacement = (dvdToggle) ? posReplacementDVD : null;
  } else if (lastToggled == "iluvluma") {
    dvdToggle = false;
    enableTableBounds = true;
    posReplacement = null;
  }

  if (passwordString.endsWith("me0w") && lastToggled !== "me0w") {
    lastToggled = "me0w";
    dvdToggle = !dvdToggle;
    posReplacement = (dvdToggle) ? posReplacementDVD : null;
  }
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
    trailObject = trailElement//.replace(":3", trailObjects.length + i);
    if (DEBUG) trailObject = trailElement.replace(":3", trailObjects.length + i);
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
  // var randomScreenPos = () => {return {x: screen.availWidth / 2, y: screen.availHeight / 2 + 50}}
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
