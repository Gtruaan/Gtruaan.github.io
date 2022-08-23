class Charge {
    constructor(x, y, chargeValue) {
        this.pos = [x, y];
        this.chargeValue = chargeValue;
    }
    // No Culon's constant because otherwise field would be huuuuuuuge at the scale we're working on
    getFieldAt(position) {
        let r = Math.sqrt((this.pos[0] - position[0]) ** 2 + (this.pos[1] - position[1]) ** 2);
        // ???????
        return [(this.chargeValue / (r ** 2)) * (this.pos[0] - position[0]),
        (this.chargeValue / (r ** 2)) * (this.pos[1] - position[1])];
    }
}

class Particle {
    constructor(x, y) {
        this.pos = [x, y];
        this.acc = [0, 0];
        this.vel = [0, 0];
    }
    update(field) {
        this.pos[0] += this.vel[0];
        this.pos[1] += this.vel[1];
        this.vel[0] += field[0];
        this.vel[1] += field[1];
    }

}

function setup() {
    var myCanvas = createCanvas(400, 400);
    myCanvas.parent("canvas");
    background(0, 0, 0);
    fill(0, 255, 255);
}

let particleArray = [];
let chargeArray = [];

function getTotalField(position) {
    let fieldSum = [0, 0];
    for (const charge of chargeArray) {
        let field = charge.getFieldAt(position);
        fieldSum[0] += field[0];
        fieldSum[1] += field[1];
    }
    return fieldSum;
}

chargeArray.push(new Charge(50, 200, 2))
chargeArray.push(new Charge(350, 200, -2))

for (let i = 0; i < 900; i++) {
    particleArray.push(new Particle(Math.random() * 400, Math.random() * 400))
}

function draw() {
    clear()
    background(0, 0, 0,)

    for (let i = 0; i < 10; i++) {
        particleArray.push(new Particle(Math.random() * 400, Math.random() * 400))
        particleArray.shift()
    }

    fill(0, 250, 250, 80)
    for (const particle of particleArray) {
        let field = getTotalField(particle.pos);
        particle.update(field)
        ellipse(particle.pos[0], particle.pos[1], 3, 3)
    }

    for (const charge of chargeArray) {
        if (charge.chargeValue >= 0) { fill(255, 0, 0) } else { fill(0, 0, 255)}
        ellipse(charge.pos[0], charge.pos[1], 20, 20)
    }
}
