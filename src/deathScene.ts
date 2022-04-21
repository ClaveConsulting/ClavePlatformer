import { BUTTON_STYLE, GAME_OVER_TEXT_STYLE, newButton } from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
const BUTTON_SIDE_OFFSET = 100;

export class DeathScene extends Phaser.Scene {

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    public preload() {
        this.load.image("arrow", "assets/common/claveDude.png");
    }

    public create() {
        this.cameras.main.setBackgroundColor("rgba(255, 0, 0, 0.5)");

        // GAME OVER text
        const gameOverText = this.add.text(
            windowWidth / 2,
            windowHeight / 2 - BUTTON_SIDE_OFFSET,
            "GAME OVER",
            GAME_OVER_TEXT_STYLE,
            );

        gameOverText.setX(gameOverText.x - gameOverText.width / 2);

        // New game button
        newButton(this, "New Game",
        () => {
            this.scene.pause();
            this.scene.launch("ntnu");
            this.scene.setVisible(false);
        },
        windowWidth / 2, windowHeight / 2 + BUTTON_SIDE_OFFSET, BUTTON_STYLE);
    }

}
