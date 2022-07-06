import { getTournamentValue, setTournamentValue } from "../utils";

export class CheckBox {
  public value: string;
  public box: Phaser.GameObjects.DOMElement;
  private enabled: boolean;
  private parent: Phaser.Scene;
  private posX: number;
  private posY: number;

  constructor(parent: Phaser.Scene, posX: number, posY: number) {
    this.parent = parent;
    this.posX = posX;
    this.posY = posY;
    this.enabled = false;
  }

  public init(htmlref: string) {
    this.box = this.parent.add
      .dom(this.posX, this.posY)
      .createFromCache(htmlref);

    this.box.addListener("change");
    this.box.on("change", () => {
      setTournamentValue(!getTournamentValue());
    });
  }

  public destroy() {
    this.box.destroy();
  }
}
