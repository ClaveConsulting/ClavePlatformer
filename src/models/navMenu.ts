import { NES_Button } from "../buttonMap";
import { MenuDirection } from "./direction";
export class NavMenu {
    private elements: MenuItem[];
    private activeIndex: number;
    private direction: MenuDirection;
    private parent: Phaser.Scene;
    private nextButton: NES_Button;
    private prevButton: NES_Button;
    private nextKey: number;
    private prevKey: number;
    private activeKey: number;

    constructor(menuItems:MenuItem[],direction:MenuDirection, parent:Phaser.Scene) {
        this.activeIndex = 0;
        this.elements = menuItems;
        this.elements.forEach((element)=>{element.deindicate();});
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
        this.elements.forEach((element)=>{
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

export class MenuItem {
    private target: MenuButton;
    private parent: Phaser.Scene;
    private func: () => void;
    constructor(x:number,y:number,text:string,func:()=>void,parent:Phaser.Scene) {
        this.target = new MenuButton(text,x,y,parent);
        this.parent = parent;
        this.func = func;
        this.target.boundingBox.on("pointerdown",func);
    }
    
    public activate(){
        this.func();
    }

    public indicate(){
        this.target.indicate();     
    }

    public deindicate(){
        this.target.deindicate();
    }

    public destroy(){
        this.target.element.destroy();
    }
}

class MenuButton {
    public element: Phaser.GameObjects.DOMElement;
    public boundingBox: Phaser.GameObjects.Rectangle;

    constructor(text:string, x:number, y:number, parent:Phaser.Scene){
        this.element = parent.add.dom(x,y,"button",null,text).setScrollFactor(0).disableInteractive();
        this.element.setClassName("nes-btn is-normal");
        this.boundingBox = parent.add.rectangle(x,y,this.element.width,this.element.height).setInteractive();

        this.boundingBox.on("pointerover", ()=>{
            this.element.setClassName("nes-btn is-success");
        },parent)

        this.boundingBox.on("pointerout", ()=>{
            this.element.setClassName("nes-btn is-normal");
        },parent)

    }
    public indicate(){
        this.element.setClassName("nes-btn is-success");
    }
    public deindicate(){
        this.element.setClassName("nes-btn is-normal");
    }
}