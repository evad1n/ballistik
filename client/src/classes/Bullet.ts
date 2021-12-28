const BULLET = {
    DIAMETER: 2,
    SPEED: MOVE_SPEED * 2,
};

export default class Bullet {
    /**
     * 
     * @param {import("p5").Vector} pos Initial firing position.
     * @param {number} dir Direction of initial bullet travel in degrees.
     */
    constructor(pos, dir) {
        this.pos = pos.copy();
        this.dir = dir + 90;
    }

    draw() {
        this.update();

        circle(this.pos.x, this.pos.y, BULLET.DIAMETER);
    }

    update() {
        this.pos.y -= BULLET.SPEED * sin(this.dir);
        this.pos.x -= BULLET.SPEED * cos(this.dir);
    }
}