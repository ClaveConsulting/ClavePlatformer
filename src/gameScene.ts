import {
    collectStar,
    crossedFinishline,
    deadlyTileHit,
    getWinners,
    movePlayer,
    playerIntersect,
    playerStandingOnMapLayer,
    printTime,
    stopPlayer,
    throwBallFromPlayer,
    updateBall,
} from "./utils";

let player: Phaser.Physics.Arcade.Sprite;
let stars: Phaser.Physics.Arcade.Group;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let gameOver = false;
let keyboardInputH: Phaser.Input.Keyboard.Key;
let keyboardInputC: Phaser.Input.Keyboard.Key;
let keyboardInputQ: Phaser.Input.Keyboard.Key;
let spaceKey: Phaser.Input.Keyboard.Key;
let balls: Phaser.Physics.Arcade.Group;
let direction = "right";
let button: Phaser.GameObjects.Text;
let counterText: Phaser.GameObjects.Text;
let counter = 0;
let timedEvent: Phaser.Time.TimerEvent;
let timedEvent2: Phaser.Time.TimerEvent;
let finishline: Phaser.Physics.Arcade.Image;
let numberOfStars = 0;
const deadlyTiles: number[] = [];
let starsCollected = 0;
let hiding: Phaser.Tilemaps.TilemapLayer;
const caves: Phaser.Types.Tilemaps.TiledObject[] = [];
const insideCave: boolean[] = [];
let doubleJumpAvailable = true;
let jumping = false;
let throwing = false;
let scoreText: Phaser.GameObjects.Text;
let leaderboard: Phaser.GameObjects.Text;
let platformCollider: Phaser.Physics.Arcade.Collider;
const falling = false;
let playerHeadCollideTile;
let playerFootCollideTile;
let playerUnderFootTile;
let platforms: Phaser.Tilemaps.TilemapLayer;

const WALKSPEED = 500;
const JUMPSPEED = 600;
const MAXSPEED = 800;
const ACCELERATION = 1800;
const BALL_LIFE_SPAN = 2;
const MAX_NUMBER_OF_BALLS = 10;
const { Each } = Phaser.Utils.Array;

export class gameScene extends Phaser.Scene {

    public create() {
        this.add.image(0, 0, "sky");

        const map = this.make.tilemap({
            key: "map",
            tileWidth: 32,
            tileHeight: 32,
        });
        const tileset = map.addTilesetImage("tileset", "tileset");
        const background = map.createLayer("background", tileset, 0, 0);
        const ground = map.createLayer("ground", tileset, 0, 0);
        platforms = map.createLayer("platforms", tileset, 0, 0);

        // Before you can use the collide function you need to set what tiles can collide
        map.setCollisionBetween(1, 10000, true, false, "ground");
        map.setCollisionBetween(1, 10000, true, false, "platforms");

        // Add player to the game
        const spawnPoint = map.findObject(
            "spawnpoints",
            (obj) => obj.name === "player",
        );
        player = this.physics.add.sprite(spawnPoint.x!, spawnPoint.y!, "dude");
        player.setCollideWorldBounds(true);
        player.body;
        player.body.allowGravity;
        player.setGravityY(750);
        player.setMaxVelocity(MAXSPEED);
        player.setVelocityX(0);

        // Finding Caves
        map.getObjectLayer("spawnpoints").objects.forEach((object) => {
            if (object.name === "cave") {
                caves.push(object);
                insideCave.push(false);
            }
        });

        // Adding stars to the game
        stars = this.physics.add.group();
        map.getObjectLayer('spawnpoints').objects.forEach((o) => {
            if (o.name === 'star') {
                const star: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody =
                    stars.create(o.x, o.y, 'star');
                // Can't find fix for this error
                star.body.moves = false;
                numberOfStars += 1;
            }
        });

        // Setting deadly tiles
        const foreground = map.createLayer("foreground", tileset, 0, 0);
        foreground.forEachTile((tile) => {
            if (tile.properties.deadly === true) {
                deadlyTiles.push(tile.index);
            }
        });

        foreground.setTileIndexCallback(
            deadlyTiles,
            (player: Phaser.Physics.Arcade.Sprite, gameOverText: Phaser.GameObjects.Text) =>
                deadlyTileHit(this, timedEvent, player, gameOverText, gameOver),
            this,
        );

        hiding = map.createLayer("hiding", tileset, 0, 0);

        // Player animations
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 4,
                end: 5,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 2,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
        keyboardInputH = this.input.keyboard.addKey("H");
        keyboardInputC = this.input.keyboard.addKey("C");
        keyboardInputQ = this.input.keyboard.addKey("Q");
        spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE,
        );

        // Controller inputs
        if (this.input.gamepad.total === 0) {
            this.input.gamepad.once(
                "connected",
                function(pad: { id: number; }) {
                    console.log("connected", pad.id);
                },
                this,
            );
        }

        // Balls
        balls = this.physics.add.group({
            name: "balls",
            enable: false,
        });

        balls.createMultiple({
            key: "ball",
            quantity: MAX_NUMBER_OF_BALLS,
            active: false,
            visible: false,
        });

        // Adding finishline at end of the map
        const finishPoint = map.findObject(
            "spawnpoints",
            (obj) => obj.name === "finishline",
        );
        finishline = this.physics.add.image(
            finishPoint.x!,
            finishPoint.y!,
            "finishLine",
        );

        //  The score
        scoreText = this.add
            .text(16, 16, "Stars collected: " + starsCollected, {
                font: "27px monospace",
                color: "#000",
                padding: {
                    x: 20,
                    y: 10,
                },
                backgroundColor: "#ffffff",
            })
            .setScrollFactor(0);

