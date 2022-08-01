import {getTournamentNameValue} from "../utils";

export class TournamentInputForm {
    public value: string;
    public form: Phaser.GameObjects.DOMElement;
    private nameValue: string;

    constructor(
        parent: Phaser.Scene,
        posX: number,
        posY: number,
        htmlRef: string
    ) {
        this.nameValue = "";

        this.form = parent.add.dom(posX, posY).createFromCache(htmlRef);

        const currentTournamentNameValue = getTournamentNameValue();
        if (!!currentTournamentNameValue) {
            document
                .querySelectorAll('input[name="name"]')
                .forEach(
                    (e: HTMLFormElement) => (e.value = currentTournamentNameValue)
                );
        }

        this.form.addListener("input");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.form.on("input", (event: { target: any }) => {
            if (event.target.name == "name") {
                this.setName(event.target.value);
            }
        });
    }

    public getName() {
        return this.nameValue;
    }

    public destroy() {
        this.form.destroy();
    }

    public clear() {
        document
            .querySelectorAll('input[name="name"]')
            .forEach((e: HTMLFormElement) => (e.value = ""));
    }

    private setName(value: string) {
        this.nameValue = value;
    }
}
