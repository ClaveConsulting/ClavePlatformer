
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

        const levelSelectMenuFrame = this.add.rectangle(windowWidth / 2, windowHeight / 2 , windowWidth - 200, windowHeight -200 , 0xb1bd9b);

        levelSelectMenuFrame.setStrokeStyle(10, 0xffffff);

        // Select level text
        const levelSelectText = this.add.text(windowWidth / 2, levelSelectMenuFrame.getTopCenter().y + 50, "SELECT LEVEL");
        levelSelectText.setX(levelSelectText.x - levelSelectText.width / 2);

        const ntnuImage = this.add.image(0 , levelSelectMenuFrame.getCenter().y, "ntnu");
        ntnuImage.setScale(IMAGESCALE);
        ntnuImage.setX(levelSelectMenuFrame.getCenter().x - ntnuImage.width/4 - 50);
        ntnuImage.setInteractive();
        ntnuImage.on("pointerup",() => {
            this.scene.launch("ntnu");
            this.scene.stop();
            this.scene.setVisible(false);
            sessionStorage.setItem("LEVEL_SELECT","ntnu")
        });
        
        const uioImage = this.add.image(0 , levelSelectMenuFrame.getCenter().y, "uio");
        uioImage.setScale(IMAGESCALE);
        uioImage.setX(levelSelectMenuFrame.getCenter().x + uioImage.width/4 + 50);
        uioImage.setInteractive();
        uioImage.on("pointerup",() => {
            this.scene.launch("uio");
            this.scene.stop();
            this.scene.setVisible(false);
            sessionStorage.setItem("LEVEL_SELECT","uio")
        });

    }

    public update() {
        const pad = this.input.gamepad.pad1;

    }

}
