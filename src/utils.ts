import { Direction } from "./models/direction";
import { IPlayerInfo } from "./models/playerInfo";

let movementDirection;

export const { Each } = Phaser.Utils.Array;

export function movePlayer(
    player: Phaser.Physics.Arcade.Sprite,
    direction: Direction,
    speed: number,
    acceleration: number,
) {
    if (direction === Direction.Left) {
        movementDirection = -1;
    } else {
        movementDirection = 1;
    }

    if (Math.abs(player.body.velocity.x) < speed) {
        if (Math.abs(player.body.velocity.x) < 10) {
            player.setVelocityX(10 * movementDirection);
        }

        player.setAccelerationX(movementDirection * acceleration);
    } else if (player.body.velocity.x / movementDirection < 0) {
        player.setAccelerationX(movementDirection * 2 * acceleration);
    } else {
        player.setAccelerationX(0);
    }

    player.anims.play(direction, true);
}

export function stopPlayer(
    player: Phaser.Physics.Arcade.Sprite,
    direction: Direction,
    acceleration: number,
) {
    if (direction === Direction.Right && player.body.velocity.x > 0) {
        player.setAccelerationX(-2 * acceleration);
    } else if (direction === Direction.Left && player.body.velocity.x < 0) {
        player.setAccelerationX(2 * acceleration);
    } else {
        player.setAccelerationX(0);
        player.setVelocityX(0);
        player.anims.stop();
    }
}

export function deadlyTileHit(
    scene: Phaser.Scene,
    timedEvent: Phaser.Time.TimerEvent,
    player: Phaser.Physics.Arcade.Sprite,
) {
    scene.physics.pause();

    timedEvent.destroy();

    player.setTint(0xff0000);

    player.anims.stop();

    // GAME OVER
    scene.scene.pause();
    scene.scene.launch("death");
}

export function crossedFinishline(
    scene: Phaser.Scene,
    timedEvent: Phaser.Time.TimerEvent,
    player: Phaser.Physics.Arcade.Sprite,
    starsCollected: number,
    counter: number,
) {
    scene.physics.pause();
    timedEvent.destroy();

    player.setTint(0xff0000);
    player.anims.stop();

    scene.scene.pause();
    scene.scene.launch("finish", {time: counter, stars: starsCollected});
}

export function updateCounter(counter: number) {
    return (counter = counter + 0.01);
}

export function printCounter(
    counterText: Phaser.GameObjects.Text,
    counter: number,
) {
    counterText.setText("Time: " + counter.toFixed(2) + "S");
}

export function updateBall(ball: Phaser.Physics.Arcade.Sprite, delta: number) {
    (ball.state as number) -= delta;
    if (ball.state <= 0) {
        ball.disableBody(true, true);
    }
}

export function throwBallFromPlayer(
    ballLifeSpan: number,
    balls: Phaser.Physics.Arcade.Group,
    player: Phaser.Physics.Arcade.Sprite,
    direction: Direction,
) {
    throwBallFromGroup(balls, player.x, player.y, ballLifeSpan, direction);
}

function throwBallFromGroup(
    group: Phaser.Physics.Arcade.Group,
    x: number,
    y: number,
    lifespan: number,
    direction: Direction,
) {
    const ball = group.getFirstDead(false);
    let velocityX: number = 0;
    let velocityY: number = 0;
    if (ball) {
        if (direction === Direction.Right) {
            velocityX = 1000;
            velocityY = -200;
        }
        if (direction === Direction.Left) {
            velocityX = -1000;
            velocityY = -200;
        }
        throwBall(ball, x, y, velocityX, velocityY, lifespan);
    }
}

function throwBall(
    ball: Phaser.Physics.Arcade.Sprite,
    x: number,
    y: number,
    velocityX: number,
    velocityY: number,
    lifespan: number,
) {
    ball.enableBody(true, x, y, true, true);
    ball.setVelocity(velocityX, velocityY);
    ball.setState(lifespan);
    ball.setBounceX(0.5);
    ball.setBounceY(0.5);
}

