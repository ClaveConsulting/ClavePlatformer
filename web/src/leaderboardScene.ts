import { NES_Button } from "./buttonMap";
import { MenuDirection } from "./models/direction";
import { Leaderboard } from "./models/leaderboard";
import { MenuButton, NavMenu } from "./models/navMenu";
import { IPlayerInfo } from "./models/playerInfo";
import { getSelectedLevel, WHITE } from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

let leaderboard: Leaderboard;
let spaceKey: Phaser.Input.Keyboard.Key;

export class LeaderboardScene extends Phaser.Scene {
  private fromMenu: boolean;

  private currentPlayer?: IPlayerInfo;

  private menu: NavMenu;

  private button: MenuButton;

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
    this.fromMenu = true;
  }

  public init(data: { fromMenu: boolean; currentPlayer: IPlayerInfo }) {
    this.fromMenu = data.fromMenu;
    this.currentPlayer = data.currentPlayer;
  }

  public create() {
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.cameras.main.setBackgroundColor("rgba(120, 120, 120, 0.5)");
    leaderboard = new Leaderboard(
      this,
      windowWidth / 2,
      windowHeight / 2,
      this.currentPlayer
    );
    const selectedLevel = getSelectedLevel();

    if (!this.fromMenu) {
      const startText = this.add.text(
        leaderboard.frame.x,
        leaderboard.frame.y + leaderboard.frame.height / 2 - 150,
        "Push A to begin\nOR\nPress SPACEBAR to begin",
        {
          align: "center",
          backgroundColor: "rgba(0,0,0,0)",
          color: WHITE,
          fontSize: "25px",
          fontFamily: "Press2p",
          fontStyle: "bold",
        }
      );
      startText.setX(startText.x - startText.width / 2);
      this.button = new MenuButton(
        leaderboard.frame.getCenter().x,
        leaderboard.frame.y + leaderboard.frame.height / 2 - 100,
        "Back to menu",
        () => {
          if (!!selectedLevel) {
            this.scene.pause();
            this.scene.launch(selectedLevel, {
              fromLeaderboard: true,
            });
            this.scene.setVisible(false);
            this.menu.destroy();
          }
        },
        this,
        NES_Button.A,
        Phaser.Input.Keyboard.KeyCodes.SPACE
      );
      this.button.target.setVisible(false);
    } else {
      this.button = new MenuButton(
        leaderboard.frame.getCenter().x,
        leaderboard.frame.y + leaderboard.frame.height / 2 - 100,
        "Back to menu",
        () => {
          this.scene.pause();
          this.scene.launch("pause");
          this.scene.setVisible(false);
          this.menu.destroy();
        },
        this
      );
    }
    this.menu = new NavMenu([this.button], MenuDirection.Horizontal, this);
  }

  public update() {
    const pad = this.input.gamepad.pad1;
    const selectedLevel = getSelectedLevel();
    if (
      !this.fromMenu &&
      ((pad && pad.isButtonDown(9)) || spaceKey.isDown) &&
      !!selectedLevel
    ) {
      this.scene.launch(selectedLevel, { fromLeaderboard: true });
      this.scene.setVisible(false);
      this.scene.pause();
    }
  }
}
