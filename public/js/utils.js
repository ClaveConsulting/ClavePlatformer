//TODO: Move basic functions here??

export function movePlayer(direction){

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

export function stopPlayer(direction) {
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

export function deadlyTileHit(sprite, tile) {

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

export function crossedFinishline() {

    this.physics.pause();

    timedEvent.destroy();

    player.setTint(0xff0000);

    player.anims.play('turn');

    recordTime();

    printTime(this);

    gameOver = true;
}

export function updateCounter() {
    counter = counter + 0.01;
}

export function printCounter() {
    counterText.setText('Time: ' + counter.toFixed(2) + 'S');
}

export function throwBall() {
    var ball = balls.create(player.x, player.y, 'ball');
    if (direction === 'right') {
        ball.setVelocity(1000, -200);
    }
    if (direction === 'left') {
        ball.setVelocity(-1000, -200);
    }
}

export function hitBombBall(bomb, ball) {
    bomb.disableBody(true, true);
    ball.disableBody(true, true);
}

export function collectStar(player, star) {
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

export const getWinners = () => {
    let timeArrayAssetsShowcase = JSON.parse(localStorage.getItem("timeArrayAssetsShowcase"));
    let random = Phaser.Math.Between(1, timeArrayAssetsShowcase.length - 1);

    console.log("BEST TIME WINNER:");
    console.log(timeArrayAssetsShowcase[0]);
    console.log("RANDOM WINNER:");
    console.log(timeArrayAssetsShowcase[random]);
}

export const clearLeaderboard = () => {
    let timeArrayAssetsShowcase = JSON.parse(localStorage.getItem("timeArrayAssetsShowcase"));
    timeArrayAssetsShowcase = [];
    localStorage.setItem("timeArrayAssetsShowcase", JSON.stringify(timeArrayAssetsShowcase));
}

export const recordTime = () => {
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

export const printTime = (context) => {
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

export const compareGameRecordsTime = (a, b) => {

    if (parseFloat(a.playerTime) < parseFloat(b.playerTime)) {
        return -1;
    }
    if (parseFloat(a.playerTime) > parseFloat(b.playerTime)) {
        return 1;
    }
    return 0
};

export function hitBomb(player, bomb) {
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

export function dump() {

    console.log(pad1._axes[0]);
    console.log(pad1._rawPad.axes[0]);

}