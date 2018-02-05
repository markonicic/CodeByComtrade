var canvas = document.getElementById("interface");
var contex = canvas.getContext("2d");

var ballX = canvas.width / 2;
    ballY = canvas.height - 80,
    ballRadius = 8, 
    speedX = 4,
    speedY = -4,

    stickHeight = 15,
    stickWidth = 120,
    stickX = (canvas.width - stickWidth) / 2,
    stickY = canvas.height - stickHeight - 2,

    brickRows = 7,
    brickColumns = 9, 
    brickWidth = 70,
    brickHeight = 20,
    brickPadding = 7,
    brickOffsetTop = 30,
    brickOffsetLeft = 60,

    count = brickRows * brickColumns,
    remain = count,

    score = 0,
    lives = 3;
 
var bricks = [];
for(c=0; c<brickColumns; ++c){
  bricks[c] = [];
  for(r=0; r<brickRows; ++r){
    bricks[c][r] = {x:0, y:0, status:1};
  }
}
 
var drawBall = function() { 
  contex.beginPath();
  contex.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
  contex.fillStyle = "#fff";
  contex.fill();
  contex.closePath();
}
 
var drawStick = function() { 
  contex.beginPath();
  contex.rect(stickX, stickY, stickWidth, stickHeight);
  contex.fillStyle = "#0000FF";
  contex.fill();
  contex.closePath(); 
}
 
var drawBricks = function() { 
  for(c=0; c<brickColumns; ++c) {
    for(r=0; r<brickRows; ++r) {
       if(bricks[c][r].status == 1) { 
         var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft,
             brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
         bricks[c][r].x = brickX;
         bricks[c][r].y = brickY;
         contex.beginPath();
         contex.rect(brickX, brickY, brickWidth, brickHeight);
         if(c%2 != 0)
           contex.fillStyle = "#ffbf00";
         else
           contex.fillStyle = "#2aa774";
         contex.fill();
         contex.closePath(); 
      }
    }
  } 
}

var collisionDetection = function() { 
  for(c=0; c<brickColumns; ++c) { 
    for(r=0; r<brickRows; ++r) { 
       var b = bricks[c][r]; 
       if(b.status == 1) { 
          if((ballX > b.x) && (ballX < (b.x + brickWidth)) && (ballY > b.y) && (ballY < b.y + brickHeight)) {
             speedY = -speedY;
             b.status = 0;
             score++;
             count--;
                  if(count == 0) {
                     alert("You WON!!! Good job champ!");
                     document.location.reload();
                  }
          } 
       } 
    } 
  } 
}
 
var drawScore = function() { 
   contex.font = "18px Arial";
   contex.fillStyle = "#fff";
   contex.fillText("score: "+score,40,20);
}
 
var drawLives = function() {
    contex.font = "18px Arial";
    contex.fillStyle = "#fff";
    contex.fillText("Bricks Extermination             lives: "+lives, canvas.width-310, 20);
}
 
var draw = function() { 
    contex.clearRect(0 , 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawStick();
    drawScore();
    drawLives(); 
    collisionDetection();
    if((ballY + speedY) < ballRadius)
      speedY = -speedY;
    else if((ballY + speedY) > (canvas.height - ballRadius)) { 
       if((ballX >= stickX) && (ballX <= stickX + stickWidth)){ 
          speedY = -speedY; 
       }
       else {
          lives--;
          if(!lives) {
            alert("Sorry, you've lost...\nTry again! :-)");
            document.location.reload(); 
          }
          else {
            ballX = canvas.width / 2;
            ballY = canvas.height - 20;
            remain = count;
            stickX = (canvas.width - stickWidth) / 2;
           }
      } 
    }
    else
      ballY += speedY; 
    if((ballX + speedX < ballRadius) || (ballX + speedX > canvas.width - ballRadius))
       speedX = -speedX;
    else
       ballX += speedX; 
    if(rightPressed && (stickX < canvas.width - stickWidth))
       stickX += 7;
    else if(leftPressed && (stickX > 0))
       stickX -= 7; 
}
 
var mouseMoveHandler = function(e) { 
  var relativeX = e.clientX - canvas.offsetLeft; 
  if((relativeX > 0) && (relativeX < canvas.width)) { 
     if((relativeX - stickWidth/2 >= 0) && (relativeX-stickWidth/2 <= canvas.width-stickWidth))
        stickX = relativeX - stickWidth/2; 
  } 
}

document.addEventListener("mousemove", mouseMoveHandler, false); 
 
setInterval(draw, 20);
