import Phaser from "phaser";
import { Ntnu } from "./ntnu";

const initWidth = window.innerWidth;
const initHeight = window.innerHeight;

window.onload = () => {
    window.focus();
    const game: Phaser.Game = new Phaser.Game({
        height: initHeight,
        input: {
            gamepad: true,
        },
        physics: {
            arcade: {
                gravity: {
                    x: 0,
                    y: 700,
                },
            },
            default: "arcade",
        },
        render: { pixelArt: true, antialias: false },
        scene: Ntnu,
        type: Phaser.AUTO,
        width: initWidth,
    });
    resizeGame();
    window.addEventListener("resize", resizeGame);
};

function resizeGame() {
    const canvas: HTMLCanvasElement | null = document.querySelector("canvas");
    if (canvas !== null) {
        const windowWidth: number = window.innerWidth;
        const windowHeight: number = window.innerHeight;
        canvas.style.width = windowWidth + "px";
        canvas.style.height = windowHeight + "px";
    }
}
