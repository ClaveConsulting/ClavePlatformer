import { BUTTON_STYLE, newButton, printTime } from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
const BUTTON_SIDE_OFFSET = 100;

export class LeaderboardScene extends Phaser.Scene {

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    public create() {
        this.cameras.main.setBackgroundColor("rgba(255, 255, 255, 0.5)");

        // Print Leaderboard
        printTime(this);

        // Back button
        newButton(this, "Back to menu",
        () => {
            this.scene.pause();
            this.scene.launch("pause");
            this.scene.setVisible(false);
        },
        windowWidth / 2 - BUTTON_SIDE_OFFSET, windowHeight - 100, BUTTON_STYLE);

    }

}
