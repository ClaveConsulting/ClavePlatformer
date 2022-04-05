import Phaser from 'phaser';
import { ntnu } from './ntnu'

const initWidth = window.innerWidth;
const initHeight = window.innerHeight;

window.onload = () => {
    window.focus();
    const game: Phaser.Game = new Phaser.Game({
        type: Phaser.AUTO,
        width: initWidth,
        height: initHeight,
        scene: ntnu,
        render: { pixelArt: true, antialias: false },
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {
                    x: 0,
                    y: 700,
                },
            },
        },
        input: {
            gamepad: true,
        },
    });
    resizeGame();
    window.addEventListener('resize', resizeGame);
};

function resizeGame() {
    const canvas: HTMLCanvasElement | null = document.querySelector('canvas');
    if (canvas !== null) {
        const windowWidth: number = window.innerWidth;
        const windowHeight: number = window.innerHeight;
        canvas.style.width = windowWidth + 'px';
        canvas.style.height = windowHeight + 'px';
    }
}
