
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

        if (sessionStorage.getItem("LEVEL_SELECT") != null) {
            this.scene.switch(String(sessionStorage.getItem("LEVEL_SELECT")));
        }

        const levelSelectMenuFrame = this.add.rectangle(windowWidth / 2, windowHeight / 2 , windowWidth - 200, windowHeight -200 , 0xb1bd9b);

        levelSelectMenuFrame.setStrokeStyle(10);

        // Select level text
        const levelSelectText = this.add.text(windowWidth / 2, levelSelectMenuFrame.getTopCenter().y + 50, "SELECT LEVEL");
        levelSelectText.setX(levelSelectText.x - levelSelectText.width / 2);

        const ntnuImage = this.add.image(0 , levelSelectMenuFrame.getCenter().y, "ntnu");
        ntnuImage.setScale(IMAGESCALE);
        ntnuImage.setX(levelSelectMenuFrame.getCenter().x - ntnuImage.width/4 - 50);
        ntnuImage.setInteractive();
        ntnuImage.on("pointerup",() => {
            this.scene.launch("ntnu")
            sessionStorage.setItem("LEVEL_SELECT","ntnu");
            this.scene.pause()
        });

        const uioImage = this.add.image(0 , levelSelectMenuFrame.getCenter().y, "uio");
        uioImage.setScale(IMAGESCALE);
        uioImage.setX(levelSelectMenuFrame.getCenter().x + uioImage.width/4 + 50);
        uioImage.setInteractive();
        uioImage.on("pointerup",() => {
            this.scene.launch("uio");
            sessionStorage.setItem("LEVEL_SELECT","uio")
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

        this.input.gamepad.once("connected", (pad:Phaser.Input.Gamepad.Gamepad) => {

            pad = this.input.gamepad.pad1;
            pad.on(
                "down",
                function (pad:Phaser.Input.Gamepad.Gamepad, index:number, button:Phaser.Input.Gamepad.Button,) {
                    if (button.index == 14){
                        uioActive.stop();
                        uioImage.setScale(IMAGESCALE);
                        ntnuActive.restart();
                        
                    } else if (button.index == 15){
                        ntnuActive.stop();
                        ntnuImage.setScale(IMAGESCALE);
                        uioActive.restart();
                    }
                },this)
            })

        ntnuImage.on("pointerover", () => {
            uioActive.stop();
            uioImage.setScale(IMAGESCALE);
            ntnuActive.restart();
        })

        uioImage.on("pointerover", () => {
            ntnuActive.stop();
            ntnuImage.setScale(IMAGESCALE);
            uioActive.restart();
        })


    }
    public update() {
        const pad = this.input.gamepad.pad1;
    }
}
