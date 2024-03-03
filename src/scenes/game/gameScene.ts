import { GameObjects, Scene } from 'phaser';

import '../../types';
import { UIScene } from '../ui/uiScene';
import { GameWorld } from './gameWorld';

export type KeyMap = {
    Up: Phaser.Input.Keyboard.Key;
    Left: Phaser.Input.Keyboard.Key;
    Right: Phaser.Input.Keyboard.Key;
    Down: Phaser.Input.Keyboard.Key;
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
};

export class GameScene extends Scene {
    keymap?: KeyMap;
    gameOverActive: boolean;

    gameTicks = 0;
    score = 0;

    playerVelocity = 2;
    world?: GameWorld;

    playerX = 0;
    playerY = 0;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        if (!config) {
            config = {};
        }
        config.key = 'GameScene';
        super(config);
        this.gameOverActive = false;
    }

    create() {
        const that = this;
        this.score = 0;
        this.sound.pauseOnBlur = false;
        this.world = new GameWorld(this);

        const ui = this.scene.get('UIScene') as UIScene;
        ui.events.emit('reset');

        this.physics.world.setBounds(0, 0, 1280, 720);
        this.keymap = this.input.keyboard?.addKeys(
            'Up,Left,Right,Down,W,A,S,D'
        ) as KeyMap;
        this.gameOverActive = false;
        this.gameTicks = 0;

        this.playerX = (this.world.width / 2) * 32;
        this.playerY = (this.world.height / 2) * 32;

        //this.cameras.main.setBounds(0, 0, 1280, 720);
        //this.cameras.main.startFollow(this.player, false, 0.1, 0.1, 0, 0);
    }

    update(time: number, delta: number) {
        this.gameTicks += delta;
        if(this.keymap?.A.isDown || this.keymap?.Left.isDown){
            this.playerX -= 8;
        }
        if(this.keymap?.D.isDown || this.keymap?.Right.isDown){
            this.playerX += 8;
        }
        if(this.keymap?.W.isDown || this.keymap?.Up.isDown){
            this.playerY -= 8;
        }
        if(this.keymap?.S.isDown || this.keymap?.Down.isDown){
            this.playerY += 8;
        }
        this.cameras.main.setScroll(this.playerX, this.playerY);
    }
}
