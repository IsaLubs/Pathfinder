var selectedImageSrc = ""; 

function rand(max) {
    return Math.floor(Math.random() * max);
  }
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function changeBrightness(factor, sprite) {
  var virtCanvas = document.createElement("canvas");
  virtCanvas.width = 500;
  virtCanvas.height = 500;
  var context = virtCanvas.getContext("2d");
  context.drawImage(sprite, 0, 0, 500, 500);
  var imgData = context.getImageData(0, 0, 500, 500);
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = imgData.data[i] * factor;
    imgData.data[i + 1] = imgData.data[i + 1] * factor;
    imgData.data[i + 2] = imgData.data[i + 2] * factor;
  }
  context.putImageData(imgData, 0, 0);
  var spriteOutput = new Image();
  spriteOutput.src = virtCanvas.toDataURL();
  virtCanvas.remove();
  return spriteOutput;
}
function displayVictoryMess(moves) {
  var endTime = Date.now(); 
  var timeTaken = (endTime - startTime) / 1000; 
  clearInterval(countdownId); 
  clearTimeout(timerId); 
  document.getElementById("moves").innerHTML = "You Moved " + moves + " Steps. and take " + timeTaken.toFixed(0) + ' seconds.';
  toggleVisablity("Message-Container");  
  document.getElementById('tickerSound3').play();
  winnerAnimation()

}
function toggleVisablity(id) {
  if (document.getElementById(id).style.visibility == "visible") {
    location.reload(true);

    document.getElementById(id).style.visibility = "hidden";
  } else {
    document.getElementById(id).style.visibility = "visible";
  }
}

function path(Width, Height) {
  var pathMap;
  var width = Width;
  var height = Height;
  var startCoord, endCoord;
  var dirs = ["n", "s", "e", "w"];
  var modDir = {
    n: {
      y: -1, x: 0, o: "s"
    },
    s: {
      y: 1, x: 0, o: "n"
    },
    e: {
      y: 0, x: 1, o: "w"
    },
    w: {
      y: 0, x: -1, o: "e"
    }
  };
  this.map = function() {
    return pathMap;
  };
  this.startCoord = function() {
    return startCoord;
  };
  this.endCoord = function() {
    return endCoord;
  };
  function genMap() {
    pathMap = new Array(height);
    for (y = 0; y < height; y++) {
      pathMap[y] = new Array(width);
      for (x = 0; x < width; ++x) {
        pathMap[y][x] = {
          n: false, s: false, e: false, w: false, visited: false, priorPos: null
        };
      }
    }
  }

  function definepath() {
    var isComp = false;
    var move = false;
    var cellsVisited = 1;
    var numLoops = 0;
    var maxLoops = 0;
    var pos = {
      x: 0, y: 0
    };
    var numCells = width * height;
    while (!isComp) {
      move = false;
      pathMap[pos.x][pos.y].visited = true;

      if (numLoops >= maxLoops) {
        shuffle(dirs);
        maxLoops = Math.round(rand(height / 8));
        numLoops = 0;
      }
      numLoops++;
      for (index = 0; index < dirs.length; index++) {
        var direction = dirs[index];
        var nx = pos.x + modDir[direction].x;
        var ny = pos.y + modDir[direction].y;

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          if (!pathMap[nx][ny].visited) {
            pathMap[pos.x][pos.y][direction] = true;
            pathMap[nx][ny][modDir[direction].o] = true;
            pathMap[nx][ny].priorPos = pos;
            pos = {
              x: nx, y: ny
            };
            cellsVisited++;
            move = true;
            break;
          }
        }
      }
      if (!move) {
        pos = pathMap[pos.x][pos.y].priorPos;
      }
      if (numCells == cellsVisited) {
        isComp = true;
      }
    }
  }

  function defineStartEnd() {
    switch (rand(4)) {
      case 0:
        startCoord = {
          x: 0, y: 0
        };
        endCoord = {
          x: height - 1, y: width - 1
        };
        break;
      case 1:
        startCoord = {
          x: 0, y: width - 1
        };
        endCoord = {
          x: height - 1, y: 0
        };
        break;
      case 2:
        startCoord = {
          x: height - 1, y: 0
        };
        endCoord = {
          x: 0, y: width - 1
        };
        break;
      case 3:
        startCoord = {
          x: height - 1, y: width - 1
        };
        endCoord = {
          x: 0, y: 0
        };
        break;
    }
  }
  genMap();
  defineStartEnd();
  definepath();
}