        //  Colliders for ground
        this.physics.add.collider(finishline, ground);
        this.physics.add.collider(player, ground);
        this.physics.add.collider(stars, ground);
        this.physics.add.collider(balls, ground);

        // Colliders for platforms
        platformCollider = this.physics.add.collider(player, platforms);
        this.physics.add.collider(balls, platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(
            player,
            stars,
            (player, star) => {
                starsCollected += 1;
                counter = counter - 1;
                collectStar(
                    player,
                    star,
                    starsCollected,
                    scoreText,
                    counterText,
                    this,
                );
            },
            null!,
            this,
        );

        // See if ball overlaps with star
        this.physics.add.overlap(
            balls,
            stars,
            (ball, star) => {
                starsCollected += 1;
                counter = counter - 1;
                collectStar(
                    ball,
                    star,
                    starsCollected,
                    scoreText,
                    counterText,
                    this,
                );
            },
            null!,
            this,
        );

        // Checks to see if player is at finishline
        this.physics.add.overlap(
            player,
            finishline,
            (player) =>
                crossedFinishline(
                    this,
                    timedEvent,
                    player,
                    gameOver,
                    leaderboard,
                    starsCollected,
                    counter,
                ),
            null!,
            this,
        );

        this.physics.add.overlap(player, foreground);

        this.cameras.main.startFollow(player, true, 0.3, 0.3);
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels,
        );
        this.physics.world.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels,
            true,
            true,
            true,
            true,
        );

        this.physics.world.on("worldstep", worldStep, this);

        // "New "Game" Button
        button = this.add
            .text(1000, 16, "New Game", {
                font: "27px monospace",
                color: "#000000",
                padding: {
                    x: 20,
                    y: 10,
                },
                backgroundColor: "#ffffff",
            })
            .setScrollFactor(0);

        button.setInteractive();
        button.on("pointerdown", () => {
            gameOver = false;
            counter = 0;
            numberOfStars = 0;
            starsCollected = 0;
            this.scene.restart();
        });
        button.on("pointerover", () => {
            button.setBackgroundColor("#0f0");
        });
        button.on("pointerout", () => {
            button.setBackgroundColor("#fff");
        });

        // TIMER
        counterText = this.add
            .text(400, 16, "Time: 0", {
                font: "27px monospace",
                color: "#000000",
                padding: {
                    x: 20,
                    y: 10,
                },
                backgroundColor: "#ffffff",
            })
            .setScrollFactor(0);

        timedEvent = this.time.addEvent({
            delay: 10,
            callback: () => {
                counter = counter + 0.01;
            },
            callbackScope: this,
            loop: true,
        });

        timedEvent2 = this.time.addEvent({
            delay: 100,
            callback: () => {
                counterText.setText("Time: " + counter.toFixed(2) + "S");
            },
            callbackScope: this,
            loop: true,
        });
    }

    public update() {
        // init gamepad
        const pad = this.input.gamepad.pad1;

        // gameover
        if (gameOver) {
            return;
        }

        // Movement logic
        if (cursors.left.isDown || (pad && pad.left)) {
            direction = "left";
            movePlayer(player, direction, WALKSPEED, ACCELERATION);
        } else if (cursors.right.isDown || (pad && pad.right)) {
            direction = "right";
            movePlayer(player, direction, WALKSPEED, ACCELERATION);
        } else {
            stopPlayer(player, direction, ACCELERATION);
        }

        // Jumping logic
        if (spaceKey.isDown || (pad && pad.B)) {
            if (player.body.blocked.down) {
                jumping = true;
                player.setVelocityY(-JUMPSPEED);
            } else if (doubleJumpAvailable && jumping == false) {
                doubleJumpAvailable = false;
                player.setVelocityY(-JUMPSPEED);
                jumping = true;
            }
        } else if (!spaceKey.isDown && !(pad && pad.B)) {
            jumping = false;
        }

        if (player.body.blocked.down) {
            doubleJumpAvailable = true;
        }

        // Platform logic

        if (player.body.velocity.y < 0 || playerIntersect(player, platforms)) {
            platformCollider.active = false;
        } else if (
            playerStandingOnMapLayer(player, platforms) &&
            (cursors.down.isDown || (pad && pad.down))
        ) {
            platformCollider.active = false;
        } else {
            platformCollider.active = true;
        }

        // Throwing ball logic
        if (
            (Phaser.Input.Keyboard.JustDown(keyboardInputC) ||
                (pad && pad.Y)) &&
            !throwing
        ) {
            throwing = true;
            throwBallFromPlayer(BALL_LIFE_SPAN, balls, player, direction);
        }

        if (
            !(
                Phaser.Input.Keyboard.JustDown(keyboardInputC) ||
                (pad && pad.Y)
            )
        ) {
            throwing = false;
        }

        // leaderboard
        if (Phaser.Input.Keyboard.JustDown(keyboardInputH)) {
            printTime(this, leaderboard);
        }

        if (Phaser.Input.Keyboard.JustDown(keyboardInputQ)) {
            getWinners();
        }

        // Hiding and unhiding cave overlay
        let i = 0;
        caves.forEach((cave) => {
            if (
                player.x >= cave.x! &&
                player.x <= cave.x! + cave.width! &&
                player.y >= cave.y! &&
                player.y <= cave.y! + cave.height!
            ) {
                i++;
            }
        });
        if (i > 0) {
            hiding.alpha = 0;
        } else {
            hiding.alpha = 1;
        }
    }
}

function worldStep(delta: number) {
    Each(balls.getChildren(), updateBall, this, [delta]);
}
