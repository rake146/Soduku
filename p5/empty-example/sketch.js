
var soduku = new grid();
soduku.createBoard(0, false);

do{
  soduku.removeRandomCell();
  soduku2 = new grid();
  soduku2.copyGridState(soduku);

}while(soduku2.isGridStateSolvable() == true)


/*
do{
  soduku.addRandomCell();
  soduku2 = new grid();
  soduku2.copyGridState(soduku);

}while(soduku2.isGridStateSolvable() == false)
*/

console.log(soduku2.isGridStateSolvable());


function setup() {
  // put setup code here
  createCanvas(500, 500);

}

function draw() {
  clear();
  // put drawing code here
  drawGrid();
  valueChecking();
  mouseChecking();
}
function clone(obj){

  if (null == obj || "object" != typeof obj) return obj;
  var copy = new grid();
  for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;

  //return copy;
}
function mouseChecking(){

  var temporaryBoundingArray = new Array();
  soduku.clearFocus();
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      if (soduku.cells[i][j].isInBounds(mouseX, mouseY) == true){
        soduku.cells[i][j].setHovered(true);

        temporaryBoundingArray = soduku.getRelevantNeighbours(soduku.cells[i][j]);

        for (var k = 0; k < temporaryBoundingArray.length; k++)
          temporaryBoundingArray[k].setCorrelated(true);

        if (mouseIsPressed)
        {
          soduku.cells[i][j].setFocused(true);
          soduku.cells[i][j].incrementVal();
        }
      }
      else{
        soduku.cells[i][j].setHovered(false);
        soduku.cells[i][j].setFocused(false);
      }
        
      
      //soduku.getRelevantNeighbours(soduku.cells[i][j]);
    }
  }
  
}

function valueChecking(){
  textSize(18);
  textAlign(CENTER, CENTER);
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      if (soduku.cells[i][j].getCellVal() != 0)
        text(soduku.cells[i][j].getCellVal(), 50 + 20 + soduku.cells[i][j].getCellPosX() * 40, 50 + 20 + soduku.cells[i][j].getCellPosY() * 40);
    }
  }
}

function drawGrid() {
  var maxRows = 9;
  
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      soduku.cells[i][j].drawSquare();
    }
  }
  
  for (var i = 0; i < maxRows + 1; i++){
    fill(color(0,0,0))

    if (i == 0 || i == maxRows){  // outline for grid
      strokeWeight(3);
    }
    else if (i % 3 == 0)  // outline for 3x3 grids
    {
      strokeWeight(2);
    }
    else{
      strokeWeight(1);
    }

    line(50, 50 + i * 40, 50 + 40 * maxRows, 50 + i * 40);
    line(50 + i * 40, 50, 50 + i * 40, 50 + 40 * maxRows);
    
  }
  
}

var script = document.createElement('script');
script.src = 'http://code.jquery.com/jquery-1.11.0.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);


document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");
  btn = document.getElementById("somebutton");

  btn.onclick = function setup() {
    soduku.clear();
    soduku.createBoard(0, false);
  }

  /*
  btn2 = document.getElementById("solveGridButton");

  btn2.onclick = function setup(){
    soduku.solveBoard(0, false);
    console.log("hello");
  }
  */
});

/*
function setup(){
    var disval = soduku.createBoard(0, false);
}*/