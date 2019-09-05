var player;
var stars;
var bombs;
var ground;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var gameOverText;
var leaderboard;
var keyboardInput;
var keyboardInputC;
var keyboardInputQ;
var spaceKey;
var highScoreText;
var balls;
var direction;
var button;
var counterText;
var counter = 0;
var timedEvent;
var finishline;
var numberOfStars = 0;
var starsRemaining;
var deadlyTiles = [];
var walkspeed =  800;
var jumpspeed = 600;

export default class uio{
    preload() {
        this.load.tilemapTiledJSON('map', 'assets/uio/ntnu-1.json');
        this.load.image('tileset', 'assets/uio/tileset.png');
        this.load.image('star', 'assets/uio/star.png');
        this.load.image('bomb', 'assets/uio/bomb.png');
        this.load.image('ball', 'assets/uio/ball.png');
        this.load.image('sky', 'assets/uio/sky.png');
        this.load.spritesheet('dude', 'assets/uio/dude-1.png', { frameWidth: 16, frameHeight: 32 });
        this.load.image('finishLine', 'assets/uio/finishLine.png');
    }
    
    create() {


        this.add.image(0, 0, 'sky');

        var map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });
        var tileset = map.addTilesetImage('tileset', 'tileset');
        var background = map.createStaticLayer('background', tileset, 0, 0);
        var ground = map.createStaticLayer('ground', tileset, 0, 0);


        // Before you can use the collide function you need to set what tiles can collide
        map.setCollisionBetween(1, 100, true, 'ground');

        // Add player to the game
        const spawnPoint = map.findObject("spawnpoints", obj => obj.name === "player");
        player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'dude');
        player.setCollideWorldBounds(true);
        player.onWorldBounds = true;
        player.setBounce(0.1);
        player.body.allowGravity;
        player.body.setGravityY(750);


        // Setting deadly tiles
        var foreground = map.createStaticLayer('foreground', tileset, 0, 0);
        foreground.forEachTile((tile) => {
            if(tile.properties.deadly === true){
                deadlyTiles.push(tile.index);
            }
        });
        foreground.setTileIndexCallback(deadlyTiles, deadlyTileHit, this);


        // Player animations
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
        keyboardInputQ = this.input.keyboard.addKeys('Q');
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    


        // Adding stars to the game
        stars = this.physics.add.group();
        map.getObjectLayer("spawnpoints").objects.forEach((o) => {
            var star = stars.create(o.x,o.y,'star');
            numberOfStars +=1;
            star.setBounce(1);
        });

        starsRemaining = numberOfStars;

        stars.children.iterate(function (child) {
            child.body.setCircle(12);
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
    
        bombs = this.physics.add.group();
        balls = this.physics.add.group();

        // Adding finishline at end of the map
        const finishPoint = map.findObject("spawnpoints", obj => obj.name === "finishline");
        finishline = this.physics.add.image(finishPoint.x, finishPoint.y, 'finishLine');



        //  The score
        scoreText = this.add.text(16, 16, 'Stars Remaining: ' + starsRemaining,
            {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0);


        //  Collide the player and the stars with the ground
        this.physics.add.collider(finishline, ground);
        this.physics.add.collider(player, ground);
        this.physics.add.collider(stars, ground);
        this.physics.add.collider(bombs, ground);

    
        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(player, stars, collectStar, null, this);
        this.physics.add.collider(player, bombs, hitBomb, null, this);

        // See if ball overlaps with bomb
        this.physics.add.overlap(bombs, balls, hitBombBall, null, this);

        // Checks to see if player is at finishline
        this.physics.add.overlap(player, finishline, crossedFinishline, null, this);


        this.physics.add.overlap(player, foreground);
    
        this.cameras.main.startFollow(player, true, 0.3, 0.3);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, true);


        // "New "Game" Button
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
            gameOver=false;
            counter = 0;
            numberOfStars = 0;
            this.scene.restart();

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




        const numberOfBombsSpawned = 2;
        for (var i = 0; i < numberOfBombsSpawned; i++) {
            var x =  Phaser.Math.Between(1000, 2080);
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }


    }
    
    update() {
        if (gameOver) {
            return;
        }
    
        if (cursors.left.isDown) {
            player.setVelocityX(-walkspeed);
            player.anims.play('left', true);
            direction = 'left';
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(walkspeed);
            player.anims.play('right', true);
            direction = 'right';
        } else {
            player.anims.stop();
            player.setVelocityX(0);
        }
    
        if (spaceKey.isDown && player.body.blocked.down) {
            player.setVelocityY(-jumpspeed);
        }
    
        if (Phaser.Input.Keyboard.JustDown(keyboardInput.H)) {
            printTime(this);
        }

        if (Phaser.Input.Keyboard.JustDown(keyboardInputC.C)) {
            throwBall();
        }


        if (Phaser.Input.Keyboard.JustDown(keyboardInputQ.Q)) {
            clearLeaderboard();
        }

    }
}

