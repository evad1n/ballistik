import p5 from 'p5';

import Tank from "@classes/tank";
import Maze from "@classes/maze";
import Bullet from "@classes/bullet";

/**
 * Global list of active bullets
 */
let bullets : Bullet[];

/**
 * Current mazze
 */
let maze: Maze;
/**
 * That's you!
 */
let player: Tank;

const sketchFn = (p: p5) => {
    p.setup = () => {
        p.angleMode('degrees');
        
        p.createCanvas(p.windowWidth, p.windowHeight);
        
        p.cursor("cross");
        
        p.fill('white');
        
        // let mazeData = genMaze(10, 10);
        
        maze = new Maze(50, 50, 10, 10, 30);
        player = new Tank(p.createVector(300, 300), 0, "black");
    }
    
    p.draw = () => {
        p.background(220);
        
        maze.draw(p);
        player.draw(p);
        
        for (const b of bullets) {
            b.draw(p);
        }
    }
    
    p.mouseClicked = () => {
        // bullets.push(new Bullet(t.getBulletPosition(), t.barrelRot));
        
        maze.drawMaze(100);
    }
}
    
    
let sketch = new p5(sketchFn);
