// inspired by insect.christmas | speed is stolen and stealed from there
const TRAILCONTENT = ":3";
const TRAILAMOUNT = 7;

const PLACEHOLDER = '<div class="trail">{TRAILCONTENTPLACEHOLDER}</div>';

// for setup
var trailHolders = [];
// actually used | these both will be empty because we dynamically create the elements but this means you can preadd some
var trailObjects = document.querySelectorAll(".trail");
var posTracker = Array.from({ length: trailObjects.length }, () => ({ x: 0, y: 0 }));

// track mouse pos
mouseX = window.screenX / 2;
mouseY = window.screenY / 2;
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function update() {
  posTracker.forEach((pos, index) => {
    trailObject = trailObjects[index];

    const speed = Math.random() * (0.1 - 0.01) + 0.01;
    // first trailObject will follow the mouse, others will follow the leader :3
    const target = index === 0 ? { x: mouseX, y: mouseY } : posTracker[index - 1];

    pos.x += (target.x - pos.x) * speed;
    pos.y += (target.y - pos.y) * speed;

    trailObject.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
  });

  // this calls the callback on the monitors refresh rate, pretty epic | not called on unfocus
  requestAnimationFrame(update);
}

// read :3 (creates trail elements on the page)
function setupTrailObjects(trailContent, trailAmount) {
  for (let i = 0; i < trailAmount; i++) {
    trailObject = PLACEHOLDER.replace("{TRAILCONTENTPLACEHOLDER}", trailContent);
    trailHolders.push(trailObject);
  }

  trailHolders.forEach((trailObject) => {
    divContainer.innerHTML += trailObject;
  });

  trailObjects = document.querySelectorAll(".trail");
  posTracker = Array.from({ length: trailObjects.length }, () => ({ x: 0, y: 0 }));
}

function setup() {
  setupTrailObjects(TRAILCONTENT, TRAILAMOUNT);
  update();
}

const divContainer = document.getElementById("trail-container");
if (divContainer && trailHolders.length == 0) setup();
