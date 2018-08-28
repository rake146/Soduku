class cell{
  constructor(positionX, positionY){
    this.positionX = positionX;
    this.positionY = positionY;

    this.val = 0;
  }
}

function setup() {
  // put setup code here
  createCanvas(500, 500);

  var cells = new Array(9);
  for (var i = 0; i < 9; i++)
    cells[i] = new Array(9);

  for (var i = 0; i < 9; i++)
    for (var j = 0; j < 9; j++)
      cells[i][j] = new cell(i, j);

}

function draw() {
  // put drawing code here
  drawGrid(); 
}

function drawGrid() {
  var maxRows = 9;

  for (var i = 0; i < maxRows + 1; i++){
    if (i == 0 || i == maxRows){  // outline for grid
      fill(color(45, 80, 137));
      strokeWeight(3);
    }
    else if (i % 3 == 0)  // outline for 3x3 grids
    {
      fill(color(45, 80, 137));
      strokeWeight(2);
    }
    else{
      fill(color(66, 104, 165));
      strokeWeight(1);
    }

    line(50, 50 + i * 40, 50 + 40 * maxRows, 50 + i * 40);
    line(50 + i * 40, 50, 50 + i * 40, 50 + 40 * maxRows);
  }
}