export function collectStar(
    star: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    starsCollected: number,
    scoreText: Phaser.GameObjects.Text,
    counterText: Phaser.GameObjects.Text,
    scene: Phaser.Scene,
) {
    star.destroy();

    //  Add and update the score
    scoreText.setText("Stars Collected: " + starsCollected);
    counterText.setBackgroundColor("#FFBE2E");
    scene.time.addEvent({
        callback: () => {
            counterText.setBackgroundColor("#fff");
        },
        callbackScope: scene,
        delay: 500,
    });
}

export function playerIntersect(
    player: Phaser.Physics.Arcade.Sprite,
    mapLayer: Phaser.Tilemaps.TilemapLayer,
) {
    const playerTopRightCollideTile = mapLayer.getTileAtWorldXY(
        player.x + player.width / 2,
        player.y - player.height / 2,
        true,
    ).index;
    const playerTopLeftCollideTile = mapLayer.getTileAtWorldXY(
        player.x - player.width / 2,
        player.y - player.height / 2,
        true,
    ).index;

    // -1 compensating for pixel indexing in player
    const playerBottomRightCollideTile = mapLayer.getTileAtWorldXY(
        player.x + player.width / 2,
        player.y + player.height / 2 - 1,
        true,
    ).index;
    const playerBottomLeftCollideTile = mapLayer.getTileAtWorldXY(
        player.x - player.width / 2,
        player.y + player.height / 2 - 1,
        true,
    ).index;

    if (
        playerTopRightCollideTile > 0 ||
        playerTopLeftCollideTile > 0 ||
        playerBottomRightCollideTile > 0 ||
        playerBottomLeftCollideTile > 0
    ) {
        return true;
    } else {
        return false;
    }
}

export function playerStandingOnMapLayer(
    player: Phaser.Physics.Arcade.Sprite,
    mapLayer: Phaser.Tilemaps.TilemapLayer,
) {
    // +1 for getting pixel outside of player sprite
    const playerBottomRightCollideTile = mapLayer.getTileAtWorldXY(
        player.x + player.width / 2,
        player.y + player.height / 2 + 1,
        true,
    ).index;
    const playerBottomLeftCollideTile = mapLayer.getTileAtWorldXY(
        player.x - player.width / 2,
        player.y + player.height / 2 + 1,
        true,
    ).index;

    if (playerBottomRightCollideTile > 0 || playerBottomLeftCollideTile > 0) {
        return true;
    } else {
        return false;
    }
}

export const getWinners = () => {
    const timeArrayAssetsShowcase = getRecordTimeLocalStorage();
    const random = Phaser.Math.Between(1, timeArrayAssetsShowcase.length - 1);

    // tslint:disable-next-line: no-console
    console.log("BEST TIME WINNER:");
    // tslint:disable-next-line: no-console
    console.log(timeArrayAssetsShowcase[0]);
    // tslint:disable-next-line: no-console
    console.log("RANDOM WINNER:");
    // tslint:disable-next-line: no-console
    console.log(timeArrayAssetsShowcase[random]);
};

export const clearLeaderboard = () => {
    setRecordTimeLocalStorage([]);
};

interface IGameRecord {
    starsCollected: number;
    time: string;
    name?: string;
    phone?: string;
}

const TIME_ARRAY_ASSETS_SHOWCASE = "timeArrayAssetsShowcase";

const getRecordTimeLocalStorage = () => {
    const rawTimeArrayAssetsShowcase = localStorage.getItem(
        TIME_ARRAY_ASSETS_SHOWCASE,
    );
    return rawTimeArrayAssetsShowcase
        ? (JSON.parse(rawTimeArrayAssetsShowcase) as IGameRecord[])
        : [];
};

