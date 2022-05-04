import { getRecordTimeLocalStorage } from "../utils";

export class Leaderboard {
    public frame: Phaser.GameObjects.Rectangle;
    private parent: Phaser.Scene;
    private X: number;
    private Y: number;
    private title: Phaser.GameObjects.Text;
    private names: Phaser.GameObjects.Text[];
    private times: Phaser.GameObjects.Text[];
    private ranks: Phaser.GameObjects.Text[];

    constructor(
        parent: Phaser.Scene,
        posX: number,
        posY: number,
    ) {
        this.parent = parent;
        this.X = posX;
        this.Y = posY;
        this.frame = this.parent.add.rectangle(this.X, this.Y, 600, 800, 0xb1bd9b).setScrollFactor(0);
        this.frame.setStrokeStyle(10, 0xffffff);
        this.title = this.parent.add.text(
            0, 0, "Leaderboard", {
            color: "rgb(0,255,0)",
            fontSize: "70px",
            fontStyle: "bold",
        })
        .setScrollFactor(0);
        this.title.setPosition(posX - this.title.width / 2, this.frame.y - this.frame.height / 2 + 20);
        this.names = [];
        this.times = [];
        this.ranks = [];
        this.update();
    }

    public refresh() {
        this.clear();
        this.update();
    }

    public destroy() {
        this.clear();
        this.frame.destroy();
        this.title.destroy();
    }

    private update() {
        let timeArrayAssetsShowcase = getRecordTimeLocalStorage();

        if (timeArrayAssetsShowcase.length > 10) {
            timeArrayAssetsShowcase = timeArrayAssetsShowcase.slice(0, 10);
        }

        let yPos = this.frame.getTopCenter().y + 100;
        let index = 0;
        timeArrayAssetsShowcase.forEach((gameRecord) => {
            this.ranks.push(this.parent.add
                .text(this.frame.getBottomLeft().x + 30, yPos, String(index + 1 + "."), {
                    color: "#000",
                    fontSize: "32px",
                    fontStyle: "bold",
                })
                .setScrollFactor(0));
            this.names.push(this.parent.add
                .text(this.frame.getBottomLeft().x + 90, yPos, gameRecord.name ?? "--" + ": ", {
                    color: "#000",
                    fontSize: "32px",
                    fontStyle: "bold",
                })
                .setScrollFactor(0));
            this.times.push(this.parent.add
                    .text(this.frame.getBottomRight().x - 135, yPos, gameRecord.time, {
                        color: "#000",
                        fontSize: "32px",
                        fontStyle: "bold",
                    })
                    .setScrollFactor(0));
            yPos += 45;
            index ++;
            });
        }

    private clear() {
        this.names.forEach((name) => {
            name.destroy();
        });
        this.times.forEach((time) => {
            time.destroy();
        });
        this.ranks.forEach((rank) => {
            rank.destroy();
        });
    }
}
