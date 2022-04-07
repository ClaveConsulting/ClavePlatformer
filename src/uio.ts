import {GameScene} from "./gameScene";

export class Uio extends GameScene {
    public preload() {
        this.load.tilemapTiledJSON({ key: "map", url: "assets/uio/uio.json" });

        this.load.image({ key: "tileset", url: "assets/common/tileset.png" });
        this.load.image({ key: "star", url: "assets/common/star.png" });
        this.load.image({ key: "ball", url: "assets/common/ball.png" });
        this.load.image({ key: "sky", url: "assets/common/sky.png" });
        this.load.spritesheet({
            frameConfig: {
                frameHeight: 32,
                frameWidth: 16,
            },
            key: "dude",
            url: "assets/common/claveDude.png",
        });
        this.load.image({
            frameConfig: {
                frameHeight: 79,
                frameWidth: 35,
            },
            key: "finishLine",
            url: "assets/common/finishLine.png",
        });
    }
}
