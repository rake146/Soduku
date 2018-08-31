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
  createBoard(){
    var tempNeighbours;
    /*
    var startPosX = Math.floor(Math.random() * 9);
    var startPosY = Math.floor(Math.random() * 9);

    this.cells[startPosX][startPosY].setVal(Math.floor(Math.random() * 9) + 1);
    this.cells[startPosX][startPosY].setHovered(true);
    */

    //this.cells[0][0].setVal(Math.floor(Math.random() * 9) + 1);
    //this.cells[0][0].setHovered(true);
    //tempNeighbours = this.getRelevantNeighbours(this.cells[0][0]);
    //console.log(tempNeighbours);
    

    var exists = true;
    for (var i = 0; i < 3; i++){
      for (var j = 0; j < 9; j++){

        tempNeighbours = this.getRelevantNeighbours(this.cells[i][j]);

        var availableNumbers = [1, 2, 3, 4, 6, 7, 8, 9];

        for (var k = 0; k < tempNeighbours.length; k++){
          for (var l = 0; l < availableNumbers.length; l++){
            if (tempNeighbours[k].getCellVal() == availableNumbers[l])
              availableNumbers.splice(l, 1);
          }

          this.cells[i][j].setVal(availableNumbers[(Math.random() * availableNumbers.length) + 1]); 
        }
        /*
        exists = true;
        while (exists == true)
        {
          exists = false;
          var randCellVal = Math.floor(Math.random() * 9) + 1;

          for (var k = 0; k < tempNeighbours.length; k++){
            if (tempNeighbours[k].getCellVal() == randCellVal)
              exists = true;
          }

          if (exists == false)
            this.cells[i][j].setVal(randCellVal); 
          
        }
        */
      }
    }

  }
}

var soduku = new grid();
soduku.createBoard();

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