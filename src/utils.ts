import { Direction } from "./models/direction";

let movementDirection;

export const { Each } = Phaser.Utils.Array;

export function movePlayer(
  player: Phaser.Physics.Arcade.Sprite,
  direction: Direction,
  speed: number,
  acceleration: number
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
  acceleration: number
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
  player: Phaser.Physics.Arcade.Sprite
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
  counter: number
) {
  scene.physics.pause();
  timedEvent.destroy();

  player.setTint(0xff0000);
  player.anims.stop();

  scene.scene.pause();
  scene.scene.launch("finish", { time: counter, stars: starsCollected });
}

export function updateCounter(counter: number) {
  return (counter = counter + 0.01);
}

export function printCounter(
  counterText: Phaser.GameObjects.Text,
  counter: number
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
  direction: Direction
) {
  throwBallFromGroup(balls, player.x, player.y, ballLifeSpan, direction);
}

function throwBallFromGroup(
  group: Phaser.Physics.Arcade.Group,
  x: number,
  y: number,
  lifespan: number,
  direction: Direction
) {
  const ball = group.getFirstDead(false);
  let velocityX = 0;
  let velocityY = 0;
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
  lifespan: number
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
  scene: Phaser.Scene
) {
  star.destroy();

  //  Add and update the score
  scoreText.setText("Stars Collected: " + starsCollected);
  counterText.setBackgroundColor(YELLOW);
  scene.time.addEvent({
    callback: () => {
      counterText.setBackgroundColor(WHITE);
    },
    callbackScope: scene,
    delay: 500,
  });
}

