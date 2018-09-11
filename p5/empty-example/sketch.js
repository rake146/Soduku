class cell{ 
  constructor(positionX, positionY){
    this.positionX = positionX;
    this.positionY = positionY;

    this.lowerBoundsX = 50 + positionX * 40;
    this.higherBoundsX = this.lowerBoundsX + 40;

    this.lowerBoundsY = 50 + positionY * 40;
    this.higherBoundsY = this.lowerBoundsY + 40;
    
    this.val = 0;
    this.hovered = false;
    this.correlated = false;
    this.previousCellVals = [];
  }
  clearPreviousCells(){
    this.previousCellVals = [];
  }
  addPeviousCell(){
    this.previousCellVals.push(this.getCellVal());
  }
  getPreviousCellVals(){
    return this.previousCellVals;
  }
  getCellPosX(){
    return this.positionX;
  }
  getCellPosY(){
    return this.positionY;
  }
  getCellVal(){
    return this.val;
  }
  isInBounds(mouseXCoord, mouseYCoord){
    if (mouseXCoord >= this.lowerBoundsX && mouseXCoord <= this.higherBoundsX &&
    mouseYCoord >= this.lowerBoundsY && mouseYCoord <= this.higherBoundsY)
    {
      return true;
    }
  }
  incrementVal(){
    this.val++;
  }
  setVal(value){
    this.val = value;
  }
  drawSquare(){
    strokeWeight(1);
    if (this.hovered == true)
      fill(color('rgba(140, 176, 234, 0.9)'));
    else if (this.correlated == true)
      fill(color('rgba(80, 180, 225, 0.4)'));
    else
      fill(color(255,255,255));

    rect(50 + this.positionX * 40, 50 + this.positionY * 40, 40, 40);
  }
  setHovered(hovBool){
    this.hovered = hovBool;
  }
  getHovered(){
    return this.hovered;
  }
  setCorrelated(corrBool){
    this.correlated = corrBool;
  }
}
class grid{
  constructor(){
    this.cells = new Array(9);
    for (var i = 0; i < 9; i++)
      this.cells[i] = new Array(9);
    
    for (var i = 0; i < 9; i++)
      for (var j = 0; j < 9; j++)
        this.cells[i][j] = new cell(i, j);
  }
  getRelevantNeighbours(tile){
    var tempArr = new Array();

    for(var k = 0; k < 9; k++){
      tempArr.push(this.cells[k][tile.getCellPosY()]);  //x row
    }
    for (var l = 0; l < 9; l++){
      tempArr.push(this.cells[tile.getCellPosX()][l]);  //y row
    }
    
    var quadrantX = tile.getCellPosX() % 3;
    quadrantX = tile.getCellPosX() - quadrantX;
    var quadrantY = tile.getCellPosY() % 3;
    quadrantY = tile.getCellPosY() - quadrantY;

    var quadrantXMax = quadrantX + 3;
    var quadrantYMax = quadrantY + 3;

    
    for (var i = quadrantX; i < quadrantXMax; i++)
      for (var j = quadrantY; j < quadrantYMax; j++)
        tempArr.push(this.cells[i][j]);                 //3x3 sector
  
    return tempArr;
    
  }
  clearFocus(){
    for (var i = 0; i < 9; i++)
      for (var j = 0; j < 9; j++){
        this.cells[i][j].setHovered(false);
        this.cells[i][j].setCorrelated(false);
      }
  }
  //recursive fucntion
  //backup if there are no valid options
  //finsish successfully if there are avalid options and no remaining cells to mark
  //continue if there are valid options and remaining cells to mark
  /*
  createBoard(){
    var tempNeighbours;

    var exists = true;
    for (var i = 0; i < 9; i++){
      for (var j = 0; j < 9; j++){

        tempNeighbours = this.getRelevantNeighbours(this.cells[i][j]);
        var availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (var l = availableNumbers.length; l >= 0; l--){
          for (var k = 0; k < tempNeighbours.length; k++){
            if (tempNeighbours[k].getCellVal() == availableNumbers[l]) 
              availableNumbers.splice(l, 1);
          }
        }
        
        var numpos = (Math.floor(Math.random() * availableNumbers.length));
        this.cells[i][j].setVal(availableNumbers[numpos]); 

      }
    }
  }
  */
  createBoard(currentPos){
    var tempNeighbours;
    var posX = Math.floor(currentPos / 9);
    var posY = currentPos % 9;
    
    this.cells[posX][posY].setVal(0); 

    tempNeighbours = this.getRelevantNeighbours(this.cells[posX][posY]);
    var availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    //diff function with tempneighbours and available numbers should be used here
    for (var l = availableNumbers.length; l >= 0; l--){
      for (var k = 0; k < tempNeighbours.length; k++){
        if (tempNeighbours[k].getCellVal() == availableNumbers[l]) 
          availableNumbers.splice(l, 1);
      }
    }
    //diff function with result with previouscell valls should be used here
    for (var l = availableNumbers.length; l >= 0; l--){
      for (var k = 0; k < this.cells[posX][posY].previousCellVals.length; k++){
        if (this.cells[posX][posY].previousCellVals[k] == availableNumbers[l]) 
          availableNumbers.splice(l, 1);
      }
    }

    if (availableNumbers.length == 0)
      this.createBoard(currentPos - 1);
    
    var numpos = (Math.floor(Math.random() * availableNumbers.length));

    //if there are no positions left after this then we go back a cell, clear this cells previous

    this.cells[posX][posY].setVal(availableNumbers[numpos]); 
    this.cells[posX][posY].addPeviousCell();


    //board complete therefore exit loop condition
    if (currentPos < 81)
      soduku.createBoard(currentPos + 1);

  }
}

var soduku = new grid();
soduku.createBoard(0);

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
          soduku.cells[i][j].incrementVal();
      }
      else
        soduku.cells[i][j].setHovered(false);
      
      //soduku.getRelevantNeighbours(soduku.cells[i][j]);
    }
  }
  
}

function valueChecking(){
  textSize(18);
  textAlign(CENTER, CENTER);
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
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