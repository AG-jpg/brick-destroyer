var ballx = 75;
var bally = 75;
var ballSpeedX = 5;
var ballSpeedY = 7;

const Brick_W = 80;
const Brick_H = 20;
const BrickGap = 2;
const BrickCols = 10;
const BrickRows = 14;
var BrickGrid = new Array(BrickCols * BrickRows);
var bricksleft = 0;

const paddleWidth=100;
const paddleThick=20;
const paddleEdge=60;
var paddleX = 400;

var canvas, canvasContext;

var mouseX = 0;
var mouseY = 0;

function updateMousePosition(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;

    paddleX = mouseX-paddleWidth/2;
}

//Brick reset
function BrickReset(){
    bricksleft = 0;

    for(var i= 3 * BrickCols; i<BrickCols * BrickRows; i++){
        BrickGrid[i] = true;
        bricksleft++;
    }//End of for
}//End of Brick Reset Function

window.onload = function () {

    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(updateAll, 1000 / framesPerSecond);

    canvas.addEventListener('mousemove', updateMousePosition);

    BrickReset();
    ballReset();
};

function updateAll() {
    moveAll();
    drawAll();
}

//Ball Reset
function ballReset(){
    ballx = canvas.width/2;
    bally = canvas.height/2;
}

function ballMove(){
    //Ball speed
    ballx += ballSpeedX;
    bally += ballSpeedY;

    //Ball bounce
    if (ballx < 0 && ballSpeedX < 0.0) {
        ballSpeedX *= -1;
    }

    if (ballx > canvas.width && ballSpeedX > 0.0) {
        ballSpeedX *= -1;
    }

    if (bally < 0 && ballSpeedY < 0.0) {
        ballSpeedY *= -1;
    }

    if (bally > canvas.height) {
        ballReset();
        BrickReset();
    }
}

function isBrickatRowCol(col, row){

    if(col >= 0 && col < BrickCols &&
        row >= 0 && row < BrickRows){
            var BrickIndexUnderCoord = rowColtoArrayIndex(col, row);
            return BrickGrid[BrickIndexUnderCoord];
        }else {
            return false;
        }
}

function ballBrickHandling(){
    var ballBrickCol = Math.floor (ballx / Brick_W);
    var ballBrickRow = Math.floor (bally / Brick_H);
    var BrickIndexUnderBall = rowColtoArrayIndex(ballBrickCol, ballBrickRow);

    if(ballBrickCol >= 0 && ballBrickCol < BrickCols &&
        ballBrickRow >= 0 && ballBrickRow < BrickRows){

            if(isBrickatRowCol (ballBrickCol, ballBrickRow )){
                BrickGrid[BrickIndexUnderBall] = false;
                bricksleft--;

                var prevBallX = ballx - ballSpeedX;
                var prevBallY = bally - ballSpeedY;
                var preBrickCol = Math.floor(prevBallX / Brick_W);
                var preBrickRow = Math.floor(prevBallY / Brick_H);
                
                var bothTestFailed = true;

                if(preBrickCol != ballBrickCol){
                    if(isBrickatRowCol(ballBrickCol, preBrickRow) == false){
                        ballSpeedX *= -1;
                        bothTestFailed = false;
                    }
                }

                if(preBrickRow != ballBrickRow){
                    if(isBrickatRowCol(ballBrickCol, preBrickRow) == false){
                        ballSpeedX *= -1;
                        bothTestFailed = false;
                    }
                }

                if(bothTestFailed){//Armpit case
                    ballSpeedX *= -1;
                    ballSpeedY *= -1;
                } 

            }//End of brick found
        }//End of valid col and row
}// End of ballBrickHandling func

function ballPaddleHandling(){
    var paddleTopY = canvas.height-paddleEdge;
    var paddleBottomY = paddleTopY+paddleThick;
    var paddleLeftX = paddleX;
    var paddleRightX = paddleLeftX + paddleWidth;

    if(bally > paddleTopY && 
        bally < paddleBottomY &&
        ballx > paddleLeftX && 
        ballx < paddleRightX){

            ballSpeedY *= -1;

            var centerX = paddleX + paddleWidth/2;
            var distCenterX = ballx - centerX;
            ballSpeedX = distCenterX * 0.35;

            if(bricksleft == 0){
                BrickReset();
            }//Out of brick
        }
}

function moveAll() {
    ballMove();
    ballBrickHandling();
    ballPaddleHandling();
}

function rowColtoArrayIndex(col, row){
    return col + BrickCols * row;
}

    //Draw Bricks
    function drawBricks(){

        for(var eachRow=0; eachRow<BrickRows; eachRow++){
            for(var eachCol=0; eachCol<BrickCols; eachCol++){

                var arrayIndex = rowColtoArrayIndex(eachCol, eachRow);

                if(BrickGrid[arrayIndex]){
                    colorRect(Brick_W*eachCol,Brick_H*eachRow, Brick_W-BrickGap, Brick_H-BrickGap, '#4d51c5')
                }//End of is this brick here

            }
        }//End of for each brick


    };//End of drawBrick Function

    //Drawing
    function drawAll() {
        colorRect(0, 0, canvas.width, canvas.height, 'black');
        colorCircle(ballx, bally, 10, 'white');
        colorRect(paddleX, canvas.height-paddleEdge, paddleWidth,paddleThick, 'white');

        drawBricks();
    };

    //Ball drawing
    function colorCircle(centerX, centerY, radius, fillcolor) {
        canvasContext.fillStyle = fillcolor;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        canvasContext.fill();
    }

    //Text Drawing
    function colorText(showWords, textX, textY, fillColor){
        canvasContext.fillStyle = fillColor;
        canvasContext.fillText(showWords, textY, textX);
    }

    //Canvas drawing
    function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillcolor) {
        canvasContext.fillStyle = fillcolor;
        canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
    };