export function playerIntersect(
  player: Phaser.Physics.Arcade.Sprite,
  mapLayer: Phaser.Tilemaps.TilemapLayer
) {
  const playerTopRightCollideTile = mapLayer.getTileAtWorldXY(
    player.x + player.width / 2 - 1,
    player.y - player.height / 2,
    true
  ).index;
  const playerTopLeftCollideTile = mapLayer.getTileAtWorldXY(
    player.x - player.width / 2,
    player.y - player.height / 2,
    true
  ).index;

  // -1 compensating for pixel indexing in player
  const playerBottomRightCollideTile = mapLayer.getTileAtWorldXY(
    player.x + player.width / 2 - 1,
    player.y + player.height / 2 - 1,
    true
  ).index;
  const playerBottomLeftCollideTile = mapLayer.getTileAtWorldXY(
    player.x - player.width / 2,
    player.y + player.height / 2 - 1,
    true
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
  mapLayer: Phaser.Tilemaps.TilemapLayer
) {
  // +1 for getting pixel outside of player sprite
  const playerBottomRightCollideTile = mapLayer.getTileAtWorldXY(
    player.x + player.width / 2 - 1,
    player.y + player.height / 2 + 1,
    true
  ).index;
  const playerBottomLeftCollideTile = mapLayer.getTileAtWorldXY(
    player.x - player.width / 2,
    player.y + player.height / 2 + 1,
    true
  ).index;

  if (playerBottomRightCollideTile > 0 || playerBottomLeftCollideTile > 0) {
    return true;
  } else {
    return false;
  }
}

export const getWinners = (map: string) => {
  const timeArrayAssetsShowcase = getRecordTimeLocalStorage(map);
  const random = Phaser.Math.Between(1, timeArrayAssetsShowcase.length - 1);

  // eslint-disable-next-line no-console
  console.log("BEST TIME WINNER:");
  // eslint-disable-next-line no-console
  console.log(timeArrayAssetsShowcase[0]);
  // eslint-disable-next-line no-console
  console.log("RANDOM WINNER:");
  // eslint-disable-next-line no-console
  console.log(
    timeArrayAssetsShowcase[random] ??
      "Need at least one more player to determine random winnner"
  );
};

export const clearLeaderboard = () => {
  setRecordTimeLocalStorage([]);
};

interface IGameRecord {
  starsCollected: number;
  time: string;
  name?: string;
  phone?: string;
  map?: string;
}

const TIME_ARRAY_ASSETS_SHOWCASE = "timeArrayAssetsShowcase";
const LEVEL_SELECT_STORAGE_KEY = "LEVEL_SELECT";

export const getRecordTimeLocalStorage = (map: string) => {
  const rawTimeArrayAssetsShowcase = localStorage.getItem(
    `${TIME_ARRAY_ASSETS_SHOWCASE}_${map}`
  );
  return rawTimeArrayAssetsShowcase
    ? (JSON.parse(rawTimeArrayAssetsShowcase) as IGameRecord[])
    : [];
};

export const getSelectedLevel = () =>
  sessionStorage.getItem(LEVEL_SELECT_STORAGE_KEY);

const setRecordTimeLocalStorage = (value: IGameRecord[]) => {
  const selectedLevel = getSelectedLevel();
  localStorage.setItem(
    `${TIME_ARRAY_ASSETS_SHOWCASE}_${selectedLevel ?? "unknown"}`,
    JSON.stringify(value)
  );
};

export const setSelectedLevel = (value: string) => {
  sessionStorage.setItem(LEVEL_SELECT_STORAGE_KEY, value);
};

export const recordTime = (
  starsCollected: number,
  counter: number,
  name: string,
  phone: string,
  map: string
) => {
  const timeArrayAssetsShowcase = getRecordTimeLocalStorage(map);

  const gameRecord: IGameRecord = {
    name,
    phone,
    starsCollected,
    time: counter.toFixed(2),
    map,
  };

  const previousAttempts = timeArrayAssetsShowcase.filter((previousAttempt) =>
    !!previousAttempt.phone ? previousAttempt.phone === gameRecord.phone : false
  );

  if (previousAttempts.length > 0) {
    // Returns -1 if gameRecord have a lower score than previousAttempt
    if (compareGameRecordsTime(gameRecord, previousAttempts[0]) < 0) {
      timeArrayAssetsShowcase[
        timeArrayAssetsShowcase.findIndex(
          (object) => object === previousAttempts[0]
        )
      ] = gameRecord;
    }
  } else {
    timeArrayAssetsShowcase.push(gameRecord);
  }

  timeArrayAssetsShowcase.sort(compareGameRecordsTime);
  setRecordTimeLocalStorage(timeArrayAssetsShowcase);
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

export const GREEN = "#00ff00";
export const GREEN_NUMBER = 0x00ff00;
export const WHITE = "#ffffff";
export const WHITE_NUMBER = 0xffffff;
export const BLACK_NUMBER = 0x000000;
export const PALE_GREEN_NUMBER = 0xb1bd9b;
export const RED = "#ff0000";
export const BLACK = "#000";
export const YELLOW = "#FFBE2E";
export const TRANSPARENT = "rgba(0,0,0,0)";
export const GREY = "#555";

export const BUTTON_STYLE = {
  backgroundColor: WHITE,
  fill: BLACK,
  fontSize: "50px ",
  fontFamily: "Press2p",
  padding: {
    x: 20,
    y: 10,
  },
};

export const GAME_OVER_TEXT_STYLE = {
  fontSize: "30px",
  fontFamily: "Press2p",
  padding: {
    x: 20,
    y: 10,
  },
};

export const FINISH_TEXT_STYLE = {
  backgroundColor: GREEN,
  fill: BLACK,
  fontSize: "35px",
  fontFamily: "Press2p",
  padding: {
    x: 20,
    y: 10,
  },
};

export const INFO_TEXT_STYLE = {
  backgroundColor: TRANSPARENT,
  fill: WHITE,
  font: "15px",
  fontFamily: "Press2p",
  padding: {
    x: 20,
    y: 10,
  },
};

export const LEVEL_HEADER_STYLE = {
  backgroundColor: TRANSPARENT,
  fill: WHITE,
  fontSize: "40px",
  fontFamily: "Press2p",
};

export const PAUSE_TEXT_STYLE = {
  backgroundColor: TRANSPARENT,
  fill: WHITE,
  fontSize: "40px",
  fontFamily: "Press2p",
  padding: {
    x: 20,
    y: 10,
  },
};

export const BUTTON_SPACING = 75;

export const INDICATOR_OFFSET = 8;

const TRIANGLE_SCALE = 12;

export const TRIANGLE = {
  x1: 1 * TRIANGLE_SCALE,
  x2: -1 * TRIANGLE_SCALE,
  x3: -1 * TRIANGLE_SCALE,
  y1: 0 * TRIANGLE_SCALE,
  y2: -1 * TRIANGLE_SCALE,
  y3: 1 * TRIANGLE_SCALE,
};

export const LEADERBOARD_STYLE = {
  color: BLACK,
  fontFamily: "Press2p",
  fontSize: "20px",
};

export const LEADERBOARD_HIGHLIGHT_STYLE = {
  color: GREEN,
  fontSize: "20px",
  fontFamily: "Press2p",
  fontStyle: "bold",
};
