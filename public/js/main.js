import uio from './uio.js';

var config = {
    type: Phaser.AUTO,
    width: 2000,
    height: 1125,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 700 },
        }
    },
    scene: uio
};

const game = new Phaser.Game(config);