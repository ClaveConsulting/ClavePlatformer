import { getLevelSelect, LEVEL_HEADER_STYLE, PALE_GREEN_NUMBER, WHITE_NUMBER } from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
const IMAGESCALE = 0.4;

export class LevelSelectScene extends Phaser.Scene {

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    public preload () {
        this.load.image('ntnu', 'assets/ntnu/ntnu_logo.png');
        this.load.image('uio', 'assets/uio/uio_logo.png');
    }

    public create() {
        if (getLevelSelect() !== "") {
            this.scene.switch(getLevelSelect());
        }

        const levelSelectMenuFrame = this.add.rectangle(windowWidth / 2, windowHeight / 2 , windowWidth - 200, windowHeight -200 , PALE_GREEN_NUMBER);

        levelSelectMenuFrame.setStrokeStyle(10,WHITE_NUMBER);

        // Select level text
        const levelSelectText = this.add.text(windowWidth / 2, levelSelectMenuFrame.getTopCenter().y + 50, "SELECT LEVEL", LEVEL_HEADER_STYLE);
        levelSelectText.setX(levelSelectText.x - levelSelectText.width / 2);

        const ntnuImage = this.add.image(0 , levelSelectMenuFrame.getCenter().y, "ntnu");
        ntnuImage.setScale(IMAGESCALE);
        ntnuImage.setX(levelSelectMenuFrame.getCenter().x - ntnuImage.width/4 - 50);
        ntnuImage.setInteractive();
        ntnuImage.on("pointerdown",() => {
            sessionStorage.setItem("LEVEL_SELECT", JSON.stringify("ntnu"));
            this.scene.launch("ntnu");
            this.scene.pause()
        });

        const uioImage = this.add.image(0 , levelSelectMenuFrame.getCenter().y, "uio");
        uioImage.setScale(IMAGESCALE);
        uioImage.setX(levelSelectMenuFrame.getCenter().x + uioImage.width/4 + 50);
        uioImage.setInteractive();
        uioImage.on("pointerdown",() => {
            sessionStorage.setItem("LEVEL_SELECT",JSON.stringify("uio"));
            this.scene.launch("uio");
            this.scene.pause();
        });


        const uioActive = this.tweens.add({
            ease: "linear",
            repeat: -1,
            scale: IMAGESCALE + 0.05,
            targets: uioImage,
            yoyo: true,
            duration: 200,
        }).pause();

        const ntnuActive = this.tweens.add({
            ease: "linear",
            repeat: -1,
            scale: IMAGESCALE + 0.05,
            targets: ntnuImage,
            yoyo: true,
            duration: 200,
        });

        let active = "ntnu"

        this.input.gamepad.once("connected", (pad:Phaser.Input.Gamepad.Gamepad) => {

            pad = this.input.gamepad.pad1;
            pad.on(
                "down",
                function (pad:Phaser.Input.Gamepad.Gamepad, index:number, button:Phaser.Input.Gamepad.Button,) {
                    if (button.index == 14){
                        uioActive.stop();
                        uioImage.setScale(IMAGESCALE);
                        ntnuActive.restart();
                        active = "ntnu"
                        
                    } else if (button.index == 15){
                        ntnuActive.stop();
                        ntnuImage.setScale(IMAGESCALE);
                        uioActive.restart();
                        active = "uio";
                    } else if (button.index == 1){
                        this.scene.launch(active);
                        sessionStorage.setItem("LEVEL_SELECT",JSON.stringify(active));
                        this.scene.pause();
                    }
                    console.log(button.index);
                },this)
            })

        ntnuImage.on("pointerover", () => {
            uioActive.stop();
            uioImage.setScale(IMAGESCALE);
            ntnuActive.restart();
            active = "ntnu"
        })

        uioImage.on("pointerover", () => {
            ntnuActive.stop();
            ntnuImage.setScale(IMAGESCALE);
            uioActive.restart();
            active = "uio";

        })


    }
    public update() {
        const pad = this.input.gamepad.pad1;
    }
}
