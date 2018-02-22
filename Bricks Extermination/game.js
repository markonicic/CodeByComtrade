var configStyle = {
  captionText: "20px Lucida Console",
  captionColor: "#fff",
  captionScore: "score: ",
  captionMain: "Bricks Extermination",
  captionLives: "lives: ",

  horizantalCoefficient: 2,
  ballYcoeficient: 80,
  ballRadius: 7,
  speedXY: 5,
  speedUp: 1,
  stickHeight: 15,
  stickWidth: 120,
  stickMarginBottom: 5,
  brickRows: 8,
  brickColumns: 9,
  brickWidth: 50,
  brickHeight: 20,
  brickPadding: 7,
  brickOffsetTop: 30,
  brickOffsetLeft: 30,

  ballColor: "#fff",
  stickColor: "#0000FF",
  brickColorEven: "#ffbf00",
  brickColorOdd: "#2aa774",
  brickRandomColor: function () {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
  }
};

var interface = document.getElementById("interface"),
  context = interface.getContext("2d"),

  ballX = interface.width / configStyle.horizantalCoefficient;
  ballY = interface.height - configStyle.ballYcoeficient,
  ballRadius = configStyle.ballRadius,
  speedX = configStyle.speedXY,
  speedY = -configStyle.speedXY,
  speedUp = configStyle.speedUp,

  stickHeight = configStyle.stickHeight,
  stickWidth = configStyle.stickWidth,
  stickX = (interface.width - stickWidth) / configStyle.horizantalCoefficient,
  stickY = interface.height - stickHeight - configStyle.stickMarginBottom,

  brickRows = configStyle.brickRows,
  brickColumns = configStyle.brickColumns,
  brickWidth = configStyle.brickWidth,
  brickHeight = configStyle.brickHeight,
  brickPadding = configStyle.brickPadding,
  brickOffsetTop = configStyle.brickOffsetTop,
  brickOffsetLeft = configStyle.brickOffsetLeft,
  bricks = [],

  count = brickRows * brickColumns,
  remain = count,

  score = 0,
  lives = 3,

  statistics = [],
  playerName = "",

  drawInterval = 0;

// SORTIRA IGRACE PO BROJU SRUSENIH CIGLI
var sortStatistics = function (){
  statistics.sort(function (a, b) {
    return b.score - a.score;
  });
};

// GENERISE LAZNO POPUNJENU STATISTIKU, CUVANJE STATISTIKE
var generateFakeStatistics = function () {
  var storedStatistics = localStorage.getItem("statistics");
  if (storedStatistics) {
    statistics = JSON.parse(storedStatistics);
  }
  else {
    var players = ["Stefan", "Janko", "Petar"];
    for (var i = 0; i < players.length; i++) {
      statistics.push({ player: players[i], score: Math.floor(Math.random() * 72) });
    }
  }
  showStatistics();
};

// DODAJE NOVI OBJEKAT SA IGRACEM I SKOROM U STATISTIKU
var addNewStatistics = function (playerName, finalScore) {
  statistics.push({player: playerName, score: finalScore});
  showStatistics();
  //localStorage.clear();
  localStorage.setItem("statistics", JSON.stringify(statistics));
  console.log(statistics);
};

// VRSI UPIS STATISTIKE U HTML
var showStatistics = function () {
  sortStatistics();
  var statisticsDiv = document.getElementById("statistics");
  if (!statisticsDiv){
    return;
  }
  statisticsDiv.innerHTML = "<h4>STATISTICS<h4>" + "<hr>";
  for (var i = 0; i < statistics.length; i++){
    statisticsDiv.innerHTML +=  "<p>" + statistics[i].player + ": " + statistics[i].score + "</p>";
  }  
};

// KREIRA I POPUNJUJE NIZ UKUPNIM BROJEM CIGLI
var createBricks = function (brickColumns, brickRows) {
  var brick = [];
  for (var column = 0; column < brickColumns; ++column) {
    brick[column] = [];
    for (var row = 0; row < brickRows; ++row) {
      brick[column][row] = { x: 0, y: 0, status: 1 };
    }
  }
  bricks = brick;
};

// ISCRTAVANJE LOPTICE U KANVAS
var drawBall = function () {
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  context.fillStyle = configStyle.ballColor;
  context.fill();
  context.closePath();
};

// ISCRTAVANJE PALICE U KANVAS
var drawStick = function () {
  context.beginPath();
  context.rect(stickX, stickY, stickWidth, stickHeight);
  context.fillStyle = configStyle.stickColor;
  context.fill();
  context.closePath();
};

// ISCRTAVANJE SKORA U KANVAS
var drawScore = function () {
  context.font = configStyle.captionText;
  context.fillStyle = configStyle.captionColor;
  context.fillText(configStyle.captionScore + score, 10, 20);
};

// ISCRTAVANJE IME IGRICE I BROJA PREOSTALIH ZIVOTA
var drawLives = function () {
  context.font = configStyle.captionText;
  context.fillStyle = configStyle.captionColor;
  context.fillText(configStyle.captionMain, 160, 20);
  context.fillText(configStyle.captionLives + lives, 460, 20);
};

// UBRZAVANJE LOPTICE I SMANJENJE SIRINE PALICE
var acceleration = function () {
  speedX = speedX >= 0 ? speedX + speedUp : speedX - speedUp;
  speedY = speedY >= 0 ? speedY + speedUp : speedY - speedUp;
  stickWidth -= 15;
};

// KREIRA NIVOE I PRIMENJUJE NJEGOVA SVOJSTVA
var levels = function (count) {
  if ([18, 36, 54].indexOf(count) === -1) {
    return;
  }
  configStyle.brickColorEven = configStyle.brickRandomColor();
  configStyle.brickColorOdd = configStyle.brickRandomColor();
  acceleration();
  console.log(configStyle.brickColorEven, configStyle.brickColorOdd);
};

// ISCRTAVA I STILIZUJE CIGLE
var drawBricks = function () {
  for (var column = 0; column < brickColumns; ++column) {
    for (var row = 0; row < brickRows; ++row) {
      if (bricks[column][row].status == 1) {
        var brickX = (column * (brickWidth + brickPadding)) + brickOffsetLeft,
          brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[column][row].x = brickX;
        bricks[column][row].y = brickY;
        context.beginPath();
        context.rect(brickX, brickY, brickWidth, brickHeight);
        if (column % 2 != 0)
          context.fillStyle = configStyle.brickColorEven;
        else
          context.fillStyle = configStyle.brickColorOdd;
        context.fill();
        context.closePath();
      }
    }
  }
};

// ISPITUJE SUDAR LOPTICE I CIGLE
var impactDetector = function () {
  for (var column = 0; column < brickColumns; ++column) {
    for (var row = 0; row < brickRows; ++row) {
      var brick = bricks[column][row];
      if (brick.status == 1) {
        if ((ballX > brick.x) && (ballX < (brick.x + brickWidth)) && (ballY > brick.y) && (ballY < brick.y + brickHeight)) {
          speedY = -speedY;
          brick.status = 0;
          score++;
          count--;
          levels(count);
          if (count == 0) {
            clearInterval(drawInterval);
            alert("GREAT JOB CHAMPION, YOU WON !!!");
            if (playerName === ""){
              playerName = prompt("Tell us your name", "myName");
            }
            addNewStatistics(playerName, score);
          }
        }
      }
    }
  }
};

// ODREDJUJE ODNOS PALICE I LOPTICE, KONROLA ZIVOTA I KRETANJE LOPTICE KROZ KANVAS 
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
        if (playerName === ""){
          playerName = prompt("Tell us your name", "myName");
        }
        addNewStatistics(playerName, score);
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
};

// ISCRTAVA CANVAS I POKRECE IGRICU
var draw = function () {
  context.clearRect(0, 0, interface.width, interface.height);
  drawBricks();
  drawStick();
  drawBall();
  ballMovement();
  impactDetector();
  drawScore();
  drawLives();
};

// KONTROLISE KRETANJE PALICE UZ POMOC KRETANJA MISA
var mouseMoveHandler = function (e) {
  var relativeX = e.clientX - interface.offsetLeft;
  if ((relativeX > 0) && (relativeX < interface.width)) {
    if ((relativeX - stickWidth / 2 >= 0) && (relativeX - stickWidth / 2 <= interface.width - stickWidth))
      stickX = relativeX - stickWidth / 2;
  }
  else if (relativeX < 0) {
    stickX = 0;
  }
  else if (relativeX > interface.width) {
    stickX = interface.width - stickWidth;
  }
};

createBricks(brickColumns, brickRows);
document.addEventListener("mousemove", mouseMoveHandler, false);
generateFakeStatistics();
console.log(statistics);
document.getElementById("newGame").addEventListener("click", function (){
  var newGame = confirm("Start new game?");
  if (newGame == true){
    document.location.reload();
  }
});

drawInterval = setInterval(draw, 20);
