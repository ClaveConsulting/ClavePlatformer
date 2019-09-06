import uio from './uio.js';

var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 1000,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 700 },
            debug: true
        }
    },
    scene: uio
};

const game = new Phaser.Game(config);