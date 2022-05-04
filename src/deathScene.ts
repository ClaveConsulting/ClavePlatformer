import { BUTTON_SPACING, BUTTON_STYLE, GAME_OVER_TEXT_STYLE, INFO_TEXT_STYLE, newButton, PAUSE_TEXT_STYLE } from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

let playing = false;

export class DeathScene extends Phaser.Scene {

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    public preload() {
        this.load.image("arrow", "assets/common/claveDude.png");
    }

    public create() {
        this.cameras.main.setBackgroundColor("rgba(255, 0, 0, 0.5)");

        // Death menu frame
        const deathMenuFrame = this.add.rectangle(windowWidth / 2, windowHeight / 2 - 50, 350, 200, 0xe66a63);

        deathMenuFrame.setStrokeStyle(10, 0xffffff);

        // Game over text
        const deathText = this.add.text(windowWidth / 2, windowHeight / 2 - 150, "GAME OVER", PAUSE_TEXT_STYLE);
        deathText.setX(deathText.x - deathText.width / 2);

        // New game button
        newButton(this, "New Game",
        () => {
            this.scene.pause();
            this.scene.launch("game");
            this.scene.setVisible(false);
        },
        windowWidth / 2,
        windowHeight / 2 - 40,
        BUTTON_STYLE,
        );

        // Gamepad hints
        const hintText = this.add.text(
            deathMenuFrame.x ,
            deathMenuFrame.y + deathMenuFrame.height / 2 - 50 ,
            "Push SELECT to restart" ,
            {
                backgroundColor: "rgba(0,0,0,0)",
                color: "#ffffff",
                font: "25px monospace",
                padding: {
                    x: 20,
                    y: 10,
                },
            },
            );
        hintText.setX(hintText.x - hintText.width / 2);
    }

    public update() {
        const pad = this.input.gamepad.pad1;

        if (pad && pad.isButtonDown(8) && !playing) {
            this.scene.pause();
            this.scene.launch("game");
            this.scene.setVisible(false);
            playing = true;
        }

        if (pad && !pad.isButtonDown(8)) {
            playing = false;
        }
    }

}
