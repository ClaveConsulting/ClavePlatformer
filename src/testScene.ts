import { InputForm } from "./models/inputField";
import { NavMenu } from "./models/navMenu";
import { PALE_GREEN_NUMBER, WHITE_NUMBER } from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

export class TestScene extends Phaser.Scene {
    private menu: NavMenu;

    private form: InputForm;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    public preload() {
        this.load.image("test", "assets/common/tileset.png");
        this.load.css("nes-btn", "assets/common/nesCss.css");
        this.load.html("nameField", "assets/common/inputField.html");
    }

    public create() {
        this.cameras.main.setBackgroundColor("rgba(120, 120, 120, 0.5)");

        // Pause menu frame
        const pauseMenuFrame = this.add
            .rectangle(
                windowWidth / 2,
                windowHeight / 2 - 50,
                250,
                400,
                PALE_GREEN_NUMBER
            )
            .setInteractive();

        pauseMenuFrame.setStrokeStyle(10, WHITE_NUMBER);

        this.form = new InputForm(
            this,
            windowWidth / 2,
            windowHeight / 2,
            "nameField"
        );
    }
}
