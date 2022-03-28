import gameScene from './gameScene.js';


export default class uio extends gameScene {
    
    preload() {
        this.load.tilemapTiledJSON('map', 'assets/uio/uio.json');


        this.load.image('tileset', 'assets/common/tileset.png');
        this.load.image('star', 'assets/common/star.png');
        this.load.image('ball', 'assets/common/ball.png');
        this.load.image('sky', 'assets/common/sky.png');
        this.load.spritesheet('dude', 'assets/common/dude-1.png', {
            frameWidth: 16,
            frameHeight: 32
        });
        this.load.image('finishLine', 'assets/common/finishLine.png', {
            frameHeight: 79,
            frameWidth: 35
        });
    }
}