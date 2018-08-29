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
    
    /*
    if (tile.getHovered() == true){
      for(var k = 0; k < 9; k++){
        this.cells[k][tile.getCellPosY()].setCorrelated(true);
        this.cells[tile.getCellPosX()][k].setCorrelated(true);
      }
      
      var quadrantX = tile.getCellPosX() % 3;
      quadrantX = tile.getCellPosX() - quadrantX;
      var quadrantY = tile.getCellPosY() % 3;
      quadrantY = tile.getCellPosY() - quadrantY;

      var quadrantXMax = quadrantX + 3;
      var quadrantYMax = quadrantY + 3;

      for (var i = quadrantX; i < quadrantXMax; i++)
        for (var j = quadrantY; j < quadrantYMax; j++)
          this.cells[i][j].setCorrelated(true);
      
    }
    */

    if (tile.getHovered() == true){
      for(var k = 0; k < 9; k++){
        tempArr.push(this.cells[k][tile.getCellPosY()]);
        tempArr.push(this.cells[tile.getCellPosX()][k]);
      }
      
      var quadrantX = tile.getCellPosX() % 3;
      quadrantX = tile.getCellPosX() - quadrantX;
      var quadrantY = tile.getCellPosY() % 3;
      quadrantY = tile.getCellPosY() - quadrantY;

      var quadrantXMax = quadrantX + 3;
      var quadrantYMax = quadrantY + 3;

      for (var i = quadrantX; i < quadrantXMax; i++)
        for (var j = quadrantY; j < quadrantYMax; j++)
          tempArr.push(this.cells[i][j]);
      
    }

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
    var tempNeighbours = new Array();
    var startPosX = Math.floor(Math.random() * 9);
    var startPosY = Math.floor(Math.random() * 9);

    this.cells[startPosX][startPosY].setVal(Math.floor(Math.random() * 9));
    tempNeighbours = getRelevantNeighbours(this.cells[startPosX][startPosY]);


    for (var i = 0; i < tempNeighbours.length; i++){
      var randomCell = Math.floor(Math.random() * 27);
      
    }

    for (var i = 0; i < 9; i++)
      for (var j = 0; j < 9; j++)
      {
        
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

        console.log(temporaryBoundingArray);

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