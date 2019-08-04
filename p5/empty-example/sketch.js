


var soduku = new grid();
soduku.createBoard(0, false);

generateIncompleteGrid(soduku);




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

function generateIncompleteGrid(soduku){
  var randomlyAssortedCellList = soduku.createRandomListOrderOfCells();

  // randomly sort the cells
  // go through the cell list, removing each one
  // copy the grid state, remove the copy
  // if solvable is true on copy
  // remove it on main

  for (var i = 0; i < randomlyAssortedCellList.length; i++)
  {
      soduku2 = new grid();
      soduku2.copyGridState(soduku);
      soduku2.removeUnwantedCell(randomlyAssortedCellList[i].getCellPosX(), randomlyAssortedCellList[i].getCellPosY());
      if (soduku2.isGridStateSolvable() == true)
        soduku.removeUnwantedCell(randomlyAssortedCellList[i].getCellPosX(), randomlyAssortedCellList[i].getCellPosY());
  }

  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      if (soduku.cells[i][j].getCellVal() != 0){
        soduku.cells[i][j].setPermanent(true);
      }
      else{
        soduku.cells[i][j].setPermanent(false);
      }
    }
}

}

function clone(obj){

  if (null == obj || "object" != typeof obj) return obj;
  var copy = new grid();
  for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;

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
      if (soduku.cells[i][j].getCellVal() != 0){
        if (soduku.cells[i][j].getPermanent() == true){
          textSize(24);
        }
        else{
          textSize(18);
        }
        text(soduku.cells[i][j].getCellVal(), 50 + 20 + soduku.cells[i][j].getCellPosX() * 40, 50 + 20 + soduku.cells[i][j].getCellPosY() * 40);
      }
    }
  }
}

function drawGrid() {
  var maxRows = 9;

  console.log(soduku.getDarkMode());
  
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      soduku.cells[i][j].drawSquare(soduku.getDarkMode());
    }
  }

  if (soduku.getDarkMode() == true){
    fill(color(255,255,255));
    //maybe remove this later?
    stroke(214, 214, 214);
  }else{
    //console.log("FILLING");
    fill(color(0,0,0));
  }

  //fill(color(0,0,0))
  for (var i = 0; i < maxRows + 1; i++){

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

  strokeWeight(0);
  stroke(0, 0, 0);
  
}

var script = document.createElement('script');
script.src = 'http://code.jquery.com/jquery-1.11.0.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);


document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");
  btn = document.getElementById("somebutton");
  btnEasy = document.getElementById("somebuttonEasy");

  btn.onclick = function setup() {
    soduku.clear();
    soduku.createBoard(0, false);
  }

  btnEasy.onclick = function setup(){
    soduku.clear();
    soduku.createBoard(0, false);

    generateIncompleteGrid(soduku);
  }
});