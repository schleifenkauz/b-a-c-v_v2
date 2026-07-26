let planet_layer, main_layer, line_layer, spiral_layer;
let natural, flat, kapelle;
let canvases;
let mobile;

const par = document.getElementById("canvas");
const header = document.getElementById("header");
const bach = document.getElementById("bach")
const heading = document.getElementById("heading");
let quotes = document.getElementsByClassName("quote");
const W = par.offsetWidth;
const H = par.offsetWidth;
const offsetY = bach.offsetHeight * 0.7 - H / 2;
const scale = W / 600 * 0.5;
console.log("Canvas size:", W, H, "Scale: ", scale);


function makeCanvas(w, h, z_index) {
    const func = (p) => {
        p.setup = () => {
            const c = p.createCanvas(w, h).parent("canvas").position(0, offsetY);
            c.style("z-index", z_index);
        }
    }
    return new p5(func);
}

function setup() {
    natural = loadImage("res/natural.png");
    flat = loadImage("res/flat.png");

    createCanvas(W, H).parent("canvas").position(0, offsetY)
        .style("z-index", 0)
    main_layer = this;
    line_layer = makeCanvas(W, H, -1);
    spiral_layer = makeCanvas(W, H, -2);
    planet_layer = makeCanvas(W, H, 1);
    //text_layer.background(255, 255, 255, 150);
    canvases = [this, line_layer, planet_layer, spiral_layer]
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

const initial_radius = 60;
const dot_appearance = 500;
let t = -dot_appearance, x = 0, y = 0, spiral_x, spiral_y, radius = initial_radius, angle = Math.PI / 2;

const PHI = (1 + Math.sqrt(5)) / 2;

const BACH = [
    {
        angle: Math.PI * 5.12, t: 80, id: "h_be", x: 0.18, y: 2, area_id: "area_be",
        accidental: () => flat, scale: 0.16, offset_y: -44, offset_x: -46
    },
    { angle: Math.PI * 3.19, t: 120, id: "h_a", x: 0.37, y: 1, area_id: "area_a", }, 
    { angle: Math.PI * 3.85, t: 160, id: "h_complete", x: 0.63, y: 3, area_id: "area_complete" },
    {
        angle: Math.PI * 5.932, t: 200, id: "h_human", x: 0.82, y: 2, area_id: "area_human",
        accidental: () => natural, scale: 0.06, offset_y: -30, offset_x: -40
    },
]
BACH.forEach(item => item.angle -= 2 * Math.PI);

const LINE_DISTANCE = 30;
const step = 3;
const clef_dx = violin_clef_points[violin_clef_points.length - 20].x - violin_clef_points[0].x;
const clef_dy = violin_clef_points[violin_clef_points.length - 20].y - violin_clef_points[0].y;

function fadeout(layer, d_alpha) {
    layer.push();
    layer.resetMatrix();

    layer.erase(d_alpha);   // amount to erase
    layer.rect(0, 0, layer.width, layer.height);

    layer.noErase();
    layer.pop();
}

let eraser = 10;

function draw() {
    main_layer.stroke(74, 0, 0, 120);
    [main_layer, planet_layer, spiral_layer, line_layer].forEach((layer) => {
        layer.push();
        layer.translate(W / 2, H * 0.5);
        layer.scale(scale);
    })
    planet_layer.clear();
    if (t <= 0) {
        const progress = (t + dot_appearance) / dot_appearance;
        planet_layer.fill(72, 0, 0, progress * 255);
        planet_layer.noStroke();
        planet_layer.ellipse(0, 0, 18 * progress, 12 * progress, Math.PI);
    } else if (t <= violin_clef_points.length) {
        for (let j = t; j < min(t + step, violin_clef_points.length); j += 1) {
            const dx = (violin_clef_points[j].x - violin_clef_points[j - 1].x);
            const dy = (violin_clef_points[j].y - violin_clef_points[j - 1].y);
            const w = interpolate(thickness, t);
            main_layer.strokeWeight(w * 1.5);
            main_layer.line(x, y, x + dx, y + dy);
            x += dx; y += dy;
        }

        if (t < violin_clef_points.length - 20) {
            planet_layer.fill(72, 0, 0, 255);
            planet_layer.noStroke();
            planet_layer.ellipse(x, y, 18, 12, Math.PI);
        }
    }
    if (t >= violin_clef_points.length - 20 && angle <= Math.PI * 4.5) {
        const prev_x = radius * Math.cos(angle) + clef_dx;
        const prev_y = radius * Math.sin(angle) + clef_dy - initial_radius;
        angle += 0.2 * step / sqrt(radius + 1);
        radius += 7 * step / sqrt(radius + 1);
        const x = radius * Math.cos(angle) + clef_dx;
        const y = radius * Math.sin(angle) + clef_dy - initial_radius;

        const opacity = 1 - max(angle - 3 * Math.PI, 0) / (1.5 * Math.PI); //Worte nacheinander
        fadeout(spiral_layer, 8);
        spiral_layer.stroke(72, 0, 0, opacity * 255);
        spiral_layer.strokeWeight(4);
        spiral_layer.line(prev_x, prev_y, x, y);

        planet_layer.fill(72, 0, 0, opacity * 255);
        planet_layer.noStroke();
        planet_layer.ellipse(x, y, 18, 12, Math.PI);

        BACH.forEach((item) => {
            if (item.painted != true && angle >= item.angle) {
                const text = document.getElementById(item.id);
                text.style.left = `${x * scale + W / 2 - 15}px`;
                text.classList.add("show");
                main_layer.fill(0);
                main_layer.noStroke();
                const y = -item.y * LINE_DISTANCE / 2;
                console.log(x, y);
                main_layer.ellipse(x, y, 30, 24, Math.PI);
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
                show(item.area_id);
                item.painted = true;
            }
        })
    }
    if (angle > Math.PI * 4.5) {
        fadeout(spiral_layer, eraser);
         eraser += 1;
        planet_layer.clear();
        angle += 0.2;
        show('title');
        show('subtitle');
    } else if (angle > Math.PI * 8) {
        spiral_layer.clear();
        main_layer.noLoop();
    }
    t += step;

    if (t > 0 && t <= 500) {
        line_layer.strokeWeight(1.5);
        line_layer.stroke(150, 150, 150, 2);
        for (let j = -3; j < 2; j++) {
            line_layer.line(-W / scale, j * LINE_DISTANCE, W / scale, j * LINE_DISTANCE);
        }
    }

    [main_layer, planet_layer, spiral_layer, line_layer].forEach((layer) => {
        layer.pop();
    })

    if (t > violin_clef_points.length) {
        quotes.forEach(quote => quote.style.opacity = 1); quotes = [];
        show("areas-intro");
        show('area_fundament');
    }
}

function show(id, opacity = 1) {
    const el = document.getElementById(id);
    el.style.opacity = opacity;
}