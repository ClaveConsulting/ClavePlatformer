import Phaser from "phaser";
import { DeathScene } from "./deathScene";
import { FinishScene } from "./finishScene";
import { LeaderboardScene } from "./leaderboard";
import { Ntnu } from "./ntnu";
import { PauseScene } from "./pauseScene";
import { Uio } from "./uio";

const initWidth = window.innerWidth - 15;
const initHeight = window.innerHeight - 10;

window.onload = () => {
    window.focus();
    const game: Phaser.Game = new Phaser.Game({
        dom: {
            createContainer: true,
        },
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
        scene: [
            new Uio({key: "game"}),
            new PauseScene({key: "pause"}),
            new DeathScene({key: "death"}),
            new FinishScene({key: "finish"}),
            new LeaderboardScene({key: "leaderboard"}),
        ],
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