function deadlyTileHit(sprite, tile) {

    this.physics.pause();

    timedEvent.destroy();

    player.setTint(0xff0000);

    player.anims.play('turn');

    // "New "Game" Button
    gameOverText = this.add.text(300, 300, 'GAME OVER',
        {
            font: "18px monospace",
            fill: "#000000",
            padding: { x: 20, y: 10 },
            backgroundColor: "#f00"
        })
        .setScrollFactor(0);

    gameOver = true;




}

function crossedFinishline() {

    if(starsRemaining === 0){

        this.physics.pause();

        timedEvent.destroy();

        player.setTint(0xff0000);

        player.anims.play('turn');

        recordTime();

        printTime(this);

        gameOver = true;
    } else{
        scoreText.setBackgroundColor('#f00');
        this.time.addEvent({delay: 500, callback: ()=> {scoreText.setBackgroundColor('#fff')} });

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
    starsRemaining -=1;
    scoreText.setText('Stars Remaining: ' + starsRemaining);

    /*
    if (stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });
     */
}

        //make 2 bombs//
        const numberOfBombsSpawned = 2;
        for (var i = 0; i < numberOfBombsSpawned; i++) {
            var x =  Phaser.Math.Between(0, 2080);
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.body.setCircle(7);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }
const getWinners = () => {
    let timeArrayAssetsShowcase = JSON.parse(localStorage.getItem("timeArrayAssetsShowcase"));
    let random =Phaser.Math.Between(1, timeArrayAssetsShowcase.length -1);

    console.log("BEST TIME WINNER:");
    console.log(timeArrayAssetsShowcase[0]);
    console.log("RANDOM WINNER:");
    console.log(timeArrayAssetsShowcase[random]);

}

const clearLeaderboard = () =>{
    let timeArrayAssetsShowcase = JSON.parse(localStorage.getItem("timeArrayAssetsShowcase"));
    timeArrayAssetsShowcase = [];
    localStorage.setItem("timeArrayAssetsShowcase", JSON.stringify(timeArrayAssetsShowcase));

}

const recordTime = () => {
    let timeArrayAssetsShowcase = JSON.parse(localStorage.getItem("timeArrayAssetsShowcase"));

    if (timeArrayAssetsShowcase === null || timeArrayAssetsShowcase === undefined) {
        timeArrayAssetsShowcase = [];
    }

    const playerName = prompt("Bra jobba! Skriv inn fullt navn:");
    const playerPhone = prompt("Og telefonnummer:")

    const gameRecord = {
        player: playerName,
        playerTime: counter,
        playerPhone: playerPhone
    };

    timeArrayAssetsShowcase.push(gameRecord);

    timeArrayAssetsShowcase.sort(compareGameRecordsTime);

    localStorage.setItem("timeArrayAssetsShowcase", JSON.stringify(timeArrayAssetsShowcase));
};

const printTime = (context) => {
    //context er 'this' i parent


    let timeArrayAssetsShowcase = JSON.parse(localStorage.getItem("timeArrayAssetsShowcase"));



    if (timeArrayAssetsShowcase === null || timeArrayAssetsShowcase === undefined) {
        timeArrayAssetsShowcase = [];
    }

    leaderboard = context.add.text(300, 60, 'Leaderboard', { fontSize: '40px', fill: '#000' })
        .setScrollFactor(0);
    let yPos = 130;


    if(timeArrayAssetsShowcase.length > 15){
        timeArrayAssetsShowcase = timeArrayAssetsShowcase.slice(0,14);
    }

    timeArrayAssetsShowcase.forEach(function (gameRecord) {
        leaderboard = context.add.text(120, yPos, gameRecord.player + ': ', { fontSize: '32px', fill: '#000' })
            .setScrollFactor(0);
        leaderboard = context.add.text(600, yPos, gameRecord.playerTime + 'S', { fontSize: '32px', fill: '#000' })
            .setScrollFactor(0);
        yPos += 30;

        }
    );

    getWinners();
};

const compareGameRecordsTime = (a, b) => {
    if (a.playerTime < b.playerTime) {
        return -1;
    }
    if (a.playerTime > b.playerTime) {
        return 1;
    }
    return 0
};


function hitBomb(player, bomb) {
    this.physics.pause();

    timedEvent.destroy();

    player.setTint(0xff0000);

    player.anims.play('turn');

    // "New "Game" Button
    gameOverText = this.add.text(300, 300, 'GAME OVER',
        {
            font: "18px monospace",
            fill: "#000000",
            padding: { x: 20, y: 10 },
            backgroundColor: "#f00"
        })
        .setScrollFactor(0);

    gameOver = true;
}
