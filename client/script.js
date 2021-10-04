let bullets = [];

/** @type {Maze} */
let m;
/** @type {Tank} */
let t;

function setup() {
    angleMode(DEGREES);

    createCanvas(windowWidth, windowHeight);

    cursor(CROSS);

    fill('white');

    // let mazeData = genMaze(10, 10);

    m = new Maze(50, 50, 10, 10, 30);
    t = new Tank(300, 300, 0, "black");
}

function draw() {
    background(220);

    m.draw();
    t.draw();

    let p = t.getBulletPosition();
    circle(p.x, p.y, 3);

    for (const b of bullets) {
        b.draw();
    }
}

function mouseClicked() {
    // bullets.push(new Bullet(t.getBulletPosition(), t.barrelRot));

    m.drawMaze(100);
}