var socket;
var playerID;
var currKey = ' ';

//setup socket stuff
function socketSetup() {
  socket = io.connect('http://localhost:3000');
}
socketSetup();
socket.on('init', function(msg) { playerID = msg } );
socket.on('update', function(data) {
  draw(data);
}); 


//updates the browser's element with string representation of grid.
function draw(grid) {
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
  document.getElementById("textarea").innerHTML = str1 + "\n" + str2 + "\n" +
    str3 + "\n" + str4;
} 

addEventListener("keydown", function(event) {
  currKey = event.keyCode;
  var data = {
    id : playerID,
    currentKey : currKey 
  }
  socket.emit('keypress', data);
});



