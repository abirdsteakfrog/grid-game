var playerID = 0;
var numRows = 4;
var numCols = 4; 
var playerArr = [];
var entityArr = [];
//TODO init playerarr (add players) and 

var grid = { 
  matrix: initMatrix(), 
  updateGrid: function() { //TODO decide whether or not to add string parameter for specific object representation on grid
    grid.matrix = initMatrix();
    for (var i = 0; i < playerArr.length; i++)  { // go through player array and place players in their spot
      grid.matrix[playerArr[i].currY][playerArr[i].currX] = "x";  
     //TODO add entities 
    }
  } 
}

//setup socket stuff
function socketSetup() {
  socket = io.connect('http://localhost:3000');
}
socketSetup();


function Player(id) {
  this.xMin = 0;
  this.yMin = 0;
  this.xMax = numCols - 1; //number of columns - 1
  this.yMax = numRows - 1; //number of rows - 1
  this.id = id; 
  this.currKey = '';
  this.currX = 0;
  this.currY = 0;
  
  this.setPosition = function(x, y) { 
    if (this.currX + x >= 0 && this.currX + x <= this.xMax  && this.currY + y >=0 && this.currY + y <= this.yMax) {
      this.currX = this.currX + x;
      this.currY = this.currY + y;
    }
  }
  this.setCurrKey = function(newKey) {
    this.currKey = newKey; 
  }
} 

function initPlayers() {
  playerArr.push(new Player(0)); 
}
initPlayers();

//creates an array that is 2 rows and 3 columns
function initMatrix() {
  var a = [];
  for(var y = 0; y < numRows; y++) {
    a[y] = [];
    for(var x = 0; x < numCols; x++) { 
      a[y][x] = "_"; 
    } 
  }
  return a; 
}

//updates the browser's element with string representation of grid.
function draw() { //TODO fix this shitty code
  var str1 = "";
  var str2 = ""; 
  var str3 = "";
  var str4 = "";
  //printMatrix();
  for (var i = 0; i < grid.matrix[0].length; i++) {
    str1 = str1 + " " + grid.matrix[0][i];
    str2 = str2 + " " + grid.matrix[1][i];
    str3 = str3 + " " + grid.matrix[2][i];
    str4 = str4 + " " + grid.matrix[3][i]; 
  }
  document.getElementById("textarea").innerHTML = str1 + "\n" + str2 + "\n" + str3 + "\n" + str4;
} 

//processes each player's action every 3 seconds and updates grid and the 
//browser
//TODO implement delayMillis with time marker length
function update() {  
  var delayMillis = 3000; //3 seconds
  for(var i = 0; i < playerArr.length; i++) {
    if(playerArr[i].currKey == ' ') {
      
    }
    else if (playerArr[i].currKey == 39){  //right 
      playerArr[i].setPosition(1, 0);
      console.log("right");
    }
    else if (playerArr[i].currKey == 37){  //left 
      playerArr[i].setPosition(-1, 0);
      console.log("left");
    }
    else if (playerArr[i].currKey == 38){ //up
      playerArr[i].setPosition(0,-1);
      console.log("up");
    }
    else if (playerArr[i].currKey == 40){ //down
      playerArr[i].setPosition(0,1);
      console.log("down");
    }
    playerArr[i].setCurrKey(' ');  
  }
  grid.updateGrid();
  draw(); 
  setTimeout(function() {
    update() 
  }, delayMillis) 
} 

//initializes everything 
update();

addEventListener("keydown", function(event) {
  playerArr[playerID].setCurrKey(event.keyCode);
  console.log(playerArr[playerID].currKey);
});

//debug method that logs the 2d array in console
function printMatrix() {
  for (var y = 0; y < numRows; y++) {
    for (var x = 0; x < numCols; x++)  {
      console.log(x + ',' + y + ' ' + grid.matrix[y][x]); 
    }
  }
}
