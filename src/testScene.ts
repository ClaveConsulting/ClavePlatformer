import { MenuItem, NavMenu } from "./models/navMenu";
import { BUTTON_SPACING, BUTTON_STYLE, INFO_TEXT_STYLE, newButton, PAUSE_TEXT_STYLE } from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
let playing = false;

export class TestScene extends Phaser.Scene {
    private menu:NavMenu;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    public create() {
        this.cameras.main.setBackgroundColor("rgba(120, 120, 120, 0.5)");

        // Pause menu frame
        const pauseMenuFrame = this.add.rectangle(windowWidth / 2, windowHeight / 2 - 50, 250, 400, 0xb1bd9b);

        pauseMenuFrame.setStrokeStyle(10, 0xffffff);

        // show leaderboard button
        let a = newButton(this, "A",
        () => {},
        windowWidth / 2, windowHeight / 2 + BUTTON_SPACING, BUTTON_STYLE);

        let b = newButton(this, "B",
        () => {},
        windowWidth / 2, windowHeight / 2, BUTTON_STYLE);
        
        let item1 = new MenuItem(a,() => {
            console.log("rw")
            this.scene.pause();
            this.scene.launch("leaderboard", {fromMenu: true});
            this.scene.setVisible(false);
        },this)
        
        let item2 = new MenuItem(b,() => {
            console.log("rw")
            this.scene.pause();
            this.scene.launch("leaderboard", {fromMenu: true});
            this.scene.setVisible(false);
        },this)

        this.menu = new NavMenu([item1,item2]);
    }

    public update() {
        const pad = this.input.gamepad.pad1;

    }

}
