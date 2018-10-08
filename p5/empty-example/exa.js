class Num{
    constructor(numParam){
        this.number = numParam;
    }
    clone(){
        return new Num(this.number);
    }
    incrementNum(){
        this.number++;
    }
}

var num1 = new Num(5);
num1.incrementNum();

var num3 = num1.clone();

console.log(num1); //Outputs 6 as expected

//let num2 = jQuery.extend(true, {}, num1);

//let num2 = { ...num1 };

//console.log(num2);
num3.incrementNum();    //This function does not exist


console.log(num1);
console.log(num3);