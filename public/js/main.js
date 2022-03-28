import ntnu from './ntnu.js';

var width = window.innerWidth;
var height = window.innerHeight;

var config = {
    type: Phaser.AUTO,
    width: width,
    height: height,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 700 },
        }
    },
    input: {
        gamepad: true
    },
    scene: ntnu
};

const game = new Phaser.Game(config);