const setRecordTimeLocalStorage = (value: IGameRecord[]) => {
    localStorage.setItem(TIME_ARRAY_ASSETS_SHOWCASE, JSON.stringify(value));
};

export const recordTime = (starsCollected: number, counter: number, name: string, phone: string) => {
    const timeArrayAssetsShowcase = getRecordTimeLocalStorage();

    const gameRecord: IGameRecord = {
        name,
        phone,
        starsCollected,
        time: counter.toFixed(2),
    };

    const previousAttempts = timeArrayAssetsShowcase.filter((previousAttempt) =>
    !!previousAttempt.phone ? previousAttempt.phone === gameRecord.phone : false,
    );

    if (previousAttempts.length > 0) {
        // Returns -1 if gameRecord have a lower score than previousAttempt
        if (compareGameRecordsTime(gameRecord, previousAttempts[0]) < 0) {
            timeArrayAssetsShowcase[
                timeArrayAssetsShowcase.findIndex(
                    (object) => object === previousAttempts[0],
                )
            ] = gameRecord;
        }
    } else {
        timeArrayAssetsShowcase.push(gameRecord);
    }

    timeArrayAssetsShowcase.sort(compareGameRecordsTime);
    setRecordTimeLocalStorage(timeArrayAssetsShowcase);
};

export const printTime = (
    scene: Phaser.Scene,
) => {
    // context er 'this' i parent
    let timeArrayAssetsShowcase = getRecordTimeLocalStorage();

    scene.add
        .text(400, 200, "Leaderboard", {
            color: "rgb(0,255,0)",
            fontSize: "70px",
            fontStyle: "bold",
        })
        .setScrollFactor(0);
    let yPos = 300;

    if (timeArrayAssetsShowcase.length > 10) {
        timeArrayAssetsShowcase = timeArrayAssetsShowcase.slice(0, 9);
    }

    timeArrayAssetsShowcase.forEach((gameRecord) => {
        scene.add
            .text(350, yPos, gameRecord.name ?? "--" + ": ", {
                color: "#000",
                fontSize: "45px",
                fontStyle: "bold",
            })
            .setScrollFactor(0);
        scene.add
        .text(900, yPos, gameRecord.time, {
                color: "#000",
                fontSize: "45px",
                fontStyle: "bold",
            })
            .setScrollFactor(0);
        yPos += 40;
    });
};

export const compareGameRecordsTime = (a: IGameRecord, b: IGameRecord) => {
    if (parseFloat(a.time) < parseFloat(b.time)) {
        return -1;
    }
    if (parseFloat(a.time) > parseFloat(b.time)) {
        return 1;
    }
    return 0;
};

export function newButton(
    scene: Phaser.Scene,
    buttonText: string,
    func: () => void,
    posX: number,
    posY: number,
    buttonStyle: Phaser.Types.GameObjects.Text.TextStyle,
    ) {

    const button = scene.add.text(posX, posY, buttonText, buttonStyle).setScrollFactor(0);
    button.setX(button.x - button.width / 2);
    button.setY(button.y - button.height / 2);
    button.setInteractive();
    button.on("pointerdown", func);

    button.on("pointerover", () => {
        button.setBackgroundColor("#0f0");
    });
    button.on("pointerout", () => {
        button.setBackgroundColor("#fff");
    });
    return button;
}

export const BUTTON_STYLE = {
    backgroundColor: "#ffffff",
    fill: "#000000",
    font: "27px monospace",
    padding: {
        x: 20,
        y: 10,
    },
};

export const GAME_OVER_TEXT_STYLE = {
    backgroundColor: "#ff0000",
    fill: "#000000",
    font: "64px monospace",
    padding: {
        x: 20,
        y: 10,
    },
};

export const FINISH_TEXT_STYLE = {
    backgroundColor: "#00ff00",
    fill: "#000000",
    font: "64px monospace",
    padding: {
        x: 20,
        y: 10,
    },
};
