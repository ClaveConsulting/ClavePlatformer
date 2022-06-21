import { NES_Button } from "../buttonMap";
import { MenuDirection } from "./direction";
export class NavMenu {
    private elements: MenuImage[]|MenuButton[];
    private activeIndex: number;
    private direction: MenuDirection;
    private parent: Phaser.Scene;
    private nextButton: NES_Button;
    private prevButton: NES_Button;
    private nextKey: number;
    private prevKey: number;
    private activeKey: number;

    constructor(menuItems:MenuButton[]|MenuImage[],direction:MenuDirection, parent:Phaser.Scene) {
        this.activeIndex = 0;
        this.elements = menuItems;
        this.elements.forEach((element:MenuButton|MenuImage)=>{element.deindicate();});
        this.elements[this.activeIndex].indicate();
        this.direction = direction;
        this.parent = parent;
        
        this.activeKey = Phaser.Input.Keyboard.KeyCodes.ENTER;
        if (this.direction == MenuDirection.Vertical) {
            this.nextButton = NES_Button.DOWN;
            this.prevButton = NES_Button.UP;
            this.nextKey = Phaser.Input.Keyboard.KeyCodes.DOWN;
            this.prevKey = Phaser.Input.Keyboard.KeyCodes.UP;
        } else if (this.direction == MenuDirection.Horizontal ) {
            this.nextButton = NES_Button.RIGHT;
            this.prevButton = NES_Button.LEFT;
            this.nextKey = Phaser.Input.Keyboard.KeyCodes.RIGHT;
            this.prevKey = Phaser.Input.Keyboard.KeyCodes.LEFT;
        }

        parent.input.gamepad.on("down", (pad:Phaser.Input.Gamepad.Gamepad,button:Phaser.Input.Gamepad.Button,index:number)=>{
            if (button.index == this.nextButton) {
                this.next();
            } else if (button.index == this.prevButton) {
                this.previous();
            } else if (button.index == NES_Button.A) {
                this.elements[this.activeIndex].activate();
            }
        });

        parent.input.keyboard.on("keydown", (event: { keyCode: number; key: string; }) => {
            if (event.keyCode === this.nextKey) {
                this.next()
            } else if (event.keyCode === this.prevKey) {
                this.previous();
            } else if (event.keyCode === this.activeKey) {
                this.elements[this.activeIndex].activate();
            }
        });
    }

    public next(){
        this.elements[this.activeIndex].deindicate();
        this.getNext().indicate();
    }

    private getNext(){

        if (this.activeIndex == this.elements.length - 1){
            this.activeIndex = 0;
            return this.elements[this.activeIndex];
        } else {
            this.activeIndex += 1;
            return this.elements[this.activeIndex]
        }
    }
    
    public destroy() {
        this.elements.forEach((element:MenuButton|MenuImage)=>{
            element.destroy();
        })
    }

    public previous(){
        this.elements[this.activeIndex].deindicate();
        this.getPrevious().indicate()
    }

    private getPrevious(){
        if (this.activeIndex == 0) {
            this.activeIndex = this.elements.length - 1;
            return this.elements[this.activeIndex];
        } else {
            this.activeIndex -= 1
            return this.elements[this.activeIndex]
        }
    }

    public activateCurrentSelected() {
        this.elements[this.activeIndex].activate()
    }
}

export class MenuButton {
    private target: Phaser.GameObjects.DOMElement;
    private func: () => void;
    private boundingBox: Phaser.GameObjects.Rectangle
    constructor(x:number,y:number,text:string,func:()=>void,parent:Phaser.Scene) {
        this.target = parent.add.dom(x,y,"button",null,text).setScrollFactor(0).disableInteractive();
        this.target.setClassName("nes-btn is-normal");
        this.boundingBox = parent.add.rectangle(x, y, this.target.width, this.target.height).setInteractive();
        this.func = func;
        this.boundingBox.on("pointerdown",func);
    }
    
    public activate(){
        this.func();
    }

    public indicate(){
        this.target.setClassName("nes-btn is-success");     
    }

    public deindicate(){
        this.target.setClassName("nes-btn is-normal");     
    }

    public destroy(){
        this.target.destroy();
        this.boundingBox.destroy();
    }
}

export class MenuImage {
    private target: Phaser.GameObjects.Image;
    private func: () => void;
    private scale:number;

    constructor(x:number, y:number, imageReference:string, scale:number, func:()=>void, parent:Phaser.Scene) {
        this.target = parent.add.image(x,y,imageReference).setInteractive();
        this.target.setScale(scale);
        this.func = func;
        this.target.on("pointerdown",func);
    }

    public activate(){
        this.func();
    }

    public indicate(){
        this.target.setScale(this.scale*1.1);     
    }

    public deindicate(){
        this.target.setScale(this.scale);     
    }

    public destroy(){
        this.target.destroy();
    } 
}