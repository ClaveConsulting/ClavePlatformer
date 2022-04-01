import gameScene from './gameScene.js';

export default class uio extends gameScene {
    preload() {
        this.load.tilemapTiledJSON({ key: 'map', url: 'assets/uio/uio.json' });

        this.load.image({ key: 'tileset', url: 'assets/common/tileset.png' });
        this.load.image({ key: 'star', url: 'assets/common/star.png' });
        this.load.image({ key: 'ball', url: 'assets/common/ball.png' });
        this.load.image({ key: 'sky', url: 'assets/common/sky.png' });
        this.load.spritesheet({
            key: 'dude',
            url: 'assets/common/claveDude.png',
            frameConfig: {
                frameWidth: 16,
                frameHeight: 32,
            },
        });
        this.load.image({
            key: 'finishLine',
            url: 'assets/common/finishLine.png',
            frameConfig: {
                frameHeight: 79,
                frameWidth: 35,
            },
        });
    }
}
