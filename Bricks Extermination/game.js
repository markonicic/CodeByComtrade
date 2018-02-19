var canvas = document.getElementById("interface");
var context = interface.getContext("2d");

var ballX = interface.width / 2;
    ballY = interface.height - 80,
    ballRadius = 7,
    speedX = 5,
    speedY = -5,
    speedUp = 0.06,

    stickHeight = 15,
    stickWidth = 120,
    stickX = (interface.width - stickWidth) / 2,
    stickY = interface.height - stickHeight - 5,

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
    lives = 3,
    captionText = "20px Lucida Console",
    captionColor = "#fff",
    captionScore = "score: ",
    captionMain = "Bricks Extermination",
    captionLives = "lives: ",
    
    ballColor = "#fff",
    stickColor = "#0000FF",
    brickColorEven = "#ffbf00",
    brickColorOdd = "#2aa774";

  
var createBricks = function(brickColumns, brickRows) {
  var b = [];
  for (c = 0; c < brickColumns; ++c) {
    b[c] = [];
    for (r = 0; r < brickRows; ++r) {
      b[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
  return b;
}
var bricks = createBricks(brickColumns, brickRows);

var drawBall = function () {
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  context.fillStyle = ballColor;
  context.fill();
  context.closePath();
}

var drawStick = function () {
  context.beginPath();
  context.rect(stickX, stickY, stickWidth, stickHeight);
  context.fillStyle = stickColor;
  context.fill();
  context.closePath();
}

var drawBricks = function () {
  for (c = 0; c < brickColumns; ++c) {
    for (r = 0; r < brickRows; ++r) {
      if (bricks[c][r].status == 1) {
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft,
            brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        context.beginPath();
        context.rect(brickX, brickY, brickWidth, brickHeight);
        if (c % 2 != 0)
          context.fillStyle = brickColorEven;
        else
          context.fillStyle = brickColorOdd;
        context.fill();
        context.closePath();
      }
    }
  }
}

var level = function (count) {
  if (remain == count) {
    return;
  }
  remain = count;
  speedX = speedX >= 0 ? speedX + speedUp : speedX - speedUp;
  speedY = speedY >= 0 ? speedY + speedUp : speedY - speedUp;
  stickWidth -= 0.4;
}

var impactDetector = function () {
  for (c = 0; c < brickColumns; ++c) {
    for (r = 0; r < brickRows; ++r) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if ((ballX > b.x) && (ballX < (b.x + brickWidth)) && (ballY > b.y) && (ballY < b.y + brickHeight)) {
          speedY = -speedY;
          b.status = 0;
          score++;
          count--;
          level(count);
          if (count == 0) {
            clearInterval(drawInterval);
            alert("GREAT JOB CHAMPION, YOU WON !!!");
            document.location.reload();
          }
        }
      }
    }
  }
}

var drawScore = function () {
  context.font = captionText;
  context.fillStyle = captionColor;
  context.fillText(captionScore + score, 80, 20);
}

var drawLives = function () {
  context.font = captionText;
  context.fillStyle = captionColor;
  context.fillText(captionMain, 300, 20);
  context.fillText(captionLives + lives, 620, 20);
}

var ballMovement = function () {
  if ((ballY + speedY) < ballRadius) {
    speedY = -speedY;
  }
  else if ((ballY + speedY + 15) > (interface.height - ballRadius)) {
    if ((ballX >= stickX) && (ballX <= stickX + stickWidth)) {
      speedY = -speedY;
    }
    else {
      lives--;
      if (!lives) {
        clearInterval(drawInterval);
        alert("Sorry, no more lifes left...\nTry again!");
        document.location.reload();
      }
      else {
        ballX = interface.width / 2;
        ballY = interface.height - 20;
        remain = count;
        stickX = (interface.width - stickWidth) / 2;
      }
    }
  }
  else {
    ballY += speedY;
  }
  if ((ballX + speedX < ballRadius) || (ballX + speedX > interface.width - ballRadius)) {
    speedX = -speedX;
  }
  else {
    ballX += speedX;
  }
}

var draw = function () {
  context.clearRect(0, 0, interface.width, interface.height);
  drawBricks();
  drawStick();
  drawBall();
  ballMovement();
  impactDetector();
  drawScore();
  drawLives();
}

var mouseMoveHandler = function (e) {
  var relativeX = e.clientX - interface.offsetLeft;
  if ((relativeX > 0) && (relativeX < interface.width)) {
    if ((relativeX - stickWidth / 2 >= 0) && (relativeX - stickWidth / 2 <= interface.width - stickWidth))
      stickX = relativeX - stickWidth / 2;
  }
}

document.addEventListener("mousemove", mouseMoveHandler, false);

var drawInterval = setInterval(draw, 20);
