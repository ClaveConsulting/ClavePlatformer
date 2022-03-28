//TODO Add import from utils 
import {deadlyTileHit} from './utils.js';

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
var padB
var spaceKey;
var highScoreText;
var balls;
var direction = 'right';
var button;
var counterText;
var counter = 0;
var timedEvent;
var timedEvent2;
var finishline;
var numberOfStars = 0;
var deadlyTiles = [];
var walkspeed = 500;
var jumpspeed = 600;
var maxspeed = 800;
var acceleration = 1800;
var movementDirection;
var starsCollected = 0;
var hiding;
var caves = [];
var insideCave = [];
var doubleJumpAvailable = true;
var jumping = false;
var throwing = false;

const BALL_LIFE_SPAN = 2;
const MAX_NUMBER_OF_BALLS = 10;

const { Each } = Phaser.Utils.Array;


export default class gameScene  {

    constructor(pathToMap) {
        console.log(pathToMap)
        this.mapPath = pathToMap;
        this.pad = null;
    }

    // Placeholer preload() function. currently redefined when intheriting from gameScene
    // This is due to map.json import    
    preload() {        
        console.log(this.mapPath)
        this.load.tilemapTiledJSON('map', this.mapPath);
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

    create() {

        this.add.image(0, 0, 'sky');

        var map = this.make.tilemap({
            key: "map",
            tileWidth: 32,
            tileHeight: 32
        });
        var tileset = map.addTilesetImage('tileset', 'tileset');
        var background = map.createLayer('background', tileset, 0, 0);
        var ground = map.createLayer('ground', tileset, 0, 0);


        // Before you can use the collide function you need to set what tiles can collide
        map.setCollisionBetween(1, 10000, true, 'ground');

        // Add player to the game
        const spawnPoint = map.findObject("spawnpoints", obj => obj.name === "player");
        player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'dude');
        player.setCollideWorldBounds(true);
        player.onWorldBounds = true;
        player.setBounce(0.1);
        player.body.allowGravity;
        player.body.setGravityY(750);
        player.body.setMaxVelocity(maxspeed);
        player.setVelocityX(0);


        // Finding Caves
        map.getObjectLayer("spawnpoints").objects.forEach((object) =>{
           if(object.name === "cave"){
               caves.push(object);
               insideCave.push(false);
           }
        });

        // Adding stars to the game
        stars = this.physics.add.group();
        map.getObjectLayer("spawnpoints").objects.forEach((o) => {
            if(o.name === "star"){
                var star = stars.create(o.x, o.y, 'star');
                star.body.moves = false;
                numberOfStars += 1;
            }
        });

        stars.children.iterate(function (child) {
            child.body.setCircle(12);
            //child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Setting deadly tiles
        var foreground = map.createLayer('foreground', tileset, 0, 0);
        foreground.forEachTile((tile) => {
            if (tile.properties.deadly === true) {
                deadlyTiles.push(tile.index);
            }
        });
        foreground.setTileIndexCallback(deadlyTiles, deadlyTileHit, this);

        hiding = map.createLayer('hiding', tileset, 0, 0);

        // Player animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 4,
                end: 5
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {
                start: 2,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
        keyboardInput = this.input.keyboard.addKeys('H');
        keyboardInputC = this.input.keyboard.addKeys('C');
        keyboardInputQ = this.input.keyboard.addKeys('Q');
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        padB = this.input.gamepad.B;




        // Controller inputs
        // Dualshock 4 BT  
        if (this.input.gamepad.total === 0)
        {
            console.log('NO gamepad')
            var text = this.add.text(10, 10, 'Press any button on a connected Gamepad', { font: '16px Courier', fill: '#00ff00' });
    
            this.input.gamepad.once('connected', function (pad) {
    
                console.log('connected', pad.id);
    
                text.destroy();
    
            }, this);
        }

        
        // Balls
        balls = this.physics.add.group({
            name: 'balls',
            enable: false
        });

        balls.createMultiple({
            key: 'ball',
            quantity: MAX_NUMBER_OF_BALLS,
            active: false,
            visible: false
        });


        // Adding finishline at end of the map
        const finishPoint = map.findObject("spawnpoints", obj => obj.name === "finishline");
        finishline = this.physics.add.image(finishPoint.x, finishPoint.y, 'finishLine');

        //  The score
        scoreText = this.add.text(16, 16, 'Stars collected: ' + starsCollected, {
                font: "27px monospace",
                fill: "#000000",
                padding: {
                    x: 20,
                    y: 10
                },
                backgroundColor: "#ffffff"
            }).setScrollFactor(0);

        //  Collide the player and the stars with the ground
        this.physics.add.collider(finishline, ground);
        this.physics.add.collider(player, ground);
        this.physics.add.collider(stars, ground);
        this.physics.add.collider(balls, ground);


        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(player, stars, collectStar, null, this);

        // See if ball overlaps with star
        this.physics.add.overlap(balls, stars, collectStar, null, this);

        // Checks to see if player is at finishline
        this.physics.add.overlap(player, finishline, crossedFinishline, null, this);

        this.physics.add.overlap(player, foreground);

        this.cameras.main.startFollow(player, true, 0.3, 0.3);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, true);

        this.physics.world.on('worldstep', worldStep, this)

        // "New "Game" Button
        button = this.add.text(1000, 16, 'New Game', {
                font: "27px monospace",
                fill: "#000000",
                padding: {
                    x: 20,
                    y: 10
                },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0);

        button.setInteractive();
        button.on('pointerdown', () => {
            gameOver = false;
            counter = 0;
            numberOfStars = 0;
            starsCollected = 0;
            this.scene.restart();

        });
        button.on('pointerover', () => {
            button.setBackgroundColor("#0f0");
        });
        button.on('pointerout', () => {
            button.setBackgroundColor("#fff");
        });

        // TIMER
        counterText = this.add.text(400, 16, 'Time: 0', {
                font: "27px monospace",
                fill: "#000000",
                padding: {
                    x: 20,
                    y: 10
                },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0);

        timedEvent = this.time.addEvent({
            delay: 10,
            callback: updateCounter,
            callbackScope: this,
            loop: true
        });

        timedEvent2 = this.time.addEvent({
            delay: 100,
            callback: printCounter,
            callbackScope: this,
            loop: true
        });

    }

    update() {

        var pad = this.input.gamepad.pad1;


        if (gameOver) {
            return;
        }

        if (cursors.left.isDown || (pad && pad.left)) {
            direction = 'left';
            movePlayer(direction);
        }
        
        else if (cursors.right.isDown|| (pad && pad.right)) {
            direction = 'right';
            movePlayer(direction);
        } 

        else {
            stopPlayer(direction)   
        }

        if ((spaceKey.isDown || (pad && pad.A)) && player.body.blocked.down) {
            jumping = true;
            console.log("Jump")

            player.setVelocityY(-jumpspeed);
        } else if ((spaceKey.isDown || (pad && pad.A)) && doubleJumpAvailable && jumping == false) {
            console.log("Double Jump")
            doubleJumpAvailable = false;
            player.setVelocityY(-jumpspeed);
            jumping = true;
        }
        
        if (!spaceKey.isDown && !(pad && pad.A)){
            jumping = false;
        }


        if (player.body.blocked.down){
            doubleJumpAvailable = true;
        }

        if (Phaser.Input.Keyboard.JustDown(keyboardInput.H)) {
            printTime(this);
        }

        if ((Phaser.Input.Keyboard.JustDown(keyboardInputC.C) || (pad && pad.B)) && !throwing) {
            throwing = true;
            throwBallFromPlayer();
        }

        if (!(Phaser.Input.Keyboard.JustDown(keyboardInputC.C) || (pad && pad.B))) {
            throwing = false;
        }

        if (Phaser.Input.Keyboard.JustDown(keyboardInputQ.Q)) {
            //clearLeaderboard();
            getWinners();
        }




        // Update balls and removing old




        //Hiding and unhiding cave overlay
        var i = 0;
        caves.forEach((cave) => {
            if(player.x >= cave.x && player.x <= cave.x + cave.width && player.y >= cave.y && player.y <= cave.y + cave.height){
                i++;
            }
        })
        if(i > 0){
            hiding.alpha = 0;
        }else{
            hiding.alpha = 1;
        }
0
    }
}

//TODO Remove this from gameScene.js
    

function movePlayer(direction){

    if (direction == 'left'){
        movementDirection = -1;
    } else {
        movementDirection = 1;
    }

    if (Math.abs(player.body.velocity.x) < walkspeed) {
        
        if (Math.abs(player.body.velocity.x)<10){
            player.setVelocityX(10*movementDirection);
        }

        player.setAccelerationX(movementDirection * acceleration);
        
    }
    else if (player.body.velocity.x/movementDirection<0){

        player.setAccelerationX(movementDirection * 2 * acceleration)

    }

    else {
        player.setAccelerationX(0);
    }

    player.anims.play(direction, true);
}

function stopPlayer(direction) {
    if (direction == 'right' && player.body.velocity.x > 0){
        player.setAccelerationX(-2*acceleration);
    } else if (direction == 'left' && player.body.velocity.x < 0){
        player.setAccelerationX(2*acceleration);
    } else {
        player.setAccelerationX(0)
        player.setVelocityX(0);
        player.anims.stop();
    }
}

/*
function deadlyTileHit(sprite, tile) {

    this.physics.pause();

    timedEvent.destroy();

    player.setTint(0xff0000);

    player.anims.play('turn');

    // GAME OVER
    gameOverText = this.add.text(350, 300, 'GAME OVER', {
        font: "36px monospace",
        fill: "#000000",
        padding: {
            x: 100,
            y: 50
        },
        backgroundColor: "#f00"
    }).setScrollFactor(0);
    gameOver = true;
}
*/

function crossedFinishline() {

    this.physics.pause();

    timedEvent.destroy();

    player.setTint(0xff0000);

    player.anims.play('turn');

    recordTime();

    printTime(this);

    gameOver = true;
}

function updateCounter() {
    counter = counter + 0.01;
}

function printCounter() {
    counterText.setText('Time: ' + counter.toFixed(2) + 'S');
}



function hitBombBall(bomb, ball) {
    bomb.disableBody(true, true);
    ball.disableBody(true, true);
}

function collectStar(player, star) {
    star.disableBody(true, true);

    starsCollected +=1;
    counter = counter -1;

    //  Add and update the score
    scoreText.setText('Stars Collected: ' + starsCollected);
    counterText.setBackgroundColor('#FFBE2E');
    this.time.addEvent({
        delay: 500,
        callback: () => {
            counterText.setBackgroundColor('#fff');
        },
        callbackScope: this
    });
    /*
    if (stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
     */
}

const getWinners = () => {
    let timeArrayAssetsShowcase = JSON.parse(localStorage.getItem("timeArrayAssetsShowcase"));
    let random = Phaser.Math.Between(1, timeArrayAssetsShowcase.length - 1);

    console.log("BEST TIME WINNER:");
    console.log(timeArrayAssetsShowcase[0]);
    console.log("RANDOM WINNER:");
    console.log(timeArrayAssetsShowcase[random]);
}

const clearLeaderboard = () => {
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
        playerStars: starsCollected,
        playerTime: counter.toFixed(2),
        playerPhone: playerPhone
    };


    let previousAttempt = timeArrayAssetsShowcase.filter(object => (object.playerPhone == gameRecord.playerPhone));
    if (previousAttempt.length > 0){
        // Returns -1 if gameRecord have a lower score than previousAttempt
        if(compareGameRecordsTime(gameRecord, previousAttempt[0]) < 0){
            timeArrayAssetsShowcase[timeArrayAssetsShowcase.findIndex(object => (object == previousAttempt[0]))] = gameRecord;
        }
    }else{
        timeArrayAssetsShowcase.push(gameRecord);
    }

    timeArrayAssetsShowcase.sort(compareGameRecordsTime);

    localStorage.setItem("timeArrayAssetsShowcase", JSON.stringify(timeArrayAssetsShowcase));
};

const printTime = (context) => {
    //context er 'this' i parent
    let timeArrayAssetsShowcase = JSON.parse(localStorage.getItem("timeArrayAssetsShowcase"));

    if (timeArrayAssetsShowcase === null || timeArrayAssetsShowcase === undefined) {
        timeArrayAssetsShowcase = [];
    }

    leaderboard = context.add.text(400, 200, 'Leaderboard', {
            fontSize: '70px',
            fontStyle: 'bold',
            fill: '#000'
        }).setScrollFactor(0);
    let yPos = 300;

    if (timeArrayAssetsShowcase.length > 15) {
        timeArrayAssetsShowcase = timeArrayAssetsShowcase.slice(0, 14);
    }

    timeArrayAssetsShowcase.forEach(function (gameRecord) {
        leaderboard = context.add.text(350, yPos, gameRecord.player + ': ', {
                fontSize: '45px',
                fontStyle: 'bold',
                fill: '#000'
            })
            .setScrollFactor(0);
        leaderboard = context.add.text(900, yPos, gameRecord.playerTime , {
                fontSize: '45px',
                fontStyle: 'bold',
                fill: '#000'
            })
            .setScrollFactor(0);
        yPos += 40;
    });

};

const compareGameRecordsTime = (a, b) => {

    if (parseFloat(a.playerTime) < parseFloat(b.playerTime)) {
        return -1;
    }
    if (parseFloat(a.playerTime) > parseFloat(b.playerTime)) {
        return 1;
    }
    return 0
};

function hitBomb(player, bomb) {
    this.physics.pause();

    timedEvent.destroy();

    player.setTint(0xff0000);

    player.anims.play('turn');

    // GAME OVER
    gameOverText = this.add.text(350, 300, 'GAME OVER', {
        font: "36px monospace",
        fill: "#000000",
        padding: {
            x: 100,
            y: 50
        },
        backgroundColor: "#f00"
    }).setScrollFactor(0);
    gameOver = true;
}


function worldStep(delta){
    Each(balls.getChildren(),updateBall,this,[delta]);
}

function updateBall(ball,delta){
    ball.state -= delta;
    if (ball.state <= 0){
        ball.disableBody(true,true);
    }
}


function throwBallFromPlayer() {
    throwBallFromGroup(
      balls,
      player.x,
      player.y,
      BALL_LIFE_SPAN
    );
  }

function throwBallFromGroup(group, x, y, lifespan) {
    const ball = group.getFirstDead(false);
  
    if (ball) {
        if (direction === 'right') {
            
            var vx = 1000
            var vy = -200
        }
        if (direction === 'left') {
            
            var vx = -1000
            var vy = -200
        }
        throwBall(ball, x, y, vx, vy, lifespan);
    }
}
  
  function throwBall(ball, x, y, vx, vy, lifespan) {
    console.log({ball:ball})
    ball.enableBody(true, x, y, true, true);
    ball.setVelocity(vx, vy);
    ball.setState(lifespan);
    ball.setBounceX(0.5);
    ball.setBounceY(0.5);

}
  
/*
  function throwBall() {
    var ball = balls.create(player.x, player.y, 'ball');
    console.log(ball)
    if (direction === 'right') {
        ball.setVelocity(1000, -200);
    }
    if (direction === 'left') {
        ball.setVelocity(-1000, -200);
    }


    ball.setState(BALL_LIFE_SPAN);
}
*/