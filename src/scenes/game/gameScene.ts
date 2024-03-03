import options from '../../options';
import { GameObjects, Scene } from 'phaser';

import '../../types';
import { UIScene } from '../ui/uiScene';

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

    skybg?: GameObjects.Image;

    gameTicks = 0;
    score = 0;

    playerVelocity = 2;

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

        const ui = this.scene.get('UIScene') as UIScene;
        ui.events.emit('reset');

        this.physics.world.setBounds(0, 0, 1280, 720);
        this.keymap = this.input.keyboard?.addKeys(
            'Up,Left,Right,Down,W,A,S,D'
        ) as KeyMap;
        this.gameOverActive = false;
        this.gameTicks = 0;

        this.skybg = this.add.image(-64, -64, 'packed', 'sky');
        this.skybg
            .setDisplaySize(1280 + 128, 720 + 128)
            .setOrigin(0, 0)
            .setDepth(-100);

        this.cameras.main.setBounds(0, 0, 1280, 720);

        //this.cameras.main.startFollow(this.player, false, 0.1, 0.1, 0, 0);
    }

    update(time: number, delta: number) {
        this.gameTicks += delta;
    }
}
