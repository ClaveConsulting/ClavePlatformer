import {GameScene} from "./gameScene";

import tileset from "../assets/common/tileset.png";
import star from "../assets/common/star.png";
import ball from "../assets/common/ball.png";
import sky from "../assets/common/sky.png";
import ntnuMap from "../assets/ntnu/ntnu.json";
import claveDude from "../assets/common/claveDude.png";
import finishLine from "../assets/common/finishLine.png";

export class Ntnu extends GameScene {
    public preload() {
        this.load.tilemapTiledJSON({
            key: "map",
            url: ntnuMap,
        });

        this.load.image({key: "tileset", url: tileset});
        this.load.image({key: "star", url: star});
        this.load.image({key: "ball", url: ball});
        this.load.image({key: "sky", url: sky});
        this.load.spritesheet({
            frameConfig: {
                frameHeight: 32,
                frameWidth: 16,
            },
            key: "dude",
            url: claveDude,
        });
        this.load.image({
            frameConfig: {
                frameHeight: 79,
                frameWidth: 35,
            },
            key: "finishLine",
            url: finishLine,
        });
    }
}
