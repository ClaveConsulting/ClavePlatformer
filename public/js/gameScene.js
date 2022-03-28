//TODO Add import from utils 
import {deadlyTileHit, movePlayer, stopPlayer, crossedFinishline, updateCounter, printCounter, throwBallFromPlayer, collectStar, getWinners, printTime,updateBall} from './utils.js';

var player;
var stars;
var cursors;
var gameOver = false;
var keyboardInput;
var keyboardInputC;
var keyboardInputQ;
var spaceKey;
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
var starsCollected = 0;
var hiding;
var caves = [];
var insideCave = [];
var doubleJumpAvailable = true;
var jumping = false;
var throwing = false;
var scoreText;
var leaderboard;

const WALKSPEED = 500;
const JUMPSPEED = 600;
const MAXSPEED = 800;
const ACCELERATION = 1800;
const BALL_LIFE_SPAN = 2;
const MAX_NUMBER_OF_BALLS = 10;
const { Each } = Phaser.Utils.Array;


export default class gameScene  {

    constructor() {
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
        player.body.setMaxVelocity(MAXSPEED);
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

        foreground.setTileIndexCallback(deadlyTiles, (player,gameOverText) => deadlyTileHit(this, timedEvent, player, gameOverText, gameOver), this);

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




        // Controller inputs
        // Dualshock 4 BT  
        if (this.input.gamepad.total === 0)
        {
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
        this.physics.add.overlap(
            player, 
            stars, 
            (player,star) => {                
                starsCollected +=1;
                counter = counter -1;
                collectStar(player,star, starsCollected, scoreText, counterText, this)
            },
            null, 
            this
        );

        // See if ball overlaps with star
        //this.physics.add.overlap(balls, stars, collectStar, null, this);
        this.physics.add.overlap(
            balls, 
            stars, 
            (ball, star) => {                
                starsCollected +=1;
                counter = counter -1;
                collectStar(ball, star, starsCollected, scoreText, counterText, this)
            },
            null, 
            this
        );
        
        // Checks to see if player is at finishline
        this.physics.add.overlap(player, finishline, (player) => crossedFinishline(this,timedEvent,player,gameOver), null, this);

        this.physics.add.overlap(player, foreground);

        this.cameras.main.startFollow(player, true, 0.3, 0.3);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, true, true);

        this.physics.world.on('worldstep', worldStep, this);

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
            callback: () => {
                counter = counter + 0.01
            },
            callbackScope: this,
            loop: true
        });

        timedEvent2 = this.time.addEvent({
            delay: 100,
            callback: () => {
                counterText.setText('Time: ' + counter.toFixed(2) + 'S')
            },
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
            movePlayer(player,direction,WALKSPEED,ACCELERATION);
        }
        
        else if (cursors.right.isDown|| (pad && pad.right)) {
            direction = 'right';
            movePlayer(player, direction,WALKSPEED,ACCELERATION);
        } 

        else {
            stopPlayer(player, direction,ACCELERATION)   
        }

        if ((spaceKey.isDown || (pad && pad.A)) && player.body.blocked.down) {
            jumping = true;

            player.setVelocityY(-JUMPSPEED);
        } else if ((spaceKey.isDown || (pad && pad.A)) && doubleJumpAvailable && jumping == false) {
            doubleJumpAvailable = false;
            player.setVelocityY(-JUMPSPEED);
            jumping = true;
        }
        
        if (!spaceKey.isDown && !(pad && pad.A)){
            jumping = false;
        }


        if (player.body.blocked.down){
            doubleJumpAvailable = true;
        }

        if (Phaser.Input.Keyboard.JustDown(keyboardInput.H)) {
            printTime(this,leaderboard);
        }

        if ((Phaser.Input.Keyboard.JustDown(keyboardInputC.C) || (pad && pad.B)) && !throwing) {
            throwing = true;
            throwBallFromPlayer(BALL_LIFE_SPAN,balls,player,direction);
        }

        if (!(Phaser.Input.Keyboard.JustDown(keyboardInputC.C) || (pad && pad.B))) {
            throwing = false;
        }

        if (Phaser.Input.Keyboard.JustDown(keyboardInputQ.Q)) {
            //clearLeaderboard();
            getWinners();
        }


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


function worldStep(delta){
    Each(balls.getChildren(),updateBall,this,[delta]);
}