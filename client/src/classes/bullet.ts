import p5 from 'p5'

const BULLET = {
    DIAMETER: 2,
    SPEED: MOVE_SPEED * 2,
};

export default class Bullet{
    pos: p5.Vector;
    dir: number;

    /**
     * Instantiates a new bullet.
     * @param pos Initial position
     * @param dir Initial direction
     */
    constructor(pos: p5.Vector, dir: number) {
        this.pos = pos.copy();
        this.dir = dir + 90;
    }

    draw(p: p5) {
        this.update(p);

        p.circle(this.pos.x, this.pos.y, BULLET.DIAMETER);
    }

    update(p: p5) {
        this.pos.y -= BULLET.SPEED * p.sin(this.dir);
        this.pos.x -= BULLET.SPEED * p.cos(this.dir);
    }
}

const sketch = (p: p5) => {
  let x = 100;
  let y = 100;

  p.setup = function() {
    p.createCanvas(700, 410);
  };

  p.draw = function() {
    p.background(0);
    p.fill(255);
    p.rect(x, y, 50, 50);
  };
};

let myp5 = new p5(sketch);