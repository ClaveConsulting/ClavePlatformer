import { MenuDirection } from "./models/direction";
import { MenuImage, NavMenu } from "./models/navMenu";
import {
  getSelectedLevel,
  LEVEL_HEADER_STYLE,
  PALE_GREEN_NUMBER,
  setSelectedLevel,
  WHITE_NUMBER,
} from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
const IMAGESCALE = 0.4;

export class LevelSelectScene extends Phaser.Scene {
  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  public preload() {
    this.load.image("ntnu", "assets/ntnu/ntnuThumbnail.png");
    this.load.image("uio", "assets/uio/uioThumbnail.png");
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
    const levelSelectText = this.add.text(
      windowWidth / 2,
      levelSelectMenuFrame.getTopCenter().y + 50,
      "SELECT LEVEL",
      LEVEL_HEADER_STYLE
    );
    levelSelectText.setX(levelSelectText.x - levelSelectText.width / 2);

    const ntnuImage = new MenuImage(
      levelSelectMenuFrame.getCenter().x - 250,
      levelSelectMenuFrame.getCenter().y,
      "ntnu",
      IMAGESCALE,
      () => {
        setSelectedLevel("ntnu");
        this.scene.launch("ntnu");
        this.scene.pause();
      },
      this
    );

    const uioImage = new MenuImage(
      levelSelectMenuFrame.getCenter().x + 250,
      levelSelectMenuFrame.getCenter().y,
      "uio",
      IMAGESCALE,
      () => {
        setSelectedLevel("uio");
        this.scene.launch("uio");
        this.scene.pause();
      },
      this
    );

    new NavMenu([ntnuImage, uioImage], MenuDirection.Horizontal, this);
  }
}
