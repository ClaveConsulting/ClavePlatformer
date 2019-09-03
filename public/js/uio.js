var player;
var stars;
var bombs;
var ground;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var keyboardInput;
var keyboardInputC;
var spaceKey;
var highScoreText;
var balls;
var direction;
var button;
var counterText;
var counter = 0;
var timedEvent;

export default class uio{
    preload() {
        this.load.tilemapTiledJSON('map', 'assets/uio/level-1.json');
        this.load.image('tileset', 'assets/uio/tileset.png');
        this.load.image('star', 'assets/uio/star.png');
        this.load.image('bomb', 'assets/uio/bomb.png');
        this.load.image('ball', 'assets/uio/ball.png');
        this.load.image('sky', 'assets/uio/sky.png');
        this.load.spritesheet('dude', 'assets/uio/dude-1.png', { frameWidth: 32, frameHeight: 42 });
    }
    
    create() {


        this.add.image(0, 0, 'sky');
    
        var map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });
        var tileset = map.addTilesetImage('tileset', 'tileset');
        var background = map.createStaticLayer('background', tileset, 0, 0);
        var ground = map.createStaticLayer('ground', tileset, 0, 0);
    
        //Before you can use the collide function you need to set what tiles can collide
        map.setCollisionBetween(1, 100, true, 'ground');
    
        player = this.physics.add.sprite(32, 32, 'dude');
        player.setCollideWorldBounds(true);
        player.onWorldBounds = true;
        player.setBounce(0.1);


        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    
        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
        keyboardInput = this.input.keyboard.addKeys('H');
        keyboardInputC = this.input.keyboard.addKeys('C');
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 100, y: 0, stepX: 170 }
        });
    
        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
        });
    
        bombs = this.physics.add.group();
        balls = this.physics.add.group();

        //  The score
        scoreText = this.add.text(16, 16, 'CLAVE CREDITS: 0',
            {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0);
        //  Collide the player and the stars with the ground
        this.physics.add.collider(player, ground);
        this.physics.add.collider(stars, ground);
        this.physics.add.collider(bombs, ground);

    
        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(player, stars, collectStar, null, this);
        this.physics.add.collider(player, bombs, hitBomb, null, this);

        // See if ball overlaps with bomb
        this.physics.add.overlap(bombs, balls, hitBombBall, null, this);
    
        this.cameras.main.startFollow(player, true, 0.3, 0.3);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, true);


        // New Game Button
        button = this.add.text(250, 16, 'New Game',
            {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0);

        button.setInteractive();
        button.on('pointerdown', () => {
            this.scene.restart();
            gameOver=false;
            score =0;
            counter = 0;
        });
        button.on('pointerover', () => {
            button.setBackgroundColor("#0f0");
        });
        button.on('pointerout', () => {
            button.setBackgroundColor("#fff");
        });


        // TIMER
        counterText = this.add.text(400, 16, 'Time: 0',
            {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0);

            timedEvent = this.time.addEvent({delay: 1000, callback: updateCounter, callbackScope: this, loop: true});
    }
    
    update() {
        if (gameOver) {
            return;
        }
    
        if (cursors.left.isDown) {
            player.setVelocityX(-260);
            player.anims.play('left', true);
            direction = 'left';
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(260);
            player.anims.play('right', true);
            direction = 'right';
        } else {
            player.anims.stop();
            player.setVelocityX(0);
        }
    
        if (spaceKey.isDown && player.body.blocked.down) {
            player.setVelocityY(-400);
        }
    
        if (Phaser.Input.Keyboard.JustDown(keyboardInput.H)) {
            printHighScoreToScreen(this);
        }

        if (Phaser.Input.Keyboard.JustDown(keyboardInputC.C)) {
            throwBall();
        }

    }
}

function updateCounter() {
    counter++;
    counterText.setText('Time: ' + counter + 'S');
}

function throwBall() {
    var ball = balls.create(player.x,player.y,'ball');
    if(direction === 'right'){
        ball.setVelocity(1000, -200);
    }
    if(direction === 'left'){
        ball.setVelocity(-1000, -200);
    }
}

function hitBombBall(bomb, ball){
    bomb.disableBody(true, true);
    ball.disableBody(true, true);
}

function collectStar(player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('CLAVE CREDITS: ' + score);

    if (stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        //make 2 bombs//
        const numberOfBombsSpawned = 2;
        for (var i = 0; i < numberOfBombsSpawned; i++) {
            var x =  Phaser.Math.Between(0, 2080);
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }

    }
}


function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    recordHighScore();

    printHighScoreToScreen(this);


    gameOver = true;
}

const recordHighScore = () => {

    let highScoreArrayAssetsShowcase = JSON.parse(localStorage.getItem("highScoreArrayAssetsShowcase"));

    if (highScoreArrayAssetsShowcase === null || highScoreArrayAssetsShowcase === undefined) {
        highScoreArrayAssetsShowcase = [];
    }

    const playerName = prompt("Bra jobba! Skriv inn fullt navn:");

    const gameRecord = {
        player: playerName,
        playerScore: score
    };

    highScoreArrayAssetsShowcase.push(gameRecord);

    highScoreArrayAssetsShowcase.sort(compareGameRecords);

    if (highScoreArrayAssetsShowcase.length > 15) {
        highScoreArrayAssetsShowcase.pop()
    }

    localStorage.setItem("highScoreArrayAssetsShowcase", JSON.stringify(highScoreArrayAssetsShowcase));

};

const printHighScoreToScreen = (context) => {
    //context er 'this' i parent

    let highScoreArrayAssetsShowcase = JSON.parse(localStorage.getItem("highScoreArrayAssetsShowcase"));

    if (highScoreArrayAssetsShowcase === null || highScoreArrayAssetsShowcase === undefined) {
        highScoreArrayAssetsShowcase = [];
    }

    highScoreText = context.add.text(300, 60, 'HIGH SCORE', { fontSize: '40px', fill: '#000' })
        .setScrollFactor(0);
    let yPos = 130;

    highScoreArrayAssetsShowcase.forEach(function (gameRecord) {
        highScoreText = context.add.text(120, yPos, gameRecord.player + ': ', { fontSize: '32px', fill: '#000' })
            .setScrollFactor(0);
            highScoreText = context.add.text(600, yPos, gameRecord.playerScore, { fontSize: '32px', fill: '#000' })
                .setScrollFactor(0);
            yPos += 30;
    }
    );
};

const compareGameRecords = (a, b) => {
    if (a.playerScore < b.playerScore) {
        return 1;
    }
    if (a.playerScore > b.playerScore) {
        return -1;
    }
    return 0
};