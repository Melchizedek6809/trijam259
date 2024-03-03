import { Scene } from "phaser";
import Phaser from "phaser";
import { GameWorld } from "./gameWorld";

export type BunnyState = "hungry" | "idle" | "drowning" | "dead" | "waiting" | "eating" | "horny";

export class Bunny extends Phaser.GameObjects.Sprite {
    public health = 10;
    public hunger = 10;
    public air = 10;
    public age = 1;
    public state:BunnyState = "idle";
    public timeInState = 0;
    public goal: number[] | undefined;
    public vx = 0;
    public vy = 0;

    constructor(public world: GameWorld, x: number, y:number){
        super(world.scene, x, y, 'bunny', 0);
    }

    public die() {
        this.changeState("dead");
    }

    public decay() {
        this.destroy();
    }

    public changeState(state:BunnyState){
        if(this.state === "dead"){ // Can't resurrect the dead
            return;
        }
        this.state = state;
        this.timeInState = 0;
        this.goal = undefined;
    }

    public getTile(ox=0,oy=0):number {
        const x = (((ox+this.x)/32)|0);
        const y = (((oy+this.y)/32)|0);
        return this.world.getTile(x,y);
    }

    public setTile(t:number,ox=0,oy=0) {
        const x = (((ox+this.x)/32)|0);
        const y = (((oy+this.y)/32)|0);
        this.world.setTile(x,y,t);
    }

    private calcBunnyFrame() {
        const s = Math.max(0.6, Math.min(1, this.age));
        this.setScale(s,s);
        switch(this.state){
        case "idle":
            this.setFrame(0);
            break;
        case "drowning":
            this.setFrame(1);
            break;
        case "dead":
            this.setFrame(2);
            break;
        }
    }

    private setGoalForTile(tile: number){
        for(let i=0;i<4;i++){
            const x = ((Math.random()-0.5)*3*32)|0;
            const y = ((Math.random()-0.5)*3*32)|0;
            const t = this.getTile(x,y);
            if(t === tile){
                this.goal = [((this.x / 32)|0)*32 + x, ((this.y / 32)|0)*32 + y];
            }
        }
        for(let i=0;i<4;i++){
            const x = ((Math.random()-0.5)*4*32)|0;
            const y = ((Math.random()-0.5)*4*32)|0;
            const t = this.getTile(x,y);
            if(t === tile){
                this.goal = [((this.x / 32)|0)*32 + x, ((this.y / 32)|0)*32 + y];
            }
        }
        for(let i=0;i<4;i++){
            const x = ((Math.random()-0.5)*8*32)|0;
            const y = ((Math.random()-0.5)*8*32)|0;
            const t = this.getTile(x,y);
            if(t === tile){
                this.goal = [((this.x / 32)|0)*32 + x, ((this.y / 32)|0)*32 + y];
            }
        }
        for(let i=0;i<4;i++){
            const x = ((Math.random()-0.5)*12*32)|0;
            const y = ((Math.random()-0.5)*12*32)|0;
            const t = this.getTile(x,y);
            if(t === tile){
                this.goal = [((this.x / 32)|0)*32 + x, ((this.y / 32)|0)*32 + y];
            }
        }
    }

    private stateHungry(){
        const t = this.getTile();
        if((t === 4) || (t === 2)){
            this.changeState("eating");
        } else {
            if(!this.goal){
                this.setGoalForTile(4);
                if(!this.goal){
                    this.setGoalForTile(2);
                }
            }
            if(this.goal){
                if(this.goToGoal()){
                    this.setGoalForTile(4);
                }
            }
        }
    }

    private stateEating(delta: number){
        const t = this.getTile();
        if(!((t === 4) || (t === 2))){
            this.changeState("idle");
            return;
        }
        if(Math.random() < 0.1){
            if(t === 2){
                this.setTile(3);
            }
            if(t === 4){
                this.setTile(2);
            }
        }
        this.hunger += delta * 0.01;
        if(this.hunger > 20){
            this.changeState("idle");
        }
    }

    private checkCloseDead():number{
        let count = 0;
        for(let b of this.world.bunnies.values()){
            if((b.state !== "dead")){
                continue;
            }
            const dx = b.x - this.x;
            const dy = b.y - this.y;
            const dd = dx*dx+dy+dy;
            if(dd < 32*32){
                count++;
            }
        }
        return count;
    }

