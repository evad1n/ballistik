import p5 from 'p5'

const BODY = {
    WIDTH: 10,
    LENGTH: 15
};
const BARREL = {
    WIDTH: 2,
    LENGTH: 12,
    OFFSET: 6
};

const MOVE_SPEED = 1.5;
const ROT_SPEED = 3;

export default class Tank {
    pos: p5.Vc

    constructor(x, y, rot, color) {
        this.pos = createVector(x, y);
        // Degrees
        /** @type {number} Body rotation in degrees */
        this.bodyRot = rot;
        this.barrelRot = rot;
    }

    draw() {
        // Update state
        this.update();

        // Draw it
        this.drawBody();
        this.drawBarrel();
    }

    // Draw the body
    drawBody() {
        push();

        translate(this.pos.x, this.pos.y);
        rotate(this.bodyRot);
        rect(-BODY.WIDTH / 2, -BODY.LENGTH / 2, BODY.WIDTH, BODY.LENGTH);
        triangle(-BODY.WIDTH / 2, -BODY.LENGTH / 2,
            -BODY.WIDTH / 2 + BODY.WIDTH, -BODY.LENGTH / 2,
            0, -BODY.LENGTH + 5);

        pop();
    }

    // Draw the gun
    drawBarrel() {
        push();

        translate(this.pos.x, this.pos.y);
        rotate(this.barrelRot);
        rect(-BARREL.WIDTH / 2, -BARREL.LENGTH / 2 - BARREL.OFFSET, BARREL.WIDTH, BARREL.LENGTH);

        pop();
    }

    /**
     * Returns the position vector for the end of the barrel
     * 
     * @returns {import("p5").Vector} The position vector for the end of the barrel
     */
    getBulletPosition() {
        return p5.Vector.add(this.pos, createVector(cos(this.barrelRot - 90), sin(this.barrelRot - 90)).mult(BARREL.LENGTH));
    }

    update() {
        // Body movement
        // W
        if (keyIsDown(87)) {
            this.pos.y -= MOVE_SPEED * sin(this.bodyRot + 90);
            this.pos.x -= MOVE_SPEED * cos(this.bodyRot + 90);
        }
        // S
        if (keyIsDown(83)) {
            this.pos.y += MOVE_SPEED * sin(this.bodyRot + 90);
            this.pos.x += MOVE_SPEED * cos(this.bodyRot + 90);
        }
        // A
        if (keyIsDown(65)) {
            this.bodyRot -= ROT_SPEED;
        }
        // D
        if (keyIsDown(68)) {
            this.bodyRot += ROT_SPEED;
        }

        // Update barrel to aim at mouse
        this.barrelRot = 90 + atan2(mouseY - this.pos.y, mouseX - this.pos.x);
    }
}