function Drawpath(path, ctx, cellsize, endSprite = null) {
  var map = path.map();
  var cellSize = cellsize;
  var drawEndMethod;
  ctx.lineWidth = cellSize / 20;
  ctx.strokeStyle = 'purple'; 

  this.redrawpath = function(size) {
    cellSize = size;
    ctx.lineWidth = cellSize / 30;
    drawMap();
    drawEndMethod();
  }; 
    
  function drawCell(xCord, yCord, cell) {
    var x = xCord * cellSize;
    var y = yCord * cellSize;

    if (cell.n == false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
      ctx.stroke();
    }
    if (cell.s === false) {
      ctx.beginPath();
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.e === false) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.w === false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cellSize);
      ctx.stroke();
    }
  }
    
  function drawMap() {
    for (x = 0; x < map.length; x++) {
      for (y = 0; y < map[x].length; y++) {
        drawCell(x, y, map[x][y]);
      }
    }
  }
    
  function drawEndFlag() {
    var coord = path.endCoord();
    var gridSize = 4;
    var fraction = cellSize / gridSize - 2;
    var colorSwap = true;
    for (let y = 0; y < gridSize; y++) {
      if (gridSize % 2 == 0) {
        colorSwap = !colorSwap;
      }
      for (let x = 0; x < gridSize; x++) {
        ctx.beginPath();
        ctx.rect(
          coord.x * cellSize + x * fraction + 4.5,
          coord.y * cellSize + y * fraction + 4.5,
          fraction,
          fraction
        );
        if (colorSwap) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        }
        ctx.fill();
        colorSwap = !colorSwap;
      }
    }
  }
  function drawEndSprite() {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    var coord = path.endCoord();
    ctx.drawImage(
      endSprite,
      2,
      2,
      endSprite.width,
      endSprite.height,
      coord.x * cellSize + offsetLeft,
      coord.y * cellSize + offsetLeft,
      cellSize - offsetRight,
      cellSize - offsetRight
    );
  }
  function clear() {
    var canvasSize = cellSize * map.length;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
  }
  if (endSprite != null) {
    drawEndMethod = drawEndSprite;
  } else {
    drawEndMethod = drawEndFlag;
  }
  clear();
  drawMap();
  drawEndMethod();
}
  
function Player(path, c, _cellsize, onComplete, sprite = null) {
  var ctx = c.getContext("2d");
  var drawSprite;
  var moves = 0;
  drawSprite = drawSpriteCircle;
  if (sprite != null) {
    drawSprite = drawSpriteImg;
  }
  var player = this;
  var map = path.map();
  var cellCoords = {
    x: path.startCoord().x,
    y: path.startCoord().y
  };
  var cellSize = _cellsize;
  var halfCellSize = cellSize / 2;

  this.redrawPlayer = function(_cellsize) {
    cellSize = _cellsize;
    drawSpriteImg(cellCoords);
  };

  function drawSpriteCircle(coord) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(
      (coord.x + 1) * cellSize - halfCellSize,
      (coord.y + 1) * cellSize - halfCellSize,
      halfCellSize - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    if (coord.x === path.endCoord().x && coord.y === path.endCoord().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }

  function drawSpriteImg(coord) {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    ctx.drawImage(
      sprite, 0, 0, sprite.width, sprite.height, coord.x * cellSize + offsetLeft, coord.y * cellSize + offsetLeft, cellSize - offsetRight, cellSize - offsetRight
    );
    if (coord.x === path.endCoord().x && coord.y === path.endCoord().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }

  function removeSprite(coord) {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    ctx.clearRect(
      coord.x * cellSize + offsetLeft, coord.y * cellSize + offsetLeft, cellSize - offsetRight, cellSize - offsetRight
    );
  }
  

  document.getElementById('upBtn').addEventListener('click', () => {
    check({ keyCode: 38 }); 
  });
  document.getElementById('downBtn').addEventListener('click', () => {
    check({ keyCode: 40 }); 
  });
  document.getElementById('leftBtn').addEventListener('click', () => {
    check({ keyCode: 37 });
  });
  document.getElementById('rightBtn').addEventListener('click', () => {
    check({ keyCode: 39 }); 
  });
  
  function check(e) {
    var cell = map[cellCoords.x][cellCoords.y];
    moves++;
    switch (e.keyCode) {
      case 65:
      case 37: 
        if (cell.w == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x - 1, y: cellCoords.y
          };
          drawSprite(cellCoords);
        }
        break;
      case 87:
      case 38: 
        if (cell.n == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x, y: cellCoords.y - 1
          };
          drawSprite(cellCoords);
        }
        break;
      case 68:
      case 39: 
        if (cell.e == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x + 1, y: cellCoords.y
          };
          drawSprite(cellCoords);
        }
        break;
      case 83:
      case 40: 
        if (cell.s == true) {
          removeSprite(cellCoords);
          cellCoords = {
            x: cellCoords.x, y: cellCoords.y + 1
          };
          drawSprite(cellCoords);
        }
        break;
    }
  }
  
  

  this.bindKeyDown = function() {
    window.addEventListener("keydown", check, false);

    $("#path_view").swipe({
      swipe: function(
        event, direction, distance, duration, fingerCount, fingerData
      ) {
        console.log(direction);
        switch (direction) {
          case "up":
            check({
              keyCode: 38
            });
            break;
          case "down":
            check({
              keyCode: 40
            });
            break;
          case "left":
            check({
              keyCode: 37
            });
            break;
          case "right":
            check({
              keyCode: 39
            });
            break;
        }
      },
      threshold: 0
    });
  };

  this.unbindKeyDown = function() {
    window.removeEventListener("keydown", check, false);
    $("#path_view").swipe("destroy");
  };
  this.bindKeyDown();

  drawSprite(path.startCoord());

}
  
