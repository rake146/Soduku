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
  contains(tile, num){
    var tempNeighbours = this.getRelevantNeighbours(tile);

    for (var i = 0; i < tempNeighbours.length; i++){
      if (tempNeighbours[i].getCellVal() == num)
        return true;
    }

    return false;
  }
  clearFocus(){
    for (var i = 0; i < 9; i++)
      for (var j = 0; j < 9; j++){
        this.cells[i][j].setHovered(false);
        this.cells[i][j].setCorrelated(false);
      }
  }

  //creating a solvable board to check the algorithm -- debugging only
  createFixedBoard(){
    this.cells[0][0].setVal(4);
    this.cells[0][4].setVal(6);
    this.cells[0][8].setVal(2);

    this.cells[1][0].setVal(1);
    this.cells[1][2].setVal(2);
    this.cells[1][3].setVal(3);
    this.cells[1][8].setVal(8);

    this.cells[2][1].setVal(3);
    this.cells[2][5].setVal(9);
    this.cells[2][6].setVal(6);
    this.cells[2][8].setVal(4);

    this.cells[3][2].setVal(3);
    this.cells[3][3].setVal(6);
    this.cells[3][4].setVal(5);
    this.cells[3][6].setVal(2);
    this.cells[3][7].setVal(4);

    this.cells[4][0].setVal(6);
    this.cells[4][1].setVal(8);
    this.cells[4][2].setVal(7);
    this.cells[4][5].setVal(2);

    this.cells[5][1].setVal(5);
    this.cells[5][3].setVal(9);
    this.cells[5][4].setVal(1);
    this.cells[5][7].setVal(6);

    this.cells[6][2].setVal(5);
    this.cells[6][3].setVal(2);
    this.cells[6][6].setVal(7);
    this.cells[6][7].setVal(8);
    this.cells[6][8].setVal(1);

    this.cells[7][0].setVal(7);
    this.cells[7][3].setVal(5);
    this.cells[7][6].setVal(4);
    this.cells[7][8].setVal(9);

    this.cells[8][1].setVal(9);
    this.cells[8][2].setVal(1);
    this.cells[8][5].setVal(3);
    this.cells[8][6].setVal(5);
    this.cells[8][8].setVal(6);
    
  }

  //recursive function
  //backup if there are no valid options
  //finsish successfully if there are avalid options and no remaining cells to mark
  //continue if there are valid options and remaining cells to mark
  createBoard(currentPos, completed){
    //console.log(currentPos);
    var tempNeighbours;
    var posX = Math.floor(currentPos / 9);
    var posY = currentPos % 9;
    //console.log(posX, posY);
    this.cells[posX][posY].setVal(0); 

    tempNeighbours = this.getRelevantNeighbours(this.cells[posX][posY]);

    var availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    let difference = availableNumbers.filter((x) => !tempNeighbours.includes(x.val));

    //console.log(difference);
    /*
    let difference = availableNumbers.filter((x) => !tempNeighbours.includes(x.val));

    var tempb = [];

    for(var i = 0; i < tempNeighbours.length; i++)
      tempb.push(tempNeighbours[i].val);

    //let difference2 = availableNumbers.filter((x) => !tempb.includes(x));

    console.log(difference);

    */
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

    console.log(currentPos);
    if (availableNumbers.length == 0 && currentPos <= 78){
      this.cells[posX][posY].clearPreviousCells();
      return this.createBoard(currentPos - 1, completed);
    }
    
    var numpos = (Math.floor(Math.random() * availableNumbers.length));

    //if there are no positions left after this then we go back a cell, clear this cells previous
    this.cells[posX][posY].setVal(availableNumbers[numpos]); 
    this.cells[posX][posY].addPeviousCell();


    //board complete therefore exit loop condition
    if (currentPos >= 80){
      return true;
    }
    else{
      return soduku.createBoard(currentPos + 1, completed);
    }
  }

  isGridStateSolvable(){
    var gridCopy = this.cells;
     /////////////////
    for (var o = 0; o < 6; o++)
    for (var i = 0; i < 9; i += 3)
      for (var j = 0; j < 9; j += 3)
      {
        var tempNeighbours = this.getRelevantNeighbours(this.cells[i][j]);
      
        var availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var blankNumbers = [];

        for (var l = availableNumbers.length; l >= 0; l--){
          for (var k = 18; k < 27; k++){
            if (tempNeighbours[k].getCellVal() == availableNumbers[l]) 
              availableNumbers.splice(l, 1);
          }
        }

        for (var k = 18; k < 27; k++){
          if (tempNeighbours[k].getCellVal() == 0)
            blankNumbers.push(tempNeighbours[k]);
        }

        var tempBlankCount = 0;
        var savedEmptyPos = 0;

        for (var m = 0; m < availableNumbers.length; m++){
          //looping through the available blank spaces
          for (var n = 0; n < blankNumbers.length; n++){
            if (this.contains(blankNumbers[n], availableNumbers[m]) == true){
              tempBlankCount++;
            }
            else
              savedEmptyPos = n;
          }
        
          if (i == 0 && j == 3){
            console.log(availableNumbers, blankNumbers, tempBlankCount, blankNumbers.length);
           }
          
          if (tempBlankCount == blankNumbers.length - 1){
             this.cells[blankNumbers[savedEmptyPos].getCellPosX()][blankNumbers[savedEmptyPos].getCellPosY()].setVal(availableNumbers[m]); 
             //availableNumbers[savedEmptyPos].setVal(availableNumbers[i]);
          }
          tempBlankCount = 0;
          savedEmptyPos = 0;

        }
        //console.log(availableNumbers);
        //console.log(blankNumbers);
      }

      for (var i = 0; i < 9; i++)
        for (var j = 0; j < 9; j++){
          if (this.cells[i][j].getCellVal() == 0)
            return false;
        }


      return true;
  }

  removeRandomCell(){
      var randX = (Math.floor(Math.random() * 9));
      var randY = (Math.floor(Math.random() * 9));

      this.cells[randX][randY].setVal(0);
  }
}


var soduku = new grid();
var val = soduku.createBoard(0, false);
//soduku.createFixedBoard();

while (soduku.isGridStateSolvable() == true)
  soduku.removeRandomCell();

//var gridSolvable = soduku.isGridStateSolvable();
console.log(gridSolvable);

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