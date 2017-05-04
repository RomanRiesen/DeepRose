/*
Matrix library with deep learning in mind.
This might be the most beautiful peace of javascript I've ever written (at least the most oop one).
*/

//FIXME MOVE TO index.html (not possible atm, because git would be annying):
// use http://gionkunz.github.io/chartist-js/examples.html for a graph at the end of the game with the scores each round.

// oooor maybe this: http://www.chartjs.org/ because I do not see an option for clolours in the former.


class Matrix {
    constructor(m,n){
        //WORKAROUND for non-proper polymorphism in JS:
        //if the first 2 arguments are integers, then instantiate the Matrix by size
        //if the arguments are arrays, then instantiate the Matrix by values and throw an error if one array is too long/short
            this.m = m
            this.n = n
            this.matrixArray = []
            for (var i = 0; i < this.m; i++) {
                this.matrixArray.push([])
                for (var j = 0; j < this.n; j++) {
                    this.matrixArray[i].push(0)
                    if(j === i){this.matrixArray[i][j] = 1}
                }
            }
        
    }
    
    
    get(i,j){return this.matrixArray[i][j]}
    set(i,j,v){this.matrixArray[i][j] = v}
    
    addRow(){}
    addColumn(){}
    
    //add similar function where the neighbours are passed to the arg function?
    forAllElements(fun){//e.g: m.forAllElements(i=>i**2)
        for (var i = 0; i < this.m; i++) {
            for (var j = 0; j < this.n; j++) {
                this.set(i,j, fun(this.get(i,j)))
            }
        }
    }

    //Addition
    static addable(a,b){return true}
    addable(b){Matrix.addable(this,b)}
    static add(a,b, actuallyIsSubtraction = false){//actuallyIsSubtraction is used to save much code-repetition, but makes the actual calculation slower.
        if(actuallyIsSubtraction){
            
        }
        
    }
    add(b){Matrix.add(this, b)}
    
    //Subtraction
    static sub(a,b){Matrix.add(a,b,true)}
    sub(b){Matrix.sub(this, b)}
    

    //Multiplication
    static multiplyable(a,b){}
    multiplyable(b){Matrix.multiplyable(this,b)}
    static multiply(a,b){}
    multiply(b){Matrix.multiply(this, b)}
    
    
}