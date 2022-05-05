import { Leaderboard } from "./models/leaderboard";
import { BUTTON_STYLE, newButton } from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

let leaderboard: Leaderboard;
let spaceKey: Phaser.Input.Keyboard.Key;

export class LeaderboardScene extends Phaser.Scene {
    private fromMenu: boolean = true;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    public init(data: { fromMenu: boolean; }) {
        this.fromMenu = data.fromMenu;
    }

    public create() {
        spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE,
        );
        this.cameras.main.setBackgroundColor("rgba(120, 120, 120, 0.5)");
        leaderboard = new Leaderboard(this, windowWidth / 2, windowHeight / 2);

        if (!this.fromMenu) {
            const startText = this.add.text(
                leaderboard.frame.x ,
                leaderboard.frame.y + leaderboard.frame.height / 2 - 150,
                "Push SELECT to begin\nOR\nPress SPACEBAR to begin",
                {
                    align: "center",
                    backgroundColor: "rgba(0,0,0,0)",
                    color: "#ffffff",
                    font: "40px monospace",
                    fontStyle: "bold",
                },
                );
            startText.setX(startText.x - startText.width / 2);
        } else {
            const backButton = newButton(this, "Back to menu",
                () => {
                    this.scene.pause();
                    this.scene.launch("pause");
                    this.scene.setVisible(false);
                },
                0, windowHeight - 100, BUTTON_STYLE);
            backButton.setX(windowWidth / 2 - backButton.width / 2);
        }
    }

    public update() {
        const pad = this.input.gamepad.pad1;
        leaderboard.refresh();

        if (!this.fromMenu && ((pad && pad.isButtonDown(8)) || spaceKey.isDown)) {
            this.scene.launch("game", {fromLeaderboard: true});
            this.scene.setVisible(false);
            this.scene.pause();
        }
    }
}
