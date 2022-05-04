import { InputField } from "./models/inputField";
import { IPlayerInfo } from "./models/playerInfo";
import { BUTTON_STYLE, FINISH_TEXT_STYLE, GAME_OVER_TEXT_STYLE, newButton, recordTime } from "./utils";

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
        // Finish text
        const finishText = this.add.text(
            windowWidth / 2,
            100,
            "!! CONGRATULATIONS !!",
            FINISH_TEXT_STYLE,
            );

        finishText.setX(finishText.x - finishText.width / 2);

        submitted = false;

        // User input form
        nameField = new InputField(this,
            windowWidth / 2,
            windowHeight / 2 - 2 * BUTTON_SIDE_OFFSET,
            "Name/Nickname:",
            BUTTON_STYLE);

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

        // New game button
        newButton(this, "New Game",
        () => {
            this.scene.pause();
            this.scene.launch("game");
            this.scene.setVisible(false);
        },
        windowWidth / 2, windowHeight / 2 + BUTTON_SIDE_OFFSET, BUTTON_STYLE);
    }

    public update() {
        if (submitted && submitButton) {
            submitButton.destroy();
            // TODO deactivate inputfields
            nameField.deactivate();
            phoneField.deactivate();
        }
    }

}
