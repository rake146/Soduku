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
      this.permanent = false;
      this.focused = false;
      this.invalidNumber = false;
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
    getFocused(){
      return this.focused;
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
    setInvalidNumber(value){
      this.invalidNumber = value;
    }
    drawSquare(darkMode){
      strokeWeight(1);
      if (this.hovered == true)
        fill(color('rgba(140, 176, 234, 0.9)'));
      else if (this.correlated == true)
        fill(color('rgba(80, 180, 225, 0.4)'));
      else if (this.focused == true)
        fill(color('rgba(244, 66, 80, 0.4)'));
      else if (this.invalidNumber == true)
        fill(color('rgba(244, 0, 0, 0.4)'));
      else{
        if (darkMode == true){
          fill(color(44,44,44));
        }else{
          fill(color(255,255,255));
        }
      }
  
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
    setFocused(focusBool){
      this.focused = focusBool;
    }
    setPermanent(permanentBool){
      this.permanent = permanentBool;
    }
    getPermanent(){
      return this.permanent;
    }
  }