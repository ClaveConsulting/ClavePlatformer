import { MenuDirection } from "./models/direction";
import { MenuButton, MenuImage, NavMenu } from "./models/navMenu";
import { BUTTON_SPACING, BUTTON_STYLE, INFO_TEXT_STYLE, newButton, PAUSE_TEXT_STYLE } from "./utils";



const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
let playing = false;

export class TestScene extends Phaser.Scene {
    private menu:NavMenu;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    public preload(){
        this.load.image("test", "assets/common/claveDude.png")
        this.load.css("nes-btn","assets/common/nesCss.css")
    }

    public create() {

        this.cameras.main.setBackgroundColor("rgba(120, 120, 120, 0.5)");

        // Pause menu frame
        const pauseMenuFrame = this.add.rectangle(windowWidth / 2, windowHeight / 2 - 50, 250, 400, 0xb1bd9b);

        pauseMenuFrame.setStrokeStyle(10, 0xffffff);
        
        let item1 = new MenuButton(100,100,"TEST",() => {
            this.scene.pause();
            this.scene.launch("leaderboard", {fromMenu: true});
            this.scene.setVisible(false);
            this.menu.destroy()

        },this)

        let item2 = new MenuButton(100,170,"TEST",() => {
            this.scene.pause();
            this.scene.launch("leaderboard", {fromMenu: true});
            this.scene.setVisible(false);
            this.menu.destroy()

        },this)

        let item3 = new MenuButton(100,240,"TEST",() => {
            this.scene.pause();
            this.scene.launch("leaderboard", {fromMenu: true});
            this.scene.setVisible(false);
            this.menu.destroy()

        },this)
        
        this.menu = new NavMenu([item1,item2,item3],MenuDirection.Vertical,this);
    }

    public update() {
        const pad = this.input.gamepad.pad1;

    }

}
