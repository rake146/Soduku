class grid{
  constructor(){
    this.gridSize = 9;
    this.darkMode = false;

    this.cells = new Array(9);
    for (var i = 0; i < 9; i++)
      this.cells[i] = new Array(9);
    
    for (var i = 0; i < 9; i++)
      for (var j = 0; j < 9; j++)
        this.cells[i][j] = new cell(i, j);

  }

  getCells(i, j){
    return this.cells[i][j];
  }

  getDarkMode(){
    return this.darkMode;
  }

  setDarkMode(mode){
    this.darkMode = mode;
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

  // recursive function
  // backup if there are no valid options
  // finsish successfully if there are avalid options and no remaining cells to mark
  // continue if there are valid options and remaining cells to mark
  createBoard(currentPos, completed){
    var tempNeighbours;
    var posX = Math.floor(currentPos / 9);
    var posY = currentPos % 9;
    
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

    // diff function with tempneighbours and available numbers should be used here
    for (var l = availableNumbers.length; l >= 0; l--){
      for (var k = 0; k < tempNeighbours.length; k++){
        if (tempNeighbours[k].getCellVal() == availableNumbers[l]) 
          availableNumbers.splice(l, 1);
      }
    }

    // diff function with result with previouscell valls should be used here
    for (var l = availableNumbers.length; l >= 0; l--){
      for (var k = 0; k < this.cells[posX][posY].previousCellVals.length; k++){
        if (this.cells[posX][posY].previousCellVals[k] == availableNumbers[l]) {
          availableNumbers.splice(l, 1);
        }
      }
    }

    if (availableNumbers.length == 0 && currentPos <= 78){
      this.cells[posX][posY].clearPreviousCells();
      return this.createBoard(currentPos - 1, completed);
    }
    
    var numpos = (Math.floor(Math.random() * availableNumbers.length));

    // if there are no positions left after this then we go back a cell, clear this cells previous
    this.cells[posX][posY].setVal(availableNumbers[numpos]); 
    this.cells[posX][posY].addPeviousCell();


    // board complete therefore exit loop condition
    if (currentPos == 80){
      return true;
    }
    else{
      return soduku.createBoard(currentPos + 1, completed);
    }
  }

  solveGrid(){
    console.log("GRID SOLVED");
    soduku.createBoard(0, false);
  }

  copyGridState(copiedGrid){
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 9; j++){
          this.cells[i][j].hovered = copiedGrid.cells[i][j].hovered;
          this.cells[i][j].correlated = copiedGrid.cells[i][j].correlated;
          this.cells[i][j].previousCellVals = copiedGrid.cells[i][j].previousCellVals;
          this.cells[i][j].setVal(copiedGrid.cells[i][j].getCellVal());
        }
  }

  isGridStateSolvable(){
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
          
          if (tempBlankCount == blankNumbers.length - 1)
            this.cells[blankNumbers[savedEmptyPos].getCellPosX()][blankNumbers[savedEmptyPos].getCellPosY()].setVal(availableNumbers[m]); 
          
          tempBlankCount = 0;
          savedEmptyPos = 0;

        }
      }

      for (var i = 0; i < 9; i++)
        for (var j = 0; j < 9; j++)
          if (this.cells[i][j].getCellVal() == 0)
             return false;
          

      return true;
  }
  clear(){
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 9; j++){
          this.cells[i][j].setVal(0);
          this.cells[i][j].hovered = false;
          this.cells[i][j].correlated = false;
          this.cells[i][j].clearPreviousCells();
          this.cells[i][j].setPermanent(false);
          this.cells[i][j].setInvalidNumber(false);
        }
  }
  clearSubProperties(){
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 9; j++){
          this.cells[i][j].hovered = false;
          this.cells[i][j].correlated = false;
          this.cells[i][j].clearPreviousCells();
          
        }
  }
  removeUnwantedCell(i, j){
      this.cells[i][j].setVal(0);
      this.cells[i][j].hovered = false;
      this.cells[i][j].correlated = false;
      this.cells[i][j].clearPreviousCells();
  }
  createRandomListOrderOfCells(){
    var array = [];

    for (var i = 0; i < 9; i++){
        for (var j = 0; j < 9; j++){
          array.push(this.cells[i][j])
        }
    }

    var currentIndex = array.length, temporaryValue, randomIndex;

    //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    console.log(array);

    return array;
  }
  returnGridCompleted(){
    for(var i = 0; i < 9; i++){
      for (var j = 0; j < 9; j++){
        if (this.cells[i][j].getCellVal() == 0){
          return false;
        }
      }
    }
    return true;
  }

}