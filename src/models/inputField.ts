import { INDICATOR_OFFSET, GREY, TRIANGLE, WHITE } from "../utils";

export class InputField {
    public parent: Phaser.Scene;
    public X: number;
    public Y: number;
    public name: string;
    public style: Phaser.Types.GameObjects.Text.TextStyle;
    public value: string;
    public nameText: Phaser.GameObjects.Text;
    public textEntry: Phaser.GameObjects.Text;
    public active: boolean;
    public indicatorLeft: Phaser.GameObjects.Triangle;

    constructor(
        parent: Phaser.Scene,
        posX: number,
        posY: number,
        width: number,
        fieldNameText: string,
        style: Phaser.Types.GameObjects.Text.TextStyle) {
        this.parent = parent;
        this.X = posX;
        this.Y = posY;
        this.name = fieldNameText;
        this.style = style;
        this.active = false;
        
        this.nameText = parent.add.text(this.X, this.Y, this.name, this.style).setScrollFactor(0);

        this.textEntry = parent.add.text(this.X, this.Y, "", this.style).setScrollFactor(0);
        this.textEntry.setX(this.nameText.x + this.nameText.width);
        this.textEntry.setBackgroundColor(GREY);
        this.textEntry.setFixedSize(width - this.nameText.width, this.nameText.height);
        this.nameText.setBackgroundColor(GREY);


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
        this.textEntry.setBackgroundColor(WHITE);
        this.nameText.setBackgroundColor(WHITE);
        this.indicatorLeft.setVisible(true);
    }

    public deactivate() {
        this.active = false;
        this.textEntry.setBackgroundColor(GREY);
        this.nameText.setBackgroundColor(GREY);
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

export class TextField extends InputField {
    constructor(
        parent: Phaser.Scene,
        posX: number,
        posY: number,
        width: number,
        fieldNameText: string,
        style: Phaser.Types.GameObjects.Text.TextStyle) {
            super(parent,
                posX,
                posY,
                width,
                fieldNameText,
                style);

            parent.input.keyboard.on("keydown", (event: { keyCode: number; key: string; }) => {
                if (this.active) {
                    if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE && this.textEntry.text.length > 0) {
                        this.textEntry.text = this.textEntry.text.substring(0, this.textEntry.text.length - 1);
                        this.value = this.textEntry.text;
                    } else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode < 90)) {
                        this.textEntry.text += event.key;
                        this.value = this.textEntry.text;
                    }
                }
            });
        }
}

export class NumberField extends InputField {
    constructor(
        parent: Phaser.Scene,
        posX: number,
        posY: number,
        width: number,
        fieldNameText: string,
        style: Phaser.Types.GameObjects.Text.TextStyle) {
            super(parent,
                posX,
                posY,
                width,
                fieldNameText,
                style);

            parent.input.keyboard.on("keydown", (event: { keyCode: number; key: string; }) => {
                if (this.active) {
                    if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.BACKSPACE && this.textEntry.text.length > 0) {
                        this.textEntry.text = this.textEntry.text.substring(0, this.textEntry.text.length - 1);
                        this.value = this.textEntry.text;
                    } else if (event.keyCode >= Phaser.Input.Keyboard.KeyCodes.ZERO && event.keyCode <= Phaser.Input.Keyboard.KeyCodes.NINE) {
                        this.textEntry.text += event.key;
                        this.value = this.textEntry.text;
                    }
                }
            });
        }
}