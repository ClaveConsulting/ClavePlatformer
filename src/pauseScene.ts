import { BUTTON_STYLE, newButton } from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
const BUTTON_SIDE_OFFSET = 100;

export class PauseScene extends Phaser.Scene {

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    public preload() {
        this.load.image("arrow", "assets/common/claveDude.png");
    }

    public create() {
        this.cameras.main.setBackgroundColor("rgba(255, 255, 255, 0.5)");

        // Play button
        newButton(this, "Continue",
        () => {
            this.scene.pause();
            this.scene.resume("ntnu");
            this.scene.setVisible(false);
        },
        windowWidth / 2 - BUTTON_SIDE_OFFSET, windowHeight / 2, BUTTON_STYLE);

        // New game button
        newButton(this, "New Game",
        () => {
            this.scene.pause();
            this.scene.launch("ntnu");
            this.scene.setVisible(false);
        },
        windowWidth / 2 + BUTTON_SIDE_OFFSET, windowHeight / 2, BUTTON_STYLE);

        // show leaderboard button
        newButton(this, "Show Leaderboard",
        () => {
            this.scene.pause();
            this.scene.launch("leaderboard");
            this.scene.setVisible(false);
        },
        windowWidth / 2, windowHeight / 2 + BUTTON_SIDE_OFFSET, BUTTON_STYLE);
    }

}
