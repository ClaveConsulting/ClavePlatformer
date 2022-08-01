import ntnuThumbnail from "../assets/ntnu/ntnuThumbnail.png";
import uioThumbnail from "../assets/uio/uioThumbnail.png";
import {MenuDirection} from "./models/direction";
import {MenuImage, NavMenu} from "./models/navMenu";
import {getSelectedLevel, PALE_GREEN_NUMBER, PAUSE_TEXT_STYLE, setSelectedLevel, WHITE_NUMBER,} from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
const IMAGESCALE = 0.4;

export class LevelSelectScene extends Phaser.Scene {
    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    public preload() {
        this.load.image("ntnu", ntnuThumbnail);
        this.load.image("uio", uioThumbnail);
    }

    public create() {
        const selectedLevel = getSelectedLevel();
        if (!!selectedLevel) {
            this.scene.switch(selectedLevel);
        }

        const levelSelectMenuFrame = this.add.rectangle(
            windowWidth / 2,
            windowHeight / 2,
            windowWidth - 200,
            windowHeight - 200,
            PALE_GREEN_NUMBER
        );

        levelSelectMenuFrame.setStrokeStyle(10, WHITE_NUMBER);

        // Select level text
        const levelSelectText = this.add
            .dom(
                windowWidth / 2,
                levelSelectMenuFrame.getTopCenter().y + 100,
                "text",
                null,
                "SELECT LEVEL"
            )
            .setClassName("nes-text")
            .setScale(3);

        this.add
            .text(
                windowWidth / 2,
                levelSelectMenuFrame.getTopCenter().y + 100,
                "text",
                PAUSE_TEXT_STYLE
            )
            .setVisible(false);

        const ntnuImage = new MenuImage(
            levelSelectMenuFrame.getCenter().x - 290,
            levelSelectMenuFrame.getCenter().y,
            "ntnu",
            IMAGESCALE,
            () => {
                setSelectedLevel("ntnu");
                this.scene.launch("ntnu");
                this.scene.pause();
                levelSelectText.destroy();
            },
            this
        );

        const uioImage = new MenuImage(
            levelSelectMenuFrame.getCenter().x + 290,
            levelSelectMenuFrame.getCenter().y,
            "uio",
            IMAGESCALE,
            () => {
                setSelectedLevel("uio");
                this.scene.launch("uio");
                this.scene.pause();
                levelSelectText.destroy();
            },
            this
        );

        new NavMenu([ntnuImage, uioImage], MenuDirection.Horizontal, this);
    }
}
