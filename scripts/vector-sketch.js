/*
Aqui empieza toda la logica para generar y simular el campo

    > La clase Charge modela una carga estacionaria. Tiene un valor de carga asociado. getFieldAt es el metodo que
    calcula el vector del campo en coords. cartesianas para dada posicion.

    > La clase Particle modela las particulas de la simulacion

    > La funcion getTotalField refiere al principio de superposicion!! Suma los campos de todas las cargas presentes.
*/
class Charge {
    constructor(x, y, chargeValue) {
        this.pos = [x, y];
        this.chargeValue = chargeValue;
    }
    // No Culon's constant because otherwise field would be huuuuuuuge at the scale we're working on
    getFieldAt(position) {
        let r = Math.sqrt((this.pos[0] - position[0]) ** 2 + (this.pos[1] - position[1]) ** 2);
        // ???????
        return [(this.chargeValue / (r ** 2)) * (this.pos[0] - position[0]) / r,
        (this.chargeValue / (r ** 2)) * (this.pos[1] - position[1]) / r];
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

function getTotalField(position) {
    let fieldA = chargeA.getFieldAt(position);
    let fieldB = chargeB.getFieldAt(position);

    return [fieldA[0] + fieldB[0], fieldA[1] + fieldB[1]];
}

/*
Aqui termina la fisica

Aqui empieza la logica con p5.js
*/

// Media query
let canvasSize;
if (window.innerWidth > 768) {
    canvasSize = 400;
} else {
    canvasSize = 700;
}

let particleSlider, trailSlider, posChargeSlider, negChargeSlider, viewSelect;

let particleArray = [];
let chargeA = new Charge(canvasSize / 5, canvasSize / 2, 70);
let chargeB = new Charge(4 * canvasSize / 5, canvasSize / 2, -70);

function setup() {
    var myCanvas = createCanvas(canvasSize, canvasSize);
    myCanvas.parent("canvas");
    background(0, 0, 0);
    fill(0, 255, 255);
    noStroke();

    particleSlider = select("#particleSlider");
    trailSlider = select("#trailSlider");
    posChargeSlider = select("#posChargeSlider");
    negChargeSlider = select("#negChargeSlider");
    viewSelect = select("#viewSelect")
}

function draw() {
    if (!viewSelect.checked()) {
        background(0, 0, 0, 255 - trailSlider.value())

        for (let i = 0; i < 10; i++) {
            particleArray.push(new Particle(Math.random() * canvasSize, Math.random() * canvasSize));
            while (particleArray.length > particleSlider.value()) { particleArray.shift() }
        }

        fill(0, 250, 250, 100)
        for (const particle of particleArray) {
            let field = getTotalField(particle.pos);
            particle.update(field);
            ellipse(particle.pos[0], particle.pos[1], canvasSize / 160, canvasSize / 160);
        }
    } else {
        background(255)

        for (let x = 0; x < canvasSize; x += 10) {
            for (let y = 0; y < canvasSize; y += 10) {
                fill(0, 0, 0, 10)
                stroke(.2)
                vector = getTotalField([x, y])
                norm = (vector[0] ** 2 + vector[1] ** 2)
                line(x, y, (x + vector[0] / norm), y + (vector[1] / norm))
            }
        }
    }
    chargeA.chargeValue = posChargeSlider.value();
    if (chargeA.chargeValue > 0) { fill(255, 0, 0); } else { fill(0, 0, 255); }
    ellipse(chargeA.pos[0], chargeA.pos[1], canvasSize / 20, canvasSize / 20);

    chargeB.chargeValue = negChargeSlider.value();
    if (chargeB.chargeValue > 0) { fill(255, 0, 0); } else { fill(0, 0, 255); }
    ellipse(chargeB.pos[0], chargeB.pos[1], canvasSize / 20, canvasSize / 20);
}
