import { InputField } from "./models/inputField";
import { IPlayerInfo } from "./models/playerInfo";
import { BUTTON_STYLE, newButton, PAUSE_TEXT_STYLE, recordTime } from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
const BUTTON_SIDE_OFFSET = 100;
const playerInfo: IPlayerInfo = {
    name: "",
    phone: "",
};
let nameField: InputField;
let phoneField: InputField;
let submitted = false;
let submitButton: Phaser.GameObjects.Text;
let playing = false;

export class FinishScene extends Phaser.Scene {
    private stars: number;
    private timer: number;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }
    public init(data: { time: number; stars: number; }) {
        this.timer = data.time;
        this.stars = data.stars;
    }

    public create() {
        this.cameras.main.setBackgroundColor("rgba(0, 255, 0, 0.5)");

        // Finish menu frame
        const finishMenuFrame = this.add.rectangle(windowWidth / 2, windowHeight / 2 - 15, 650, 575, 0xb1bd9b);

        finishMenuFrame.setStrokeStyle(10, 0xffffff);

        // Finish text
        const finishText = this.add.text(windowWidth / 2, windowHeight / 2 - 300, "CONGRATULATIONS", PAUSE_TEXT_STYLE);
        finishText.setX(finishText.x - finishText.width / 2);

        submitted = false;

        // User input form
        nameField = new InputField(this,
            windowWidth / 2,
            windowHeight / 2 - 2 * BUTTON_SIDE_OFFSET,
            "Name/Nickname:",
            BUTTON_STYLE);

        const inputHintText = this.add.text(
            finishMenuFrame.x ,
            finishMenuFrame.y + finishMenuFrame.height / 2 - 425 ,
            "Press ENTER to switch between fields",
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
        inputHintText.setX(inputHintText.x - inputHintText.width / 2);

        phoneField = new InputField(this,
            windowWidth / 2,
            windowHeight / 2 - BUTTON_SIDE_OFFSET,
            "Phone number:",
            BUTTON_STYLE);

        nameField.activate();

        this.input.keyboard.on("keydown", (event: { keyCode: number; key: string; }) => {
            if (event.keyCode === 13) {
                nameField.switchActive();
                phoneField.switchActive();
            }
        });

        submitButton = newButton(this, "Submit",
        () => {
            playerInfo.name = nameField.getValue();
            playerInfo.phone = phoneField.getValue();
            nameField.clear();
            phoneField.clear();
            recordTime(this.stars, this.timer, playerInfo.name, playerInfo.phone);
            submitted = true;
        },
        windowWidth / 2, windowHeight / 2 , BUTTON_STYLE);

        // Gamepad hints
        const hintText = this.add.text(
            finishMenuFrame.x ,
            finishMenuFrame.y + finishMenuFrame.height / 2 - 50 ,
            "Push SELECT to restart",
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

        // New game button
        newButton(this, "New Game",
        () => {
            this.scene.pause();
            this.scene.launch("leaderboard", { fromMenu: false });
            this.scene.setVisible(false);
        },
        windowWidth / 2, windowHeight / 2 + BUTTON_SIDE_OFFSET, BUTTON_STYLE);
    }

    public update() {
        const pad = this.input.gamepad.pad1;

        if (pad && pad.isButtonDown(8) && !playing) {
            this.scene.pause();
            this.scene.launch("leaderboard", { fromMenu: false });
            this.scene.setVisible(false);
            playing = true;
        }

        if (pad && !pad.isButtonDown(8)) {
            playing = false;
        }

        if (submitted && submitButton) {
            submitButton.destroy();
            nameField.deactivate();
            phoneField.deactivate();
        }
    }

}
