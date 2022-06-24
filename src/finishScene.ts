import { MenuDirection } from "./models/direction";
import { InputForm } from "./models/inputField";
import { MenuButton, NavMenu } from "./models/navMenu";
import { IPlayerInfo } from "./models/playerInfo";
import { getSelectedLevel, PAUSE_TEXT_STYLE, recordTime } from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
const BUTTON_SIDE_OFFSET = 100;
const playerInfo: IPlayerInfo = {
    name: "",
    phone: "",
    time: "",
};
export class FinishScene extends Phaser.Scene {
    private stars: number;

    private timer: number;

    private inputForm: InputForm;

    private menu: NavMenu;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    public init(data: { time: number; stars: number; }) {
        this.timer = data.time;
        this.stars = data.stars;
    }

    public preload() {
        this.load.html(
            "playerInfoForm", "assets/common/inputForm.html",
        );
    }

    public create() {
        this.cameras.main.setBackgroundColor("rgba(120, 120, 120, 0.5)");

        // Finish menu frame
        const finishMenuFrame = this.add.rectangle(
            windowWidth / 2, windowHeight / 2 - 15, 650, 575, 0xb1bd9b,
        );
        finishMenuFrame.setStrokeStyle(
            10, 0xffffff,
        );

        // Finish text
        const finishText = this.add.text(
            windowWidth / 2, windowHeight / 2 - 300, "CONGRATULATIONS", PAUSE_TEXT_STYLE,
        );
        finishText.setX(finishText.x - finishText.width / 2);

        // User input form
        this.inputForm = new InputForm(
            this, windowWidth / 2, windowHeight / 2 - 100, "playerInfoForm",
        );

        const submitButton = new MenuButton(
            windowWidth / 2, windowHeight / 2 + 50, "Submit", () => {
                const selectedLevel = getSelectedLevel();
                playerInfo.name = this.inputForm.getName();
                playerInfo.phone = this.inputForm.getPhone();
                playerInfo.time = String(this.timer.toFixed(2));
                if (!!selectedLevel) {
                    recordTime(
                        this.stars, this.timer, playerInfo.name, playerInfo.phone, selectedLevel,
                    );
                }
                this.scene.pause();
                this.scene.launch(
                    "leaderboard", { fromMenu: false, currentPlayer: playerInfo },
                );
                this.scene.setVisible(false);
                this.menu.destroy();
                this.inputForm.destroy();
            }, this,
        );

        const newGameButton = new MenuButton(
            windowWidth / 2, windowHeight / 2 + BUTTON_SIDE_OFFSET + 50, "New Game", () => {
                this.scene.pause();
                this.scene.launch(
                    "leaderboard", { fromMenu: false, currentPlayer: playerInfo },
                );
                this.scene.setVisible(false);
                this.menu.destroy();
                this.inputForm.destroy();
            }, this,
        );

        this.menu = new NavMenu(
            [submitButton, newGameButton], MenuDirection.Vertical, this,
        );
    }
}
