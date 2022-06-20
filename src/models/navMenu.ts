import { NES_A } from "../buttonMap";
export class NavMenu {
    private elements: MenuItem[];
    private activeIndex: number;
    
    constructor(menuItems:MenuItem[],) {
        this.elements = menuItems;
        this.elements[0].indicate()
    }

    public next(){
        this.elements[this.activeIndex].deactivate();
        this.getNext().activate();
    }

    private getNext(){

        if (this.activeIndex == this.elements.length){
            this.activeIndex = 0;
            return this.elements[this.activeIndex];
        } else {
            return this.elements[this.activeIndex + 1]
        }
    }

    public previous(){
        this.elements[this.activeIndex].deactivate();
        this.getPrevious().deactivate()
    }

    private getPrevious(){
        if (this.activeIndex == 0) {
            this.activeIndex = this.elements.length;
            return this.elements[this.activeIndex];
        } else {
            return this.elements[this.activeIndex - 1]
        }
    }

    public activateCurrentSelected() {
        this.elements[this.activeIndex].activate()
    }
}

export class MenuItem {
    private active:boolean;
    private indicating:boolean;
    private target: Phaser.GameObjects.Image|Phaser.GameObjects.Text;
    private parent: Phaser.Scene;
    constructor(object:Phaser.GameObjects.Image|Phaser.GameObjects.Text,func:()=>void,parent:Phaser.Scene) {
        this.active = false;
        this.target = object;
        this.parent = parent;

        this.parent.input.gamepad.on("down",function(pad:Phaser.Input.Gamepad.Gamepad,button:Phaser.Input.Gamepad.Button,index:number) {
            if (button.index == NES_A && this.active){
                func
            }
        });

        parent.input.keyboard.on("keydown_ENTER",() => {
            if (this.indicating){
                func
            }
        },parent);

        this.target.on("pointerdown",func);

        this.target.on("pointerover",()=>{this.indicate()});
        this.target.on("pointerout",()=>{this.deindicate()});
    }
    
    public activate(){
        this.active = true;
    }
    public deactivate(){
        this.active = false;
    }

    public indicate(){
        
        this.indicating = true;
    }

    public deindicate(){
        this.indicating = false;
    }
}
