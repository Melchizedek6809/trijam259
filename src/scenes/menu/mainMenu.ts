import options from '../../options';
import { Scene } from 'phaser';

const introHTML = `<h1>Bunny Island</h1>
<br/>
<p>WASD to look aroung, Left Mouse button to add Sand, Right Mouse button to remove Land. Try to get as many bunnies as Possible, have fun!</p>`;

const gitHubLink =
    'https://github.com/Melchizedek6809/trijam259';
const phaserLink = 'https://phaser.io/';

export class MainMenuScene extends Scene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        if (!config) {
            config = {};
        }
        config.key = 'MainMenuScene';
        super(config);
    }

    startGame() {
        this.scene.run('UIScene');
        this.scene.switch('GameScene');
    }

    addCreditsLinks() {
        const $links = document.createElement('div');
        $links.innerHTML = `<a href="${gitHubLink}" target="_blank" class="github-link" title="Source code available on GitHub"></a>`;
        $links.innerHTML += `<a href="${phaserLink}" target="_blank" class="phaser-link" title="Made with the Phaser framework"></a>`;
        this.add.dom(this.scale.width - 128, this.scale.height - 48, $links);
    }

    create() {
        if (options.skipMenu) {
            this.startGame();
        }
        this.addCreditsLinks();
        this.scene.run('GameScene');

        const buttons = '<br/><br/><button class="green-button">Start</button>';
        const $intro = document.createElement('div');
        $intro.classList.add('main-menu-text');
        $intro.innerHTML = introHTML + buttons;
        this.add.dom(this.scale.width / 2, 96, $intro).setOrigin(0.5, 0);
        const $button = $intro.querySelector(
            'button.green-button'
        ) as HTMLElement;
        if ($button) {
            $button.addEventListener('click', this.startGame.bind(this));
            $button.focus();
        }
    }

    update(time: number, delta: number) {
        const that = this;
        if (this.input.gamepad?.gamepads[0]) {
            const gamepad = this.input.gamepad.gamepads[0];
            if (gamepad.A) {
                that.startGame();
            }
        }
    }
}
