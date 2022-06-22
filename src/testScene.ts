import { MenuDirection } from "./models/direction";
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

    public preload(){
        this.load.image("test", "assets/common/claveDude.png")
        this.load.css("nes-btn","assets/common/nesCss.css")
    }

    public create() {

        this.cameras.main.setBackgroundColor("rgba(120, 120, 120, 0.5)");

        // Pause menu frame
        const pauseMenuFrame = this.add.rectangle(windowWidth / 2, windowHeight / 2 - 50, 250, 400, 0xb1bd9b);

        pauseMenuFrame.setStrokeStyle(10, 0xffffff);

        // show leaderboard button
        let a = newButton(this, "PLAY",
        () => {},
        windowWidth / 2, windowHeight / 2 - 2 * BUTTON_SPACING, BUTTON_STYLE);

        let b = newButton(this, "LEADERBOARD",
        () => {},
        windowWidth / 2, windowHeight / 2 - BUTTON_SPACING, BUTTON_STYLE);
        
        let c = newButton(this, "CHANGE LEVEL",
        () => {},
        windowWidth / 2, windowHeight / 2 + 2 , BUTTON_STYLE);
        
        let item1 = new MenuItem(a,() => {
            this.scene.pause();
            this.scene.launch("leaderboard", {fromMenu: true});
            this.scene.setVisible(false);
            this.menu.destroy()

        },this)
        
        let item2 = new MenuItem(b,() => {
            this.scene.pause();
            this.scene.launch("leaderboard", {fromMenu: true});
            this.scene.setVisible(false);
            this.menu.destroy()
        },this)

        let item3 = new MenuItem(c,() => {
            this.scene.pause();
            this.scene.launch("leaderboard", {fromMenu: true});
            this.scene.setVisible(false);
            this.menu.destroy()

        },this)

        let item4 = new MenuItem(this.add.image(windowWidth / 2, windowHeight / 2 + BUTTON_SPACING,"test"),()=>{
            console.log("test");
            this.menu.destroy()

        },this);

        this.menu = new NavMenu([item1,item2,item3,item4],MenuDirection.Vertical,this);
    }

    public update() {
        const pad = this.input.gamepad.pad1;

    }

}