    private stateHorny(){
        let closestBunny = undefined;
        let distance = 99999;
        for(let b of this.world.bunnies.values()){
            if((b.state === "dead") || (b === this) || (b.age < 1)){
                continue;
            }
            const dx = b.x - this.x;
            const dy = b.y - this.y;
            const dd = dx*dx+dy+dy;
            if(dd < distance){
                distance = dd;
                closestBunny = b;
            }
        }
        if(closestBunny){
            if(distance < 4){
                this.hunger -= 4;
                closestBunny.hunger -= 4;
                const babyCount = ((1+Math.random())*4)|0;
                for(let i=0;i<babyCount;i++){
                    const bunny = new Bunny(this.world, this.x, this.y);
                    bunny.age = 0;
                    this.world.bunnies.add(bunny);
                    this.scene.add.existing(bunny);
                }
                if(Math.random() < 0.2){
                    this.die();
                }
            } else {
                this.goal = [closestBunny.x, closestBunny.y];
                this.goToGoal();
            }
        }
    }

    private stateDead(){
        const ox = ((Math.random()*5|0)-2)*32;
        const oy = ((Math.random()*5|0)-2)*32;
        const t = this.getTile(ox,oy);
        switch(t){
        case 1:
            if(Math.random() < 0.02){
                this.setTile(3,ox,oy);
            }
            break;
        case 2:
            if(Math.random() < 0.02){
                this.setTile(4,ox,oy);
            }
            break;
        case 3:
            if(Math.random() < 0.02){
                this.setTile(2,ox,oy);
            }
            break;
        case 4:
            if(Math.random() < 0.001){
                this.setTile(5,ox,oy);
            }
            break;
        }
        if(this.timeInState > 6000){
            this.decay();
        }
    }

    private setIdleGoal() {
        this.setGoalForTile(2);
    }

    private goToGoal():boolean {
        if(!this.goal){
            return false;
        }
        const ox = this.goal[0] - this.x;
        const oy = this.goal[1] - this.y;
        const dd = ox*ox + oy*oy;
        if(dd < 16){
            this.vx = this.vx * 0.9;
            this.vy = this.vy * 0.9;
            if((Math.abs(this.vx) + Math.abs(this.vy)) < 0.1){
                return true;
            }
        }
        const n = Math.max(Math.abs(ox), Math.abs(oy));
        const vx = ox/n;
        const vy = oy/n;
        this.vx = this.vx * 0.9 + vx * 0.1;
        this.vy = this.vy * 0.9 + vy * 0.1;
        return false;
    }

    protected preUpdate(time: number, delta: number): void {
        this.timeInState += delta;

        if(this.state === "dead"){
            this.stateDead();
            return;
        }
        

        this.age += delta * 0.0001;
        this.hunger -= delta * 0.0002;
        const t = this.getTile();
        if(t === 0){
            this.air -= delta * 0.01;
            this.changeState("drowning");
            this.state = "drowning";
        }

        if(this.age > 8){
            //this.die();
        }

        if(this.hunger < 0){
            this.die();
        }
        if(this.air < 0){
            this.die();
        }

        if(this.state === "drowning"){
            return;
        }

        if(!(this.state === "hungry" || this.state === "eating") && this.hunger < 5){
            this.changeState("hungry")
        }
        const closeDeadCount = this.checkCloseDead();
        if(closeDeadCount > 0){
            if(Math.random() < (0.001 * closeDeadCount)){
                this.die();
            }
        }

        switch(this.state){
        case "horny":
            this.stateHorny();
            break;
        case "eating":
            this.stateEating(delta);
            break;
        case "hungry":
            this.stateHungry();
            break;
        case "waiting":
            if(this.timeInState > 1000){
                this.changeState("idle");
            }
            break;
        case "idle":
            if((this.age >= 1) && (this.hunger > 8) && Math.random() < 0.1){
                this.changeState("horny");
            }
            if(!this.goal){
                this.setIdleGoal();
            } else {
                if(this.goToGoal()){
                    this.changeState("waiting");
                    this.timeInState = (Math.random() * 500)|0;
                }
            }
            break;
        }
        if(!this.goal){
            this.vx = this.vx * 0.9;
            this.vy = this.vy * 0.9;
        }
        this.x += this.vx * delta*0.05;
        this.y += this.vy * delta*0.05;
        this.calcBunnyFrame();
    }
}