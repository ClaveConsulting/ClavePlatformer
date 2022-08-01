import inputForm from "../assets/common/tournamentInputField.xhtml";
import {CheckBox} from "./models/checkbox";
import {MenuDirection} from "./models/direction";
import {MenuButton, NavMenu} from "./models/navMenu";
import checkboxOff from "../assets/common/tournamentToggleOff.xhtml";
import {
    BUTTON_SPACING,
    getTournamentValue,
    PALE_GREEN_NUMBER,
    PAUSE_TEXT_STYLE,
    setTournamentNameValue,
    TRANSPARENT_GREY,
    WHITE_NUMBER,
} from "./utils";
import {TournamentInputForm} from "./models/tournamentInputField";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

export class TournamentScene extends Phaser.Scene {
    private tournamentMenu: NavMenu;
    private tournamentToggleBox: CheckBox;
    private inputField: TournamentInputForm;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    public preload() {
        this.load.html("tournamentNameField", inputForm);
        this.load.html("checkboxOff", checkboxOff);
    }

    public create() {
        this.cameras.main.setBackgroundColor(TRANSPARENT_GREY);

        // Pause menu frame
        const tournamentMenuFrame = this.add.rectangle(
            windowWidth / 2,
            windowHeight / 2,
            420,
            450,
            PALE_GREEN_NUMBER
        );

        tournamentMenuFrame.setStrokeStyle(10, WHITE_NUMBER);

        // Tournament text
        const pauseText = this.add.text(
            windowWidth / 2,
            windowHeight / 2 - 200,
            "TOURNAMENT",
            PAUSE_TEXT_STYLE
        );
        pauseText.setX(pauseText.x - pauseText.width / 2);

        // User input form
        this.inputField = new TournamentInputForm(
            this,
            windowWidth / 2,
            windowHeight / 2 - 100,
            "tournamentNameField"
        );

        // OK Button
        const OKButton = new MenuButton(
            windowWidth / 2 - BUTTON_SPACING,
            windowHeight / 2,
            "OK",
            () => {
                setTournamentNameValue(this.inputField.getName());
                this.scene.launch("pause");
                this.scene.setVisible(false);
                this.scene.pause();
                this.tournamentMenu.destroy();
                this.tournamentToggleBox.destroy();
                this.inputField.destroy();
            },
            this
        );

        // CLEAR button
        const ClearButton = new MenuButton(
            windowWidth / 2 + BUTTON_SPACING,
            windowHeight / 2,
            "Clear",
            () => {
                this.inputField.clear();
            },
            this
        );

        this.tournamentMenu = new NavMenu(
            [OKButton, ClearButton],
            MenuDirection.Horizontal,
            this
        );

        this.tournamentToggleBox = new CheckBox(
            this,
            windowWidth / 2,
            windowHeight / 2 + 2 * BUTTON_SPACING
        );

        this.tournamentToggleBox.init("checkboxOff");
        if (getTournamentValue()) {
            this.tournamentToggleBox.changeState();
        }
    }
}
