let bullets = [];

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

    for (const b of bullets) {
        b.draw();
    }
}

function mouseClicked() {
    bullets.push(new Bullet(t.pos, t.barrelRot));
}