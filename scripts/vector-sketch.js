// Media query
let canvasSize;
if (window.innerWidth > 1080) {
    canvasSize = 400;
} else {
    canvasSize = .8 * window.innerWidth;
}
const scaleDistance = canvasSize/400;


// Funciones de utilidad para tratar con vectores
function getNorm(vectorArray) {
    return Math.sqrt(vectorArray[0]**2 + vectorArray[1]**2);
}
function sumVect(vectorArrayA, vectorArrayB) {
    return [vectorArrayA[0] + vectorArrayB[0], vectorArrayA[1] + vectorArrayB[1]];
}


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
    // No hice la constante de coulomb tal cual porque de lo contrario me iba a dar una fuerza extremadamente desproporcionada
    getFieldAt(position) {
        const k = 4;
        // Uso esta constante (k) junto con scaleDistance para que la simulacion quede bien.
        // La distancia esta en unidades de pixel
        // y la carga en Coulombs. Pese a esta diferencia de unidades el comportamiento deberia ser el mismo
        let r = getNorm([this.pos[0] - position[0], this.pos[1] - position[1]])/(k * scaleDistance);
        // calculo r (norma) de la distancia. Dividido por la proporcionalidad
        return [(this.chargeValue / (r**3)) * (this.pos[0] - position[0])/k  * scaleDistance,
        (this.chargeValue / (r**3)) * (this.pos[1] - position[1])/k * scaleDistance];
        // Retorno un vector (array) que se cacula matematicamente como el vector campo electrico.
        // Incluye magnitud, sentido y direccion.
    }
}


// Clase particula. Su trayectoria sigue el flujo
class Particle {
    constructor(x, y) {
        this.pos = [x, y];
    }
    update(field) {
        this.pos[0] += field[0];
        this.pos[1] += field[1];
    }
}


// Funcion que calcula el campo total con principio de superposicion
function getTotalField(position) {
    let fieldA = chargeA.getFieldAt(position);
    let fieldB = chargeB.getFieldAt(position);

    return sumVect(fieldA, fieldB);
}

/*
Aqui termina la fisica

Aqui empieza la logica con p5.js (lo que uso pa graficar)
*/

// Creo sliders
let particleSlider, trailSlider, posChargeSlider, negChargeSlider, viewSelect, distanceSlider;
let particleArray = [];
// Creo ambas cargas
let chargeA = new Charge(canvasSize / 5, canvasSize / 2, 70);
let chargeB = new Charge(4 * canvasSize / 5, canvasSize / 2, -70);
let arrowSteps;


function setup() {
    var myCanvas = createCanvas(canvasSize, canvasSize);
    myCanvas.parent("canvas");
    background(0, 0, 0);
    fill(0, 255, 255);

    particleSlider = select("#particleSlider");
    trailSlider = select("#trailSlider");
    posChargeSlider = select("#posChargeSlider");
    negChargeSlider = select("#negChargeSlider");
    viewSelect = select("#viewSelect");
    distanceSlider = select("#distanceSlider");
}


function draw() {
    if (!viewSelect.checked()) {
        // Simulacion de particulas
        noStroke();
        background(0, 0, 0, 255 - trailSlider.value());

        // Genero particulas
        for (let i = 0; i < 10; i++) {
            particleArray.push(new Particle(Math.random() * canvasSize, Math.random() * canvasSize));
            while (particleArray.length > particleSlider.value()) { particleArray.shift() }
        }

        fill(0, 250, 250, 100)
        // Actualizo particulas y las dibujo
        for (const particle of particleArray) {
            let field = getTotalField(particle.pos);
            particle.update(field);
            ellipse(particle.pos[0], particle.pos[1], canvasSize/200, canvasSize/200);
        }
    } else {
        // Campo vectorial
        stroke("red");
        background(255);
        fill(255, 0, 0);

        arrowSteps = canvasSize/20
        for (let x = 0; x < canvasSize + 1; x += arrowSteps) {
            for (let y = 0; y < canvasSize + 1; y += arrowSteps) {
                vector = getTotalField([x, y]);
                norm = getNorm(vector);
                strokeWeight(Math.max(Math.min(norm, 2), 1));
                pond = min(map(norm, 0, 15, 10, 20), 21) * scaleDistance;
                line(x, y, x + pond * vector[0]/norm, y + pond * vector[1]/norm);
                t = [x +  vector[0]/norm, y + vector[1]/norm];
                // XDDDDDDDDDDD
                ellipse(t[0], t[1], arrowSteps/5, arrowSteps/5);
            }
        }
    }
    // Dibujo las cargas
    chargeA.chargeValue = posChargeSlider.value();
    chargeA.pos[0] = (canvasSize - distanceSlider.value() * scaleDistance)/2;
    if (chargeA.chargeValue > 0) { fill(255, 0, 0); } else { fill(0, 0, 255); }
    ellipse(chargeA.pos[0], chargeA.pos[1], canvasSize/20, canvasSize/20);

    chargeB.chargeValue = negChargeSlider.value();
    chargeB.pos[0] = (canvasSize + distanceSlider.value() * scaleDistance)/2;
    if (chargeB.chargeValue > 0) { fill(255, 0, 0); } else { fill(0, 0, 255); }
    ellipse(chargeB.pos[0], chargeB.pos[1], canvasSize/20, canvasSize/20);
}
