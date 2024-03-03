import { Scene } from 'phaser';
import { Bunny } from './bunny';

export class GameWorld {
    public tilemap: Phaser.Tilemaps.Tilemap;
    public tiles: Phaser.Tilemaps.Tileset;
    public layer: Phaser.Tilemaps.TilemapLayer;
    public readonly width = 512;
    public readonly height = 512;
    public bunnies: Set<Bunny> = new Set();

    private genInitialData(size = 512):number[][] {
        const ret = [];
        for(let x=0;x<size;x++){
            const row = [];
            for(let y=0;y<size;y++){
                row.push(0);
            }
            ret.push(row);
        }
        return ret;
    }

    public setTile(x:number, y:number, tile:number) {
        this.tilemap.putTileAt(tile,x,y);
    }

    public getTile(x:number, y:number) {
        return this.tilemap.getTileAt(x,y)?.index || 0;
    }

    public spawnIsland(x:number, y:number, r:number) {
        const rr = r*r;
        const beachSize = 2;
        const grr = (r-beachSize)*(r-beachSize)
        for(let cx=-r;cx<r;cx++){
            for(let cy=-r;cy<r;cy++){
                const oldT = this.getTile(x+cx, y+cy);
                if(oldT !== 0){continue;}
                const dd = cx*cx + cy*cy;
                if(dd < grr){
                    const rand = Math.random();
                    if(rand < 0.2){
                        this.setTile(x+cx,y+cy,4);
                    } else if(rand < 0.25){
                        this.setTile(x+cx,y+cy,5);
                    } else {
                        this.setTile(x+cx,y+cy,2);
                    }
                } else if(dd < rr){
                    this.setTile(x+cx,y+cy,1);
                }
            }
        }
    }

    public worldgen(){
        this.spawnIsland(this.width/2 + 16, this.height/2 + 16, 16);
        for(let i=0;i<8;i++){
            const x = (this.width/2 * 32) + (Math.random()-0.5)*512 + 16*32;
            const y = (this.height/2 * 32) + (Math.random()-0.5)*512  + 16*32;
            const bunny = new Bunny(this, x, y);
            this.bunnies.add(bunny);
            this.scene.add.existing(bunny);
        }
    }

    constructor(public scene: Scene) {
        const data = this.genInitialData();
        const map = scene.make.tilemap({ width: this.width, height: this.height, data, tileWidth: 32, tileHeight: 32 });
        if(!map){
            throw new Error("Cant creat tilemap");
        }
        this.tilemap = map;
        const tiles = map.addTilesetImage('world-tiles');
        if(!tiles){
            throw new Error("Cant creat tileset");
        }
        this.tiles = tiles;
        const layer = map.createLayer(0, this.tiles, 0, 0);
        if(!layer){
            throw new Error("Cant creat layer");
        }
        this.layer = layer;
        this.layer.setDepth(-10);
        this.worldgen();
    }
}