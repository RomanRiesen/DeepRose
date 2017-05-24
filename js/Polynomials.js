//Generates nth order polynomial and its first and second derivation
function Polynomial(n, parameters){
    this.order = n
    this.parameters = parameters
    this.lastValue = 0
    this.valueAt = function(x){
        var value = 0
        for (var i = 0; i < this.order+1; i++){
            var p = this.parameters[i] || 0
            value += p*(x**i)
        }
        this.lastValue = value
        return value
    }
    this.valueOfDerivationAt = function(x,n=1){
        var value = 0
        for (var i = n; i < this.order+1; i++){
            var p = this.parameters[i] || 0
            var exp = (i-n)
            if(exp < 0){exp = 0}
            value +=firstFactorials(i,n)*p*(x**exp)
        }
        this.lastValue = value
        return value
    }
    this.toString = function(){
        var str = ""
        for (var i = 0; i < this.order; i++){
            var exp = ""
            if(i > 0){exp += "*x"}
            if(i > 1){exp += "^"+i}
            var p = this.parameters[i] || 0
            str += ""+p+exp+"+"
        }
        str = str.slice(0,str.length-1)
        return str
    }
}

function firstFactorials(i, n){
    //returns the first n factorials of i
    if(i == 0){return 1}
    if(1 == n){return i}
    return i*firstFactorials(i-1, n-1)
}
