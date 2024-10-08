import { NES_Button } from "./buttonMap";
import { Direction } from "./models/direction";
import { MenuButton } from "./models/navMenu";
import {
    BLACK,
    BLACK_NUMBER,
    collectStar,
    crossedFinishline,
    deadlyTileHit,
    getSelectedLevel,
    getWinners,
    movePlayer,
    playerIntersect,
    playerStandingOnMapLayer,
    stopPlayer,
    throwBallFromPlayer,
    updateBall,
    WHITE,
} from "./utils";

let player: Phaser.Physics.Arcade.Sprite;
let stars: Phaser.Physics.Arcade.Group;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys;

let keyboardInputC: Phaser.Input.Keyboard.Key;
let keyboardInputQ: Phaser.Input.Keyboard.Key;
let spaceKey: Phaser.Input.Keyboard.Key;

let balls: Phaser.Physics.Arcade.Group;
let direction = Direction.Right;
let counterText: Phaser.GameObjects.Text;
let counter = 0;
let timedEvent: Phaser.Time.TimerEvent;
let finishline: Phaser.Physics.Arcade.Image;
let starsCollected = 0;
let hiding: Phaser.Tilemaps.TilemapLayer;
let doubleJumpAvailable = true;
let jumping = false;
let throwing = false;
let scoreText: Phaser.GameObjects.Text;
let platformCollider: Phaser.Physics.Arcade.Collider;
let platforms: Phaser.Tilemaps.TilemapLayer;

const insideCave: boolean[] = [];
const caves: Phaser.Types.Tilemaps.TiledObject[] = [];
const deadlyTiles: number[] = [];
const { Each } = Phaser.Utils.Array;

const windowWidth = window.innerWidth;

const WALKSPEED = 500;
const JUMPSPEED = 600;
const MAXSPEED = 800;
const ACCELERATION = 1800;
const BALL_LIFE_SPAN = 2;
const MAX_NUMBER_OF_BALLS = 10;

export class GameScene extends Phaser.Scene {
    private fromLeaderboard = false;

    constructor(config: Phaser.Types.Scenes.SettingsConfig) {
        super(config);
    }

    public init(data: { fromLeaderboard: boolean }) {
        this.fromLeaderboard = data.fromLeaderboard;
    }

    public create() {
        counter = 0;
        starsCollected = 0;

        this.add.image(0, 0, "sky");

        const map = this.make.tilemap({
            key: "map",
            tileHeight: 32,
            tileWidth: 32,
        });
        const tileset = map.addTilesetImage("tileset", "tileset");
        map.createLayer("background", tileset, 0, 0);
        const ground = map.createLayer("ground", tileset, 0, 0);
        platforms = map.createLayer("platforms", tileset, 0, 0);

        // Before you can use the collide function you need to set what tiles can collide
        map.setCollisionBetween(1, 10000, true, false, "ground");
        map.setCollisionBetween(1, 10000, true, false, "platforms");

        // Add player to the game
        const spawnPoint = map.findObject(
            "spawnpoints",
            (obj) => obj.name === "player"
        );
        player = this.physics.add.sprite(spawnPoint.x!, spawnPoint.y!, "dude");
        player.setCollideWorldBounds(true);
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
        map.getObjectLayer("spawnpoints").objects.forEach((o) => {
            if (o.name === "star") {
                const star: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody =
                    stars.create(o.x, o.y, "star");
                // Can't find fix for this error
                star.body.moves = false;
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
            () => {
                deadlyTileHit(this, timedEvent, player);
                this.scene.pause();
                this.scene.launch("death");
            },
            this
        );

        hiding = map.createLayer("hiding", tileset, 0, 0);
        hiding.setDepth(10);

        // Player animations
        this.anims.create({
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("dude", {
                end: 5,
                start: 4,
            }),
            key: Direction.Left,
            repeat: -1,
        });

        this.anims.create({
            frameRate: 10,
            frames: this.anims.generateFrameNumbers("dude", {
                end: 3,
                start: 2,
            }),
            key: Direction.Right,
            repeat: -1,
        });

        //  Input Events
        cursors = this.input.keyboard.createCursorKeys();
        keyboardInputC = this.input.keyboard.addKey("C", false);
        keyboardInputC.emitOnRepeat = false;
        keyboardInputQ = this.input.keyboard.addKey("Q", false);
        spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE,
            false
        );

        // Balls
        balls = this.physics.add.group({
            enable: false,
            name: "balls",
        });

        balls.createMultiple({
            active: false,
            key: "ball",
            quantity: MAX_NUMBER_OF_BALLS,
            visible: false,
        });

        // Adding finishline at end of the map
        const finishPoint = map.findObject(
            "spawnpoints",
            (obj) => obj.name === "finishline"
        );
        finishline = this.physics.add.image(
            finishPoint.x!,
            finishPoint.y!,
            "finishLine"
        );

        //  The score
        scoreText = this.add
            .text(16, 16, `Stars collected: ${starsCollected}`, {
                backgroundColor: WHITE,
                color: BLACK,
                fontSize: "27px",
                fontFamily: "Press2p",
                padding: {
                    x: 20,
                    y: 10,
                },
            })
            .setScrollFactor(0);
        const scoreFrame = this.add
            .rectangle(
                scoreText.getCenter().x,
                scoreText.getCenter().y,
                scoreText.width,
                scoreText.height
            )
            .setScrollFactor(0)
            .setStrokeStyle(5, BLACK_NUMBER);

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
            (_, star) => {
                starsCollected += 1;
                counter -= 0.5;
                collectStar(star, starsCollected, scoreText, counterText, this);
                scoreFrame.setSize(scoreText.width, scoreText.height);
            },
            null!,
            this
        );

        // See if ball overlaps with star
        this.physics.add.overlap(
            balls,
            stars,
            (_, star) => {
                starsCollected += 1;
                counter -= 1;
                collectStar(star, starsCollected, scoreText, counterText, this);
            },
            null!,
            this
        );

        // Checks to see if player is at finishline
        this.physics.add.overlap(
            player,
            finishline,
            () => {
                crossedFinishline(
                    this,
                    timedEvent,
                    player,
                    starsCollected,
                    counter
                );
            },
            null!,
            this
        );

        this.physics.add.overlap(player, foreground);

        this.cameras.main.startFollow(player, true, 0.3, 0.3);
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.physics.world.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels,
            true,
            true,
            true,
            true
        );