var pathCanvas = document.getElementById("pathCanvas");
var ctx = pathCanvas.getContext("2d");
var sprite;
var finishSprite;
var path, draw, player;
var cellSize;
var difficulty;

window.onload = function() {
  let viewWidth = $("#path_view").width();
  let viewHeight = $("#path_view").height();
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }

  var completeOne = false;
  var completeTwo = false;
  var isComplete = () => {
    if(completeOne === true && completeTwo === true)
        {
          console.log("Runs");
          setTimeout(function(){
            makePath();
          }, 500);         
        }
  };
  sprite = new Image();
  sprite.src = selectedImageSrc || ".\\Assets\\Images\\mouse.png" + "?" + new Date().getTime(); 

  sprite.setAttribute("crossOrigin", " ");
  sprite.onload = function() {
    sprite = changeBrightness(1.2, sprite);
    completeOne = true;
    console.log(completeOne);
    isComplete();
  };

  finishSprite = new Image();
  finishSprite.src = ".\\Assets\\Images\\hole.png"+
  "?" +
  new Date().getTime();
  finishSprite.setAttribute("crossOrigin", " ");
  finishSprite.onload = function() {
    finishSprite = changeBrightness(1.1, finishSprite);
    completeTwo = true;
    console.log(completeTwo);
    isComplete();
  };
  
};
  
window.onresize = function() {
  let viewWidth = $("#path_view").width();
  let viewHeight = $("#path_view").height();
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }
  cellSize = pathCanvas.width / difficulty;
  if (player != null) {
    draw.redrawpath(cellSize);
    player.redrawPlayer(cellSize);
  }
};
var isImageSelected = false;
function makePath() {
  if (player != undefined) {
    player.unbindKeyDown();
    player = null;
  }
  var startBtn = document.getElementById('Startbtn');
  var selector_menu = document.getElementById('selector-menu');
  
  var e = document.getElementById("difficulty-level-Select");
  difficulty = e.options[e.selectedIndex].value;
  if (difficulty === '0') {
    alert('Select Level to Start the game')
    return; 
  }
  if (!isImageSelected) {
    imageSelector();
    alert('Please select an image and click Save before starting the game.');
    return; 
  }
  
  var instructionElement = document.getElementById('arrow-instruction');
  var path_canvas = document.getElementById('pathCanvas');
  var arrow_intruction = document.getElementById('arrow-instruction');
  path_canvas.style.height = '400px'
  arrow_intruction.style.paddingTop = '80px';
  instructionElement.style.marginTop = '425' + 'px'; 
  var startinstructionElement = document.getElementById('StartInstruction');
  startinstructionElement.style.display = 'none'; 
  
  selector_menu.style.display = 'none'
  startBtn.value = 'Reset';

  
  startBtn.onclick = resetGame;
  startTimer(difficulty);
  cellSize = pathCanvas.width / difficulty;
  path = new path(difficulty, difficulty);
  draw = new Drawpath(path, ctx, cellSize, finishSprite);
  player = new Player(path, pathCanvas, cellSize, displayVictoryMess, sprite);
  
  if (document.getElementById("pathContainer").style.opacity < "100") {
    document.getElementById("pathContainer").style.opacity = "100";
  }
}

