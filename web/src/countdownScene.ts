import { COUNTDOWN_TEXT_STYLE, getSelectedLevel } from "./utils";

const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;

export class CountdownScene extends Phaser.Scene {
  private countdownText: Phaser.GameObjects.Text;
  private initialTime: number;
  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  private onEvent() {
    this.initialTime -= 1; // One second
    this.countdownText.setText(String(this.initialTime));
    const selectedLevel = getSelectedLevel();
    if (!!selectedLevel && this.initialTime == 0) {
      this.scene.stop();
      this.scene.resume(selectedLevel);
    }
  }

  public create() {
    this.initialTime = 3;
    this.cameras.main.setBackgroundColor("rgba(120, 120, 120, 0.5)");

    this.time.addEvent({
      delay: 1000,
      callback: this.onEvent,
      callbackScope: this,
      loop: true,
    });

    this.countdownText = this.add
      .text(
        windowWidth / 2,
        windowHeight / 2,
        String(this.initialTime),
        COUNTDOWN_TEXT_STYLE
      )
      .setScrollFactor(0);

    this.countdownText.setX(
      this.countdownText.x - this.countdownText.width / 2
    );
    this.countdownText.setY(this.countdownText.y - 100);
  }
}
