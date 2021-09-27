let bullets = [];

/** @type {Maze} */
let m;
/** @type {Tank} */
let t;

function setup() {
    angleMode(DEGREES);

    createCanvas(windowWidth, windowHeight);

    cursor(CROSS);

    m = new Maze();
    t = new Tank(300, 300, 0, "black");
}

function draw() {
    background(220);

    ellipse(50, 50, 80, 80);

    m.draw();
    t.draw();

    let p = t.getBulletPosition();
    circle(p.x, p.y, 3);

    for (const b of bullets) {
        b.draw();
    }
}

function mouseClicked() {
    bullets.push(new Bullet(t.getBulletPosition(), t.barrelRot));
}