function imageSelector() {
  var imageSelectorContainer = document.getElementById("imageSelectorContainer");
  imageSelectorContainer.style.opacity = '1';
  imageSelectorContainer.style.display = 'block';

  const checkboxes = document.querySelectorAll('.checkboxstyle');
  const saveBtn = document.getElementById('saveBtn');

  saveBtn.disabled = true;

  function updateSpriteAndCheckSelection() {
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedImageSrc = checkbox.nextElementSibling.querySelector('img').src;
        saveBtn.disabled = false; 
      }
    });
    if (selectedImageSrc) {      
      sprite.src = selectedImageSrc + "?" + new Date().getTime();
      isImageSelected = true;
    }
  }

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function() {
      uncheckOthers(this);
      updateSpriteAndCheckSelection();
    });
  });

  function uncheckOthers(current) {
    checkboxes.forEach(checkbox => {
      if (checkbox !== current) {
        checkbox.checked = false;
      }
    });
  }

  saveBtn.addEventListener('click', function() {
    let isSelected = false;
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        isSelected = true;
      }
    });

    if (isSelected) {
      isImageSelected = true;
      imageSelectorContainer.style.display = 'none';
      alert('Image selected successfully. You can start the game now.');
      if (selectedImageSrc.includes('lion.png')) {
        document.body.style.backgroundImage = "linear-gradient(-45deg, red 0%, red 25%, red 51%, #ff357f 100%)";
      } else if (selectedImageSrc.includes('run.png')) {
        document.body.style.backgroundImage = "linear-gradient(-45deg, green 0%, green 25%, green 51%, #ff357f 100%)";
      } else if (selectedImageSrc.includes('sedan.png')) {
        document.body.style.backgroundImage = "linear-gradient(-45deg, blue 0%, blue 25%, blue 51%, #ff357f 100%)";
      }
      makePath();
      
    } else {
      alert('Please select an image before saving.');
    }
  });
}
  
function resetGame() {
  var instructionElement = document.getElementById('arrow-instruction');
  instructionElement.style.marginTop = '20' + 'px'; 
  var startinstructionElement = document.getElementById('StartInstruction');
  startinstructionElement.style.display = 'flex'; 
  location.reload(true)
}
var startTime; 
var timerId;
var countdownId;
  
function startTimer(difficulty) {
  startTime = Date.now(); 
  var timeLimit;

  switch (difficulty) {
    case '10':
      timeLimit = 90; 
      break;
    case '15':
      timeLimit = 60; 
      break;
    case '25':
      timeLimit = 40;
      break;
    default:
      alert('Invalid difficulty level.');
      return;
  }

  var currentTime = timeLimit;
  updateTimer(currentTime);

  countdownId = setInterval(function() {
    currentTime--;
    updateTimer(currentTime);
    if (currentTime >= 11){
      document.getElementById('tickerSound1').play();
    }

    if (currentTime === 11) {
      document.getElementById('tickerSound1').pause();
      document.getElementById('tickerSound').play();
    }

    if (currentTime <= 0) {
      clearInterval(countdownId);
      displayLoserNotification();
    }
  }, 1000);
}

function updateTimer(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;
  
  if (remainingSeconds < 10) {
    remainingSeconds = "0" + remainingSeconds;  
  }

  document.getElementById('time').textContent = minutes + ":" + remainingSeconds;
}