        this.physics.world.on("worldstep", worldStep, this);

        new MenuButton(
            windowWidth - 110,
            scoreText.y + scoreText.height / 2,
            "PAUSE",
            () => {
                this.scene.pause();
                this.scene.launch("pause");
            },
            this,
            NES_Button.START,
            Phaser.Input.Keyboard.KeyCodes.ESC
        );

        // TIMER
        counterText = this.add
            .text(600, 16, "Time: 0", {
                backgroundColor: WHITE,
                color: BLACK,
                fontSize: "27px",
                fontFamily: "Press2p",
                padding: {
                    x: 20,
                    y: 10,
                },
            })
            .setScrollFactor(0);
        const counterFrame = this.add
            .rectangle(
                counterText.getCenter().x,
                counterText.getCenter().y,
                counterText.width,
                counterText.height
            )
            .setStrokeStyle(5, BLACK_NUMBER)
            .setScrollFactor(0);

        timedEvent = this.time.addEvent({
            callback: () => {
                counter += 0.01;
            },
            callbackScope: this,
            delay: 10,
            loop: true,
        });

        this.time.addEvent({
            callback: () => {
                counterText.setText(`Time: ${counter.toFixed(2)}S`);
                counterFrame.setSize(counterText.width, counterText.height);
            },
            callbackScope: this,
            delay: 100,
            loop: true,
        });

        const selectedLevel = getSelectedLevel();
        if (!selectedLevel) {
            this.scene.setVisible(false);
            this.scene.start("levelSelect");
            this.scene.stop();
        }

        if (!this.fromLeaderboard) {
            this.scene.pause();
            this.scene.launch("leaderboard", { fromMenu: false });
        } else {
            this.scene.pause();
            this.scene.launch("countdown");
        }
    }

    public update() {
        // init gamepad
        const pad = this.input.gamepad.pad1;

        // Movement logic
        if (cursors.left.isDown || (pad && pad.left)) {
            direction = Direction.Left;
            movePlayer(player, direction, WALKSPEED, ACCELERATION);
        } else if (cursors.right.isDown || (pad && pad.right)) {
            direction = Direction.Right;
            movePlayer(player, direction, WALKSPEED, ACCELERATION);
        } else {
            stopPlayer(player, direction, ACCELERATION);
        }

        // Jumping logic
        if (spaceKey.isDown || (pad && pad.B)) {
            if (player.body.blocked.down) {
                jumping = true;
                player.setVelocityY(-JUMPSPEED);
            } else if (doubleJumpAvailable && jumping === false) {
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
        if ((keyboardInputC.isDown || (pad && pad.Y)) && !throwing) {
            throwing = true;
            throwBallFromPlayer(BALL_LIFE_SPAN, balls, player, direction);
        }
        if (!(keyboardInputC.isDown || (pad && pad.Y))) {
            throwing = false;
        }
        const selectedLevel = getSelectedLevel();
        if (!!selectedLevel && keyboardInputQ.isDown) {
            getWinners(selectedLevel);
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
