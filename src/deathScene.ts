import { MenuDirection } from "./models/direction";
import { MenuButton, NavMenu } from "./models/navMenu";
import { PALE_GREEN_NUMBER, GAME_OVER_TEXT_STYLE, WHITE_NUMBER } from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

export class DeathScene extends Phaser.Scene {
  private menu: NavMenu;

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  public create() {
    this.cameras.main.setBackgroundColor("rgba(255, 0, 0, 0.5)");

    // Death menu frame
    const deathMenuFrame = this.add.rectangle(
      windowWidth / 2,
      windowHeight / 2 - 50,
      350,
      200,
      PALE_GREEN_NUMBER
    );

    deathMenuFrame.setStrokeStyle(10, WHITE_NUMBER);

    // Game over text
    const deathText = this.add.text(
      windowWidth / 2,
      windowHeight / 2 - 130,
      "GAME OVER",
      GAME_OVER_TEXT_STYLE
    );
    deathText.setX(deathText.x - deathText.width / 2);

    // New game button
    const newGameButton = new MenuButton(
      windowWidth / 2,
      windowHeight / 2 - 40,
      "New Game",
      () => {
        this.scene.pause();
        this.scene.launch("leaderboard", { fromMenu: false });
        this.scene.setVisible(false);
        this.menu.destroy();
      },
      this
    );

    this.menu = new NavMenu([newGameButton], MenuDirection.Horizontal, this);
  }
}