function displayLoserNotification() {

  clearInterval(countdownId); 
  clearTimeout(timerId);

  toggleVisablity("Message-Container1");  
  document.getElementById('tickerSound2').play();


}
function winnerAnimation(){
    var confetti = {
      maxCount: 150,
      speed: 2,
      frameInterval: 15,
      alpha: 1,
      gradient: !1,
      start: null,
      stop: null,
      toggle: null,
      pause: null,
      resume: null,
      togglePause: null,
      remove: null,
      isPaused: null,
      isRunning: null
  };
  ! function () {
      confetti.start = s, confetti.stop = w, confetti.toggle = function () {
          e ? w() : s()
      }, confetti.pause = u, confetti.resume = m, confetti.togglePause = function () {
          i ? m() : u()
      }, confetti.isPaused = function () {
          return i
      }, confetti.remove = function () {
          stop(), i = !1, a = []
      }, confetti.isRunning = function () {
          return e
      };
      var t = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window
          .mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame,
          n = ["rgba(30,144,255,", "rgba(107,142,35,", "rgba(255,215,0,", "rgba(255,192,203,", "rgba(106,90,205,",
              "rgba(173,216,230,", "rgba(238,130,238,", "rgba(152,251,152,", "rgba(70,130,180,",
              "rgba(244,164,96,", "rgba(210,105,30,", "rgba(220,20,60,"
          ],
          e = !1,
          i = !1,
          o = Date.now(),
          a = [],
          r = 0,
          l = null;

      function d(t, e, i) {
          return t.color = n[Math.random() * n.length | 0] + (confetti.alpha + ")"), t.color2 = n[Math.random() *
                  n.length | 0] + (confetti.alpha + ")"), t.x = Math.random() * e, t.y = Math.random() * i - i, t
              .diameter = 10 * Math.random() + 5, t.tilt = 10 * Math.random() - 10, t.tiltAngleIncrement = .07 *
              Math.random() + .05, t.tiltAngle = Math.random() * Math.PI, t
      }

      function u() {
          i = !0
      }

      function m() {
          i = !1, c()
      }

      function c() {
          if (!i)
              if (0 === a.length) l.clearRect(0, 0, window.innerWidth, window.innerHeight), null;
              else {
                  var n = Date.now(),
                      u = n - o;
                  (!t || u > confetti.frameInterval) && (l.clearRect(0, 0, window.innerWidth, window.innerHeight),
                      function () {
                          var t, n = window.innerWidth,
                              i = window.innerHeight;
                          r += .01;
                          for (var o = 0; o < a.length; o++) t = a[o], !e && t.y < -15 ? t.y = i + 100 : (t
                              .tiltAngle += t.tiltAngleIncrement, t.x += Math.sin(r) - .5, t.y += .5 * (Math
                                  .cos(r) + t.diameter + confetti.speed), t.tilt = 15 * Math.sin(t.tiltAngle)
                          ), (t.x > n + 20 || t.x < -20 || t.y > i) && (e && a.length <= confetti
                              .maxCount ? d(t, n, i) : (a.splice(o, 1), o--))
                      }(),
                      function (t) {
                          for (var n, e, i, o, r = 0; r < a.length; r++) {
                              if (n = a[r], t.beginPath(), t.lineWidth = n.diameter, i = n.x + n.tilt, e = i + n
                                  .diameter / 2, o = n.y + n.tilt + n.diameter / 2, confetti.gradient) {
                                  var l = t.createLinearGradient(e, n.y, i, o);
                                  l.addColorStop("0", n.color), l.addColorStop("1.0", n.color2), t.strokeStyle = l
                              } else t.strokeStyle = n.color;
                              t.moveTo(e, n.y), t.lineTo(i, o), t.stroke()
                          }
                      }(l), o = n - u % confetti.frameInterval), requestAnimationFrame(c)
              }
      }

      function s(t, n, o) {
          var r = window.innerWidth,
              u = window.innerHeight;
          window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window
              .msRequestAnimationFrame || function (t) {
                  return window.setTimeout(t, confetti.frameInterval)
              };
          var m = document.getElementById("confetti-canvas");
          null === m ? ((m = document.createElement("canvas")).setAttribute("id", "confetti-canvas"), m
              .setAttribute("style", "display:block;z-index:999999;pointer-events:none;position:fixed;top:0"),
              document.body.prepend(m), m.width = r, m.height = u, window.addEventListener("resize",
                  function () {
                      m.width = window.innerWidth, m.height = window.innerHeight
                  }, !0), l = m.getContext("2d")) : null === l && (l = m.getContext("2d"));
          var s = confetti.maxCount;
          if (n)
              if (o)
                  if (n == o) s = a.length + o;
                  else {
                      if (n > o) {
                          var f = n;
                          n = o, o = f
                      }
                      s = a.length + (Math.random() * (o - n) + n | 0)
                  }
          else s = a.length + n;
          else o && (s = a.length + o);
          for (; a.length < s;) a.push(d({}, r, u));
          e = !0, i = !1, c(), t && window.setTimeout(w, t)
      }

      function w() {
          e = !1
      }
  }();
confetti.start();
}
document.addEventListener('DOMContentLoaded', (event) => {
  const checkboxes = document.querySelectorAll('.checkboxstyle');

  function uncheckOthers(current) {
    checkboxes.forEach(checkbox => {
      if(checkbox !== current) {
        checkbox.checked = false;
      }
    });
  }
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', function() {
      uncheckOthers(this);
    });
  });
});
const arrowInstruction = document.getElementById('arrow-instruction');

window.addEventListener('resize', () => {
    const screenWidth = window.innerWidth;
    if (screenWidth < 400) {
        arrowInstruction.style.paddingTop = '20px';
    } else {
        arrowInstruction.style.paddingTop = '80px';
    }
});
if (window.innerWidth < 400) {
    arrowInstruction.style.paddingTop = '20px';
}


