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
        this.textEntry.setFixedSize(this.nameText.width + 100, this.nameText.height);
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
    }

    public deactivate() {
        this.active = false;
        this.textEntry.setBackgroundColor("#555");
        this.nameText.setBackgroundColor("#555");
    }

    public switchActive() {
        if (this.active) {
            this.deactivate();
        } else {
            this.activate();
        }
    }
}
