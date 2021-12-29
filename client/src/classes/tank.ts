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
    pos: p5.Vector;
    /** Body rotation in degrees */
    bodyRot: number;
    /** Rotation of barrel in degrees (independent from body) */
    barrelRot: number; 

    constructor(pos: p5.Vector, rot: number, color: string) {
        this.pos = pos;
        // Degrees
        this.bodyRot = rot;
        this.barrelRot = rot;
    }

    draw(p: p5) {
        // Update state
        this.update(p);

        // Draw it
        this.drawBody(p);
        this.drawBarrel(p);
    }

    // Draw the body
    drawBody(p: p5) {
        p.push();

        p.translate(this.pos.x, this.pos.y);
        p.rotate(this.bodyRot);
        p.rect(-BODY.WIDTH / 2, -BODY.LENGTH / 2, BODY.WIDTH, BODY.LENGTH);
        p.triangle(-BODY.WIDTH / 2, -BODY.LENGTH / 2,
            -BODY.WIDTH / 2 + BODY.WIDTH, -BODY.LENGTH / 2,
            0, -BODY.LENGTH + 5);

        p.pop();
    }

    // Draw the gun
    drawBarrel(p: p5) {
        p.push();

        p.translate(this.pos.x, this.pos.y);
        p.rotate(this.barrelRot);
        p.rect(-BARREL.WIDTH / 2, -BARREL.LENGTH / 2 - BARREL.OFFSET, BARREL.WIDTH, BARREL.LENGTH);

        // TEMP: here for debugging or smth
        let barrelPos = this.getBulletPosition(p);
        p.circle(barrelPos.x, barrelPos.y, 3);

        p.pop();
    }

    /**
     * Returns the position vector for the end of the barrel
     * 
     * @returns {import("p5").Vector} The position vector for the end of the barrel
     */
    getBulletPosition(p: p5) {
        return p5.Vector.add(
            this.pos,
            p.createVector(
                p.cos(this.barrelRot - 90),
                p.sin(this.barrelRot - 90)
            ).mult(BARREL.LENGTH)
        );
    }

    update(p: p5) {
        // Body movement
        // W
        if (p.keyIsDown(87)) {
            this.pos.y -= MOVE_SPEED * p.sin(this.bodyRot + 90);
            this.pos.x -= MOVE_SPEED * p.cos(this.bodyRot + 90);
        }
        // S
        if (p.keyIsDown(83)) {
            this.pos.y += MOVE_SPEED * p.sin(this.bodyRot + 90);
            this.pos.x += MOVE_SPEED * p.cos(this.bodyRot + 90);
        }
        // A
        if (p.keyIsDown(65)) {
            this.bodyRot -= ROT_SPEED;
        }
        // D
        if (p.keyIsDown(68)) {
            this.bodyRot += ROT_SPEED;
        }

        // Update barrel to aim at mouse
        this.barrelRot = 90 + p.atan2(p.mouseY - this.pos.y, p.mouseX - this.pos.x);
    }
}