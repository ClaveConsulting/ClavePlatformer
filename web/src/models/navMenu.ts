import {NES_Button} from "../buttonMap";
import {GREEN_NUMBER, WHITE_NUMBER} from "../utils";
import {MenuDirection} from "./direction";

const NES_BTN_CLASS_FONT_SIZE = 16;

export class NavMenu {
    private elements: (MenuButton | MenuImage)[];
    private activeIndex: number;
    private direction: MenuDirection;
    private parent: Phaser.Scene;

    private nextButton: NES_Button;
    private prevButton: NES_Button;

    private nextKey: number;
    private prevKey: number;
    private activeKey: number;

    constructor(
        menuItems: (MenuButton | MenuImage)[],
        direction: MenuDirection,
        parent: Phaser.Scene
    ) {
        this.activeIndex = 0;
        this.elements = menuItems;
        this.elements.forEach((element: MenuButton | MenuImage) => {
            element.deindicate();
        });
        this.elements[this.activeIndex].indicate();
        this.direction = direction;
        this.parent = parent;

        this.activeKey = Phaser.Input.Keyboard.KeyCodes.ENTER;
        if (this.direction == MenuDirection.Vertical) {
            this.nextButton = NES_Button.DOWN;
            this.prevButton = NES_Button.UP;
            this.nextKey = Phaser.Input.Keyboard.KeyCodes.DOWN;
            this.prevKey = Phaser.Input.Keyboard.KeyCodes.UP;
        } else if (this.direction == MenuDirection.Horizontal) {
            this.nextButton = NES_Button.RIGHT;
            this.prevButton = NES_Button.LEFT;
            this.nextKey = Phaser.Input.Keyboard.KeyCodes.RIGHT;
            this.prevKey = Phaser.Input.Keyboard.KeyCodes.LEFT;
        }

        parent.input.gamepad.on(
            "down",
            (
                pad: Phaser.Input.Gamepad.Gamepad,
                button: Phaser.Input.Gamepad.Button
            ) => {
                if (button.index == this.nextButton) {
                    this.next();
                } else if (button.index == this.prevButton) {
                    this.previous();
                } else if (button.index == NES_Button.A) {
                    this.elements[this.activeIndex].activate();
                }
            }
        );

        parent.input.keyboard.on(
            "keydown",
            (event: { keyCode: number; key: string }) => {
                if (event.keyCode === this.nextKey) {
                    this.next();
                } else if (event.keyCode === this.prevKey) {
                    this.previous();
                } else if (event.keyCode === this.activeKey) {
                    this.elements[this.activeIndex].activate();
                }
            }
        );
    }

    public next() {
        this.elements[this.activeIndex].deindicate();
        this.getNext().indicate();
    }

    public destroy() {
        this.elements.forEach((element: MenuButton | MenuImage) => {
            element.destroy();
        });
    }

    public previous() {
        this.elements[this.activeIndex].deindicate();
        this.getPrevious().indicate();
    }

    public activateCurrentSelected() {
        this.elements[this.activeIndex].activate();
    }

    private getNext() {
        if (this.activeIndex == this.elements.length - 1) {
            this.activeIndex = 0;
            return this.elements[this.activeIndex];
        }
        this.activeIndex += 1;
        return this.elements[this.activeIndex];
    }

    private getPrevious() {
        if (this.activeIndex == 0) {
            this.activeIndex = this.elements.length - 1;
            return this.elements[this.activeIndex];
        }
        this.activeIndex -= 1;
        return this.elements[this.activeIndex];
    }
}

export class MenuButton {
    public target: Phaser.GameObjects.DOMElement;
    public boundingBox: Phaser.GameObjects.Rectangle;
    public type = "button";
    private func: () => void;

    constructor(
        x: number,
        y: number,
        text: string,
        func: () => void,
        parent: Phaser.Scene,
        alternativeButton?: NES_Button,
        alternativeKey?: number
    ) {
        this.target = parent.add
            .dom(x, y, "button", null, text)
            .setScrollFactor(0)
            .disableInteractive();
        this.target.setClassName("nes-btn is-normal");
        this.boundingBox = parent.add
            .rectangle(x, y, this.target.width, this.target.height)
            .setInteractive()
            .setScrollFactor(0);
        this.func = func;
        this.boundingBox.on("pointerdown", () => {
            func();
        });

        this.target.setX(this.target.x - NES_BTN_CLASS_FONT_SIZE / 2);

        parent.input.gamepad.on(
            "down",
            (
                _: Phaser.Input.Gamepad.Gamepad,
                button: Phaser.Input.Gamepad.Button
            ) => {
                if (button.index == alternativeButton) {
                    this.func();
                }
            }
        );
        parent.input.keyboard.on(
            "keydown",
            (event: { keyCode: number; key: string }) => {
                if (event.keyCode == alternativeKey) {
                    this.func();
                }
            }
        );
    }

    public activate() {
        this.func();
    }

    public indicate() {
        this.target.setClassName("nes-btn is-success");
    }

    public deindicate() {
        this.target.setClassName("nes-btn is-normal");
    }

    public destroy() {
        this.target.destroy();
        this.boundingBox.destroy();
    }
}

export class MenuImage {
    public type = "image";
    private target: Phaser.GameObjects.Image;
    private func: () => void;
    private scale: number;
    private frame: Phaser.GameObjects.Rectangle;

    constructor(
        x: number,
        y: number,
        imageReference: string,
        scale: number,
        func: () => void,
        parent: Phaser.Scene
    ) {
        this.target = parent.add.image(x, y, imageReference).setInteractive();
        this.target.setScale(scale);
        this.func = func;
        this.target.on("pointerdown", func);
        this.scale = scale;
        this.frame = parent.add
            .rectangle(x, y, this.target.width, this.target.height)
            .setScale(scale);
        this.frame.setStrokeStyle(10, WHITE_NUMBER);
    }

    public activate() {
        this.func();
    }

    public indicate() {
        this.target.setScale(this.scale * 1.1);
        this.frame.setScale(this.scale * 1.1);
        this.frame.setStrokeStyle(20, GREEN_NUMBER);
    }

    public deindicate() {
        this.target.setScale(this.scale);
        this.frame.setScale(this.scale);
        this.frame.setStrokeStyle(10, WHITE_NUMBER);
    }

    public destroy() {
        this.target.destroy();
    }
}
