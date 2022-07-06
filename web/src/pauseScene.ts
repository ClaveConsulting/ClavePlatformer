import { NES_Button } from "./buttonMap";
import { CheckBox } from "./models/checkbox";
import { MenuDirection } from "./models/direction";
import { MenuButton, NavMenu } from "./models/navMenu";
import checkboxOn from "../assets/common/tournamentToggleOn.xhtml";
import checkboxOff from "../assets/common/tournamentToggleOff.xhtml";
import {
  BUTTON_SPACING,
  getSelectedLevel,
  getTournamentValue,
  PALE_GREEN_NUMBER,
  PAUSE_TEXT_STYLE,
  WHITE_NUMBER,
} from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

export class PauseScene extends Phaser.Scene {
  private pauseMenu: NavMenu;
  private tournamentToggleBox: CheckBox;

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }
  public preload() {
    this.load.html("checkboxOff", checkboxOff);
    this.load.html("checkboxOn", checkboxOn);
  }

  public create() {
    this.cameras.main.setBackgroundColor("rgba(120, 120, 120, 0.5)");

    // Pause menu frame
    const pauseMenuFrame = this.add.rectangle(
      windowWidth / 2,
      windowHeight / 2 - 50,
      420,
      450,
      PALE_GREEN_NUMBER
    );

    pauseMenuFrame.setStrokeStyle(10, WHITE_NUMBER);

    // Pause text
    const pauseText = this.add.text(
      windowWidth / 2,
      windowHeight / 2 - 200,
      "PAUSE",
      PAUSE_TEXT_STYLE
    );
    pauseText.setX(pauseText.x - pauseText.width / 2);

    // Continue Button
    const continueButton = new MenuButton(
      windowWidth / 2,
      windowHeight / 2 - BUTTON_SPACING,
      "Continue",
      () => {
        const selectedLevel = getSelectedLevel();
        if (!!selectedLevel) {
          this.scene.pause();
          this.scene.launch("countdown");
          this.scene.setVisible(false);
          this.pauseMenu.destroy();
          this.tournamentToggleBox.destroy();
        }
      },
      this,
      NES_Button.B,
      Phaser.Input.Keyboard.KeyCodes.ESC
    );

    // New game button
    const newGameButton = new MenuButton(
      windowWidth / 2,
      windowHeight / 2,
      "New Game",
      () => {
        this.scene.pause();
        this.scene.launch("leaderboard", { fromMenu: false });
        this.scene.setVisible(false);
        this.pauseMenu.destroy();
        this.tournamentToggleBox.destroy();
      },
      this
    );

    // show leaderboard button
    const leaderboardButton = new MenuButton(
      windowWidth / 2,
      windowHeight / 2 + BUTTON_SPACING,
      "Leaderboard",
      () => {
        this.scene.pause();
        this.scene.launch("leaderboard", { fromMenu: true });
        this.scene.setVisible(false);
        this.pauseMenu.destroy();
        this.tournamentToggleBox.destroy();
      },
      this
    );

    this.pauseMenu = new NavMenu(
      [continueButton, newGameButton, leaderboardButton],
      MenuDirection.Vertical,
      this
    );

    this.tournamentToggleBox = new CheckBox(
      this,
      windowWidth / 2,
      windowHeight / 2 + 2 * BUTTON_SPACING
    );

    if (getTournamentValue()) {
      this.tournamentToggleBox.init("checkboxOn");
    } else {
      this.tournamentToggleBox.init("checkboxOff");
    }
  }
}
