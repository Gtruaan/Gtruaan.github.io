let wX = window.innerWidth;
let wY = window.innerHeight;

// Media query
let mobile, dropScales;
if (wX > 1080) {
    mobile = false;
    dropScale = 1;   
} else {
    mobile = true;
    dropScale = 1.5;
}

const GRAVITY = 1; 
const MIN_Z = 3 * dropScale
const MAX_Z = 17 * dropScale
let raindrops = [];
let t = 0;  


// Literally resisting basic OOP >:)
function DDrop() {
    this.x = random(0, wX);
    this.y = 0;
    this.z = random(MIN_Z, MAX_Z);
    this.a = random(70, 140);

    this.update = function(t) {
        this.y += map(this.z, MIN_Z, MAX_Z, 1, 10) * (sin(t) + 1.6)/2;
        if (this.y > wY) {
            this.x = random(0, wX);
            this.y = 0;
            this.z = random(MIN_Z, MAX_Z)
            this.a = random(70, 150);
        }
    }

    this.show = function() {
        fill(220, 0, 0, this.a);
        noStroke();
        circle(this.x, this.y, this.z);
    }
}

function UDrop() {
    this.x = random(0, wX);
    this.y = wY;
    this.z = random(MIN_Z, MAX_Z)
    this.a = random(70, 140);

    this.update = function(t) {
        this.y -= map(this.z, MIN_Z, MAX_Z, 1, 10)  * (sin(t) + 1.6)/2;
        if (this.y < 0) {
            this.x = random(0, wX);
            this.y = wY;
            this.z = random(MIN_Z, MAX_Z)
            this.a = random(70, 150);
        }
    }

    this.show = function() {
        fill(220, 0, 0, this.a);
        noStroke();
        circle(this.x, this.y, this.z);
    }
}


let terminalFont;
function preload() {
  terminalFont = loadFont('assets/VT323.ttf');
}


function setup() {
    var myCanvas = createCanvas(wX, wY);
    myCanvas.parent("canvas");
    background(40, 0, 0);
    fill(255);
    strokeWeight(10);
    textFont(terminalFont);
    textSize(100);
    textAlign(CENTER, CENTER);

    for (let i = 0; i < 200; i += 2) {
        raindrops[i] = new UDrop();
        raindrops[i + 1] = new DDrop();
    }
    
}


function draw() {
    background(40, 0, 0)
    for (let i = 0; i < raindrops.length; i++) {
        raindrops[i].update(t);
        raindrops[i].show();
      }
    fill(255);
    stroke(0)

    t = t > 100 ? 0 : t + 0.05;
    
    // Render text
    if (mobile) {
        textSize(200);
        text("gus truan", wX/2, wY/2 - 140);
        textSize(100);
        text("ing software @ PUC,,", wX/2, wY/2);
        textSize(45);
        text("no se web design !!?? :$", wX/2, wY/2 + 250);
    }
    else {
        textSize(150);
        text("gus truan :$", wX/2, wY/2 - 30);
        textSize(40);
        text("ing software @ PUC, no se web design !!", wX/2 + 60, wY/2 + 60);
    }
}