import { BUTTON_SPACING, BUTTON_STYLE, INFO_TEXT_STYLE, newButton, PAUSE_TEXT_STYLE } from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
let playing = false;

export class PauseScene extends Phaser.Scene {

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    public create() {
        this.cameras.main.setBackgroundColor("rgba(120, 120, 120, 0.5)");

        // Pause menu frame
        const pauseMenuFrame = this.add.rectangle(windowWidth / 2, windowHeight / 2 - 50, 250, 400, 0xb1bd9b);

        pauseMenuFrame.setStrokeStyle(10, 0xffffff);

        // Pause text
        const pauseText = this.add.text(windowWidth / 2, windowHeight / 2 - 200, "PAUSE", PAUSE_TEXT_STYLE);
        pauseText.setX(pauseText.x - pauseText.width / 2);

        // Play button
        newButton(this, "Continue",
        () => {
            this.scene.pause();
            this.scene.resume("game");
            this.scene.setVisible(false);
        },
        windowWidth / 2 , windowHeight / 2 - BUTTON_SPACING, BUTTON_STYLE);

        // New game button
        newButton(this, "New Game",
        () => {
            this.scene.pause();
            this.scene.launch("leaderboard", { fromMenu: false });
            this.scene.setVisible(false);
        },
        windowWidth / 2, windowHeight / 2 , BUTTON_STYLE);

        // show leaderboard button
        newButton(this, "Leaderboard",
        () => {
            this.scene.pause();
            this.scene.launch("leaderboard", {fromMenu: true});
            this.scene.setVisible(false);
        },
        windowWidth / 2, windowHeight / 2 + BUTTON_SPACING, BUTTON_STYLE);

        // Gamepad hints
        const hintText = this.add.text(
            pauseMenuFrame.x ,
            pauseMenuFrame.y + pauseMenuFrame.height / 2 - 50 ,
            "Push SELECT to restart\nPush START to continue",
            INFO_TEXT_STYLE,
            );
        hintText.setX(hintText.x - hintText.width / 2);
    }

    public update() {
        const pad = this.input.gamepad.pad1;

        if (pad && pad.isButtonDown(9) && !playing) {
            this.scene.pause();
            this.scene.resume("game");
            this.scene.setVisible(false);
            playing = true;
        } else if (pad && pad.isButtonDown(8) && !playing) {
            this.scene.pause();
            this.scene.launch("leaderboard", { fromMenu: false });
            this.scene.setVisible(false);
            playing = true;
        }

        if (pad && !pad.isButtonDown(9) && !pad.isButtonDown(8)) {
            playing = false;
        }

    }

}
