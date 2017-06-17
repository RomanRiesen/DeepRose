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
            this.array = []
            for (var i = 0; i < this.m; i++) {
                this.array.push([])
                for (var j = 0; j < this.n; j++) {
                    this.array[i].push(0)
                    if(j === i){this.array[i][j] = 1}
                }
            }
        }

    //FIXME need proper rounding function, that takes number of decimal places to keep.
    print(round = false){
        m = new Matrix(this.m, this.n)
        if (round) {this.getValuesFromOtherMatrix(m.forAllElements((v)=>{Math.round(v)}))}
        var str = ["\n"]
        for (var i = 0; i < this.m; i++) {
            str.push(this.array[i].join("  "))
            str.push("\n")
        }
        str.push("\n")
        console.log(str.join(""))
    }


    get(i,j){return this.array[i][j]}
    set(i,j,v){this.array[i][j] = v}

    getValuesFromOtherMatrix(m){
        this.n = m.n
        this.m = m.m
        this.array = JSON.parse(JSON.stringify(m.array))
    }

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
    static addable(a,b){return a.m == b.m && a.n == b.n}
    addable(b){Matrix.addable(this,b)}

    static add(a,b, actuallyIsSubtraction = false){//actuallyIsSubtraction is used to save much code-repetition, but makes the actual calculation slower.
        if(!this.addable(a,b)){return undefined}
        var p = actuallyIsSubtraction? -1 : 1//p is either 1 or -1 now, depending on acutallyIsSubtraction (btw I LOVE weak typing!)
        var m = new Matrix(a.m, a.n)
        for (var i = 0; i < a.m; i++) {
            for (var j = 0; j < a.n; j++) {
                m.set(i,j,a.get(i,j)+p*b.get(i,j))
            }
        }
        return m
    }

    add(b){this.getValuesFromOtherMatrix(Matrix.add(this, b))}

    //Subtraction
    static sub(a,b){Matrix.add(a,b,true)}
    sub(b){this.getValuesFromOtherMatrix(Matrix.sub(this, b))}


    //Multiplication
    //FIXME make sure matrix * columnvector and rowvector * Matrix works
    static multiplyable(a,b){return true}
    multiplyable(b){return Matrix.multiplyable(this,b)}

    static multiply(a,b){
        if(!a.multiplyable(b)){return undefined}
        var m = new Matrix(a.m, b.n)
        console.log(m);
        for (var i = 0; i < a.m; i++) {
            for (var k = 0; k < b.n; k++) {
                var sum = 0
                for (var j = 0; j < a.m; j++) {
                    sum += (m.get(i,j) * m.get(k,j))
                }
                m.set(i,k,sum)
            }
        }
        console.log(m);
        return m
    }
    multiply(b){
        this.getValuesFromOtherMatrix(Matrix.multiply(this, b))
    }


    static transpose(a){
        var m = new Matrix(a.n, a.m)
        for (var i = 0; i < a.m; i++) {
            for (var j = 0; j < a.n; j++) {
                m.set(j,i,a.get(i,j))
            }
        }

        return m
    }
    multiply(b){
        this.getValuesFromOtherMatrix(Matrix.transpose(this))
    }



}
