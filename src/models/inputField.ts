import { INDICATOR_OFFSET, PI, TRIANGLE } from "../utils";

export class InputField {
    private parent: Phaser.Scene;
    private X: number;
    private Y: number;
    private name: string;
    private style: Phaser.Types.GameObjects.Text.TextStyle;
    private value: string;
    private nameText: Phaser.GameObjects.Text;
    private textEntry: Phaser.GameObjects.Text;
    private active: boolean;
    private indicatorLeft: Phaser.GameObjects.Triangle;
    private indicatorRight: Phaser.GameObjects.Triangle;

    constructor(
        parent: Phaser.Scene,
        posX: number,
        posY: number,
        fieldNameText: string,
        style: Phaser.Types.GameObjects.Text.TextStyle) {
        this.parent = parent;
        this.X = posX;
        this.Y = posY;
        this.name = fieldNameText;
        this.style = style;
        this.active = false;

        this.nameText = parent.add.text(this.X, this.Y, this.name, this.style).setScrollFactor(0);
        this.nameText.setX(this.nameText.x - this.nameText.width);

        this.textEntry = parent.add.text(this.X, this.Y, "", this.style).setScrollFactor(0);

        this.textEntry.setBackgroundColor("#555");
        this.textEntry.setFixedSize(this.nameText.width + 50, this.nameText.height);
        this.nameText.setBackgroundColor("#555");

        parent.input.keyboard.on("keydown", (event: { keyCode: number; key: string; }) => {
            if (this.active) {
                if (event.keyCode === 8 && this.textEntry.text.length > 0) {
                    this.textEntry.text = this.textEntry.text.substring(0, this.textEntry.text.length - 1);
                    this.value = this.textEntry.text;
                } else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
                    this.textEntry.text += event.key;
                    this.value = this.textEntry.text;
                }
            }
        });

        // Indicator Triangle
        this.indicatorLeft = parent.add.triangle(
            0,
            0,
            TRIANGLE.x1,
            TRIANGLE.y1,
            TRIANGLE.x2,
            TRIANGLE.y2,
            TRIANGLE.x3,
            TRIANGLE.y3,
            0xffffff,
            );
        this.indicatorLeft.setAngle(0);
        this.indicatorLeft.setX(this.nameText.x - INDICATOR_OFFSET);
        this.indicatorLeft.setY(this.nameText.y + this.nameText.height / 2 + this.indicatorLeft.height / 2);
        this.indicatorLeft.setVisible(false);

        this.parent.tweens.add({

            ease: "Sine.easeInOut",
            repeat: -1,
            scaleX: 0.5,
            targets: this.indicatorLeft,
            yoyo: true,
        });
    }

    public getValue() {
        return this.value;
    }

    public clear() {
        this.value = "";
        this.textEntry.text = "";
    }

    public activate() {
        this.active = true;
        this.textEntry.setBackgroundColor("#fff");
        this.nameText.setBackgroundColor("#fff");
        this.indicatorLeft.setVisible(true);
    }

    public deactivate() {
        this.active = false;
        this.textEntry.setBackgroundColor("#555");
        this.nameText.setBackgroundColor("#555");
        this.indicatorLeft.setVisible(false);

    }

    public switchActive() {
        if (this.active) {
            this.deactivate();
        } else {
            this.activate();
        }
    }
}
