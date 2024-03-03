import { Scene } from "phaser";
import Phaser from "phaser";
import { GameWorld } from "./gameWorld";

export class Bunny extends Phaser.GameObjects.Sprite {
    constructor(public world: GameWorld, x: number, y:number){
        super(world.scene, x, y, 'bunny');
    }

    protected preUpdate(time: number, delta: number): void {
        this.y += 1;
    }
}