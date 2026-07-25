let planet_layer, main_layer, interactive_layer, text_layer;
let natural, flat, kapelle;
let canvases;
let mobile;

const parent = document.getElementById("canvas");
const W = parent.offsetWidth;
const H = parent.offsetHeight;

function makeCanvas(w, h, z_index) {
    const func = (p) => {
        p.setup = () => {
            const c = p.createCanvas(w, h).parent("canvas").position(0, 0);
            c.style("z-index", z_index);
        }
    }
    return new p5(func);
}

function setup() {
    natural = loadImage("res/natural.png");
    flat = loadImage("res/flat.png");

    createCanvas(W, H).parent("canvas").position(0, 0)
        .style("z-index", 0)
    main_layer = this;
    planet_layer = makeCanvas(W, H, -1);
    text_layer = makeCanvas(W, H, 2);
    interactive_layer = makeCanvas(W, H, 3);
    //text_layer.background(255, 255, 255, 150);
    text_layer.noStroke();
    planet_layer.noStroke();
    canvases = [this, interactive_layer, planet_layer, text_layer]
    canvases.forEach((layer) => {
        layer.textFont("EB Garamond")
        layer.textSize(28);
        const scale = windowWidth / W;
        console.log("Scale", scale);
        //layer.canvas.style.transform = `scale(${1})`;
    })

    /*     mobile = windowWidth < 1200;
    
        const content = document.getElementById("content");
        const menu = document.getElementById("menu");
        if (mobile) {
            content.style.top = `${H}px`
        }
        else {
            menu.style.left = `${(windowWidth - W) / 2}px`
        } */
}

let t = 1, x = 0, y = 0;

const PHI = (1 + Math.sqrt(5)) / 2;

const BACH = [
    {
        t: 80, id: "h_be", x: 0.18, y: 2,
        accidental: () => flat, scale: 0.08, offset_y: -22, offset_x: -23
    },
    { t: 120, id: "h_a", x: 0.37, y: 1 },
    { t: 160, id: "h_complete", x: 0.63, y: 3 },
    {
        t: 200, id: "h_human", x: 0.82, y: 2,
        accidental: () => natural, scale: 0.03, offset_y: -15, offset_x: -20
    },
]

const LINE_DISTANCE = 15;
function draw() {
    main_layer.stroke(74, 0, 0, 120);
    main_layer.push();
    main_layer.translate(W / 2, H / PHI);
    main_layer.scale(0.5)
    const step = 3;
    for (let j = t * step; j < min((t + 1) * step, violin_clef_points.length); j += 1) {
        const dx = (violin_clef_points[j].x - violin_clef_points[j - 1].x);
        const dy = (violin_clef_points[j].y - violin_clef_points[j - 1].y);
        const w = interpolate(thickness, t);
        main_layer.strokeWeight(w * 1.5);
        main_layer.line(x, y, x + dx, y + dy);
        x += dx; y += dy;
    }
    t += 1;
    main_layer.pop();

    if (t <= 500) {
        planet_layer.strokeWeight(1.5);
        planet_layer.stroke(150, 150, 150, 2);
        for (let j = -3; j < 2; j++) {
            planet_layer.line(0, j * LINE_DISTANCE + H / PHI, W, j * LINE_DISTANCE + H / PHI);
        }
    }

    BACH.forEach((item) => {
        if (t == item.t) {
            const text = document.getElementById(item.id);
            text.style.left = `${item.x * W - 15}px`;
            text.classList.add("show");
            main_layer.fill(30);
            main_layer.noStroke();
            const x = item.x * W;
            const y = H / PHI - item.y * LINE_DISTANCE / 2;
            main_layer.ellipse(x, y, 15, 12, Math.PI);
            if (item.accidental) {
                const img = item.accidental();
                main_layer.image(img, 
                    x + item.offset_x, y + item.offset_y,
                    img.width * item.scale, img.height * item.scale
                );
            }
            const part = text.getElementsByClassName("heading-part")[0];
            if (part) {
                part.style.opacity = 0.65;
            }
        }
    })
}