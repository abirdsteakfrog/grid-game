var express = require('express'); //imports express module into the variable express
//variable express stores a javascript function

var app = express();
var server = app.listen(3000);

app.use(express.static('public')); //static refers to non-dynamic files. 

console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server); 

io.sockets.on('connection', newConnection);

var playerArr = [];
var socketArr = [];
var entityArr = [];
var numRows = 4;
var numCols = 4; 


var numPlayers = 0;
function newConnection(socket) {
  console.log('new connection: ' + socket.id);
  if (numPlayers < 2){  //TODO implement bounds
    socketArr.push(socket);
    socketArr[numPlayers].emit('init', numPlayers);
    playerArr.push(new Player(numPlayers, numPlayers*2, numPlayers*2 + 1, numPlayers * 3, numPlayers * 3)); //sketchy math 
    //0th player will have yBounds from 0 to 1 and 1th player will have 2 to 3
    numPlayers++;
  }  

  //TODO implement removeplayer when player leaves.. also implement queue system
  //game rooms for multiple games at the same time

  socket.on('keypress', keypressMsg ); 
  function keypressMsg(data) {
    console.log(data);
    playerArr[data.id].setCurrKey(data.currentKey); 
  }

}

function Player(id, yMinBound, yMaxBound, x, y) {
  this.xMin = 0;
  this.yMin = yMinBound;
  this.xMax = numCols - 1; //number of columns - 1
  this.yMax = yMaxBound; //number of rows - 1
  this.id = id; 
  this.currKey = '';
  this.currX = x;
  this.currY = y;
  this.setPosition = function(x, y) { 
    if (this.currX + x >= this.xMin && this.currX + x <= this.xMax  && this.currY + y >= this.yMin
      && this.currY + y <= this.yMax) {
      this.currX = this.currX + x;
      this.currY = this.currY + y;
    }
  }
  this.setCurrKey = function(newKey) {
    this.currKey = newKey; 
  }
}

var grid = { 
  matrix: initMatrix(), 
  updateGrid: function() { //TODO decide whether or not to add string parameter
    //for specific object representation on grid
    grid.matrix = initMatrix();
    for (var i = 0; i < playerArr.length; i++)  { // go through player array and
      //place players in their spot
      grid.matrix[playerArr[i].currY][playerArr[i].currX] = "x";  
     //TODO add entities 
    }
  } 
}

//creates blank 2d array
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


//processes each player's action every 3 seconds and updates grid and the 
//browser
//TODO implement delayMillis with time marker length
function update() {  
  var delayMillis = 200; //.5 seconds
  for(var i = 0; i < playerArr.length; i++) {
    if (playerArr[i].currKey == 39){  //right 
      playerArr[i].setPosition(1, 0); 
    }
    else if (playerArr[i].currKey == 37){  //left 
      playerArr[i].setPosition(-1, 0); 
    }
    else if (playerArr[i].currKey == 38){ //up
      playerArr[i].setPosition(0,-1); 
    }
    else if (playerArr[i].currKey == 40){ //down
      playerArr[i].setPosition(0,1); 
    }
    else if (playerArr[i].currKey == '  ') {
      //TODO implement basic attack 
    }

    playerArr[i].setCurrKey(' ');  
  }
  grid.updateGrid(); 
  io.sockets.emit('update', grid);  
  setTimeout(function() {
    update() 
  }, delayMillis) 

}
update();

//debug method that logs the 2d array in console
function printMatrix() {
  for (var y = 0; y < numRows; y++) {
    for (var x = 0; x < numCols; x++)  {
      console.log(x + ',' + y + ' ' + grid.matrix[y][x]); 
    }
  }
}


//TODO later implement a queue for those waiting in a game
//TODO implement wait for 2 players, then label each connection with playerIDs. 

