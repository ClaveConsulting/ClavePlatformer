var movementDirection;

export const { Each } = Phaser.Utils.Array;

export function movePlayer(player: Phaser.Physics.Arcade.Sprite ,direction: string ,speed: number ,acceleration: number){

    if (direction == 'left'){
        movementDirection = -1;
    } else {
        movementDirection = 1;
    }

    if (Math.abs(player.body.velocity.x) < speed) {
        
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

export function stopPlayer(player: Phaser.Physics.Arcade.Sprite, direction: string, acceleration: number) {
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

export function deadlyTileHit(scene: Phaser.Scene, timedEvent: Phaser.Time.TimerEvent, player: Phaser.Physics.Arcade.Sprite, gameOverText: Phaser.GameObjects.Text, gameOver: boolean) {

    scene.physics.pause();

    timedEvent.destroy();

    player.setTint(0xff0000);

    player.anims.stop();

    // GAME OVER
    gameOverText = scene.add.text(350, 300, 'GAME OVER', {
        font: "36px monospace",
        color: "#000000",
        padding: {
            x: 100,
            y: 50
        },
        backgroundColor: "#f00"
    }).setScrollFactor(0);
    gameOver = true;
}

export function crossedFinishline(scene: Phaser.Scene, timedEvent: Phaser.Time.TimerEvent, player: Phaser.Types.Physics.Arcade.GameObjectWithBody , gameOver: boolean ,leaderboard: Phaser.GameObjects.Text, starsCollected: number, counter: number) {

    scene.physics.pause();

    timedEvent.destroy();

    player.setTint(0xff0000);

    player.anims.stop();

    recordTime(starsCollected,counter);

    printTime(scene,leaderboard);

    gameOver = true;
}

export function updateCounter(counter: number) {
    return counter = counter + 0.01;
}

export function printCounter(counterText: Phaser.GameObjects.Text, counter: number) {
    console.log({})
    counterText.setText('Time: ' + counter.toFixed(2) + 'S');
}


export function updateBall(ball: Phaser.Physics.Arcade.Sprite ,delta: number){
    ball.state -= delta;
    if (ball.state <= 0){
        ball.disableBody(true,true);
    }
}

export function throwBallFromPlayer(ballLifeSpan: number, balls: Phaser.Physics.Arcade.Group, player: Phaser.Physics.Arcade.Sprite, direction: string) {
    throwBallFromGroup(
      balls,
      player.x,
      player.y,
      ballLifeSpan,
      direction
    );
  }

function throwBallFromGroup(group: Phaser.Physics.Arcade.Group, x: number, y: number, lifespan: number, direction: string) {
    const ball = group.getFirstDead(false);
    var vx: number = 0;
    var vy: number = 0;
    if (ball) {
        if (direction === 'right') {
            
            vx = 1000
            vy = -200
        }
        if (direction === 'left') {
            
            vx = -1000
            vy = -200
        }
        throwBall(ball, x, y, vx, vy, lifespan);
    }
}
  
function throwBall(ball: Phaser.Physics.Arcade.Sprite, x: number, y: number, vx: number, vy: number, lifespan: number) {
    ball.enableBody(true, x, y, true, true);
    ball.setVelocity(vx, vy);
    ball.setState(lifespan);
    ball.setBounceX(0.5);
    ball.setBounceY(0.5);

}

export function collectStar(object: any, star: Phaser.Types.Physics.Arcade.GameObjectWithBody, starsCollected: number, scoreText: Phaser.GameObjects.Text, counterText: Phaser.GameObjects.Text, scene: Phaser.Scene) {
    star.destroy();

    //  Add and update the score
    scoreText.setText('Stars Collected: ' + starsCollected);
    counterText.setBackgroundColor('#FFBE2E');
    scene.time.addEvent({
        delay: 500,
        callback: () => {
            counterText.setBackgroundColor('#fff');
        },
        callbackScope: scene
    });

}

export function playerIntersect(player: Phaser.Physics.Arcade.Sprite, mapLayer: Phaser.Tilemaps.TilemapLayer){
    var playerTopRightCollideTile = mapLayer.getTileAtWorldXY(player.x + player.width/2, player.y - player.height/2, true).index;
    var playerTopLeftCollideTile = mapLayer.getTileAtWorldXY(player.x -player.width/2, player.y - player.height/2, true).index;

    // -1 compensating for pixel indexing in player
    var playerBottomRightCollideTile = mapLayer.getTileAtWorldXY(player.x + player.width/2, player.y + player.height/2 -1, true).index;
    var playerBottomLeftCollideTile = mapLayer.getTileAtWorldXY(player.x -player.width/2, player.y + player.height/2 -1, true).index;
    
    if (
        playerTopRightCollideTile > 0 || 
        playerTopLeftCollideTile > 0 || 
        playerBottomRightCollideTile > 0 || 
        playerBottomLeftCollideTile > 0
        ){
        return true;
    } else {
        return false;
    }
}

export function playerStandingOnMapLayer(player: Phaser.Physics.Arcade.Sprite, mapLayer: Phaser.Tilemaps.TilemapLayer){
    // +1 for getting pixel outside of player sprite
    var playerBottomRightCollideTile = mapLayer.getTileAtWorldXY(player.x + player.width/2, player.y + player.height/2 + 1, true).index;
    var playerBottomLeftCollideTile = mapLayer.getTileAtWorldXY(player.x -player.width/2, player.y + player.height/2 + 1, true).index;

    if (
        playerBottomRightCollideTile > 0 || 
        playerBottomLeftCollideTile > 0
        ){
        return true;
    } else {
        return false;
    }

}

export const getWinners = () => {
    let timeArrayAssetsShowcase = JSON.parse(localStorage.getItem("timeArrayAssetsShowcase")!);
    let random = Phaser.Math.Between(1, timeArrayAssetsShowcase.length - 1);

    console.log("BEST TIME WINNER:");
    console.log(timeArrayAssetsShowcase[0]);
    console.log("RANDOM WINNER:");
    console.log(timeArrayAssetsShowcase[random]);
}

export const clearLeaderboard = () => {
    let timeArrayAssetsShowcase = JSON.parse(localStorage.getItem("timeArrayAssetsShowcase")!);
    timeArrayAssetsShowcase = [];
    localStorage.setItem("timeArrayAssetsShowcase", JSON.stringify(timeArrayAssetsShowcase));
};

export const recordTime = (starsCollected: number, counter: number) => {
    let timeArrayAssetsShowcase = JSON.parse(localStorage.getItem("timeArrayAssetsShowcase")!);

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


    let previousAttempt = timeArrayAssetsShowcase.filter((object) => (object.playerPhone == gameRecord.playerPhone));
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

export const printTime = (context: Phaser.Scene, leaderboard: Phaser.GameObjects.Text) => {
    //context er 'this' i parent
    let timeArrayAssetsShowcase = JSON.parse(localStorage.getItem("timeArrayAssetsShowcase")!);

    if (timeArrayAssetsShowcase === null || timeArrayAssetsShowcase === undefined) {
        timeArrayAssetsShowcase = [];
    }

    leaderboard = context.add.text(400, 200, 'Leaderboard', {
            fontSize: '70px',
            fontStyle: 'bold'
        }).setScrollFactor(0);
    let yPos = 300;

    if (timeArrayAssetsShowcase.length > 15) {
        timeArrayAssetsShowcase = timeArrayAssetsShowcase.slice(0, 14);
    }

    timeArrayAssetsShowcase.forEach(function (gameRecord) {
        leaderboard = context.add.text(350, yPos, gameRecord.player + ': ', {
                fontSize: '45px',
                fontStyle: 'bold',
                color: '#000'
            })
            .setScrollFactor(0);
        leaderboard = context.add.text(900, yPos, gameRecord.playerTime , {
                fontSize: '45px',
                fontStyle: 'bold',
                color: '#000'
            })
            .setScrollFactor(0);
        yPos += 40;
    });

};

export const compareGameRecordsTime = (a, b) => {

    if (parseFloat(a.playerTime) < parseFloat(b.playerTime)) {
        return -1;
    }
    if (parseFloat(a.playerTime) > parseFloat(b.playerTime)) {
        return 1;
    }
    return 0
};
