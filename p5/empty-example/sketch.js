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
  drawSquare(){
    strokeWeight(1);
    if (this.hovered == true)
      fill(color('rgba(140, 176, 234, 0.5)'));
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
}

var cells = new Array(9);
for (var i = 0; i < 9; i++)
  cells[i] = new Array(9);

for (var i = 0; i < 9; i++)
  for (var j = 0; j < 9; j++)
    cells[i][j] = new cell(i, j);

console.log(cells);

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
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      if (cells[i][j].isInBounds(mouseX, mouseY) == true){
        cells[i][j].setHovered(true);
        if (mouseIsPressed)
          cells[i][j].incrementVal();
      }
      else
        cells[i][j].setHovered(false);
    }
  }
}

function valueChecking(){
  textSize(20);
  textAlign(CENTER, CENTER);
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      text(cells[i][j].getCellVal(), 50 + 20 + cells[i][j].getCellPosX() * 40, 50 + 20 + cells[i][j].getCellPosY() * 40);
    }
  }
}

function drawGrid() {
  var maxRows = 9;
  
  for (var i = 0; i < 9; i++){
    for (var j = 0; j < 9; j++){
      cells[i][j].drawSquare();
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