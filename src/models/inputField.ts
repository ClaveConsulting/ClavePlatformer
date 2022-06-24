export class InputForm {
    public value: string;

    public form: Phaser.GameObjects.DOMElement;

    private nameValue: string;

    private phoneValue:string;

    constructor(
        parent: Phaser.Scene,
        posX: number,
        posY: number,
        htmlRef: string,
    ) {
        this.form = parent.add.dom(
            posX, posY,
        ).createFromCache(htmlRef);

        this.form.addListener("input");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.form.on(
            "input", (event: { target:any; }) => {
                if (event.target.name == "name") {
                    this.setName(event.target.value);
                } else if (event.target.name == "phone") {
                    this.setPhone(event.target.value);
                }
            },
        );
    }

    private setPhone(value:string) {
        this.phoneValue = value;
    }

    private setName(value:string) {
        this.nameValue = value;
    }

    public getName() {
        return this.nameValue;
    }

    public getPhone() {
        return this.phoneValue;
    }

    public destroy() {
        this.form.destroy();
    }
}
