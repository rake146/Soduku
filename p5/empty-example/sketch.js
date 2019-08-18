


var soduku = new grid();
soduku.createBoard(0, false);

var awaitingInput = false;
var inputX = 0;
var inputY = 0;
var gridFailed = false;
var gridCompleted = false;

var completeSoduku = new grid();

function setup() {
  // setup code
  var canvas = createCanvas(500, 500);
  console.log(canvas);
  canvas.parent('soduku-grid');
}

function draw() {
  // tracking gridFailed & updating html
  if (gridFailed == true){ gridStatus.innerHTML = "GAME OVER"; }
  else { gridStatus.innerHTML = "IN PLAY"; }

  clear();
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
      if (i == 0){ completeSoduku.copyGridState(soduku); }

      soduku2 = new grid();
      soduku2.copyGridState(soduku);
      soduku2.removeUnwantedCell(randomlyAssortedCellList[i].getCellPosX(), randomlyAssortedCellList[i].getCellPosY());
      if (soduku2.isGridStateSolvable() == true)
        soduku.removeUnwantedCell(randomlyAssortedCellList[i].getCellPosX(), randomlyAssortedCellList[i].getCellPosY());
  }

  // set the permanent cells to true to highlight in UI
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      soduku.getCells(i, j).setPermanent(soduku.getCells(i, j).getCellVal() != 0);
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

  // if we leave the bounding square
  if (soduku.getCells(inputX, inputY).isInBounds(mouseX, mouseY) != true && awaitingInput == true){ awaitingInput = false; } 

  if (awaitingInput == false && gridFailed == false){
    soduku.clearFocus();
    for (var i = 0; i < 9; i++){
      for (var j = 0; j < 9; j++){
        if (soduku.getCells(i, j).isInBounds(mouseX, mouseY) == true){
          soduku.getCells(i, j).setHovered(true);
  
          temporaryBoundingArray = soduku.getRelevantNeighbours(soduku.getCells(i, j));
  
          for (var k = 0; k < temporaryBoundingArray.length; k++)
            temporaryBoundingArray[k].setCorrelated(true);
  
          if (mouseIsPressed && soduku.getCells(i, j).getCellVal() == 0){
            soduku.getCells(i, j).setFocused(true);
            awaitingInput = true;
            inputX = i;
            inputY = j;
          }
        }
        else{
          soduku.getCells(i, j).setHovered(false);
          soduku.getCells(i, j).setFocused(false);
        }
      }
    }
  }
  
}

function keyPressed(){
  if (awaitingInput == true){
    if (keyCode >= 49 && keyCode <= 58){
      console.log("Input registered");
      soduku.getCells(inputX, inputY).setVal(key);
      awaitingInput = false;

      if (getFailedState() == true){
        soduku.getCells(inputX, inputY).setInvalidNumber(true);
        gridFailed = true;
        console.log("YOUVE FAILED!");
      } else {
        console.log("SUCESSFUL INPUT!");
      }

      inputX = 0;
      inputY = 0;

    }
  }
}

function getFailedState(){
  return soduku.getCells(inputX, inputY).getCellVal() != completeSoduku.getCells(inputX, inputY).getCellVal();
}

function valueChecking(){
  textSize(18);
  textAlign(CENTER, CENTER);
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      if (soduku.getCells(i, j).getCellVal() != 0){
        textSize(18);
        text(soduku.getCells(i, j).getCellVal(), 50 + 20 + soduku.getCells(i, j).getCellPosX() * 40, 50 + 20 + soduku.getCells(i, j).getCellPosY() * 40);
      }
    }
  }
}

function drawGrid() {
  var maxRows = 9;
  
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      soduku.getCells(i, j).drawSquare(soduku.getDarkMode());
    }
  }

  if (soduku.getDarkMode() == true){
    fill(color(255,255,255));
    //maybe remove this later?
    stroke(214, 214, 214);
  }else{
    fill(color(0,0,0));
  }

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
  btnGenerate = document.getElementById("generate-grid-button");
  btnEasy = document.getElementById("somebuttonEasy");
  btnDark = document.getElementById("dark-button");
  btnSolve = document.getElementById("solve-grid-button");
  gridStatus = document.getElementById("grid-status");

  btnDark.onclick = function setup(){
    console.log("Dark clicked", !soduku.getDarkMode());
    soduku.setDarkMode(!soduku.getDarkMode());
  }

  btnSolve.onclick = function setup(){
    if (soduku.returnGridCompleted() == false){
      clear();
      gridFailed = false;
      soduku.copyGridState(completeSoduku);
      console.log("grid state copied");
    } else{
      console.log("grid complete!");
    }
  }

  btnGenerate.onclick = function setup() {
    soduku.clear();
    gridFailed = false;
    soduku.createBoard(0, false);
  }

  btnEasy.onclick = function setup(){
    soduku.clear();
    gridFailed = false;
    soduku.createBoard(0, false);
    generateIncompleteGrid(soduku);
  }
});