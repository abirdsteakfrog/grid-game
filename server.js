var express = require('express'); //imports express module into the variable express
//variable express stores a javascript function

var app = express();
var server = app.listen(3000);

app.use(express.static('public')); //static refers to non-dynamic files. 

console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server); 

//TODO later implement a queue for those waiting in a game
var connected = 0;
io.sockets.on('connection', function(){ //on connection
  if (connected < 2) {
    connected++; 
  }
  else {
    //connect the two queued players //TODO need to somehow save the two players's socket :0
    connected = 0; 
  }
});

//TODO implement wait for 2 players, then label each connection with playerIDs. 

