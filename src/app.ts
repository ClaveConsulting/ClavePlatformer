import Phaser from "phaser";
import { DeathScene } from "./deathScene";
import { FinishScene } from "./finishScene";
import { LeaderboardScene } from "./leaderboardScene";
import { LevelSelectScene } from "./levelSelectScene";
import { Ntnu } from "./ntnu";
import { PauseScene } from "./pauseScene";
import { Uio } from "./uio";

const initWidth = window.innerWidth;
const initHeight = window.innerHeight;

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
            new LevelSelectScene({key:"levelSelect"}),
            new Uio({key: "uio"}),
            new Ntnu({key: "ntnu"}),
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
