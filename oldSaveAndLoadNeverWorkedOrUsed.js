 function GameState(board,deck){
this.board = board
this.deck = deck
this.saveNumber = 1
this.maxSaveNumber = 4//FIXME delete previous after this is reached

this.save = function(activePlayer,inactivePlayer){
//save the gamestate
var jsonPlayersAndDeck = JSON.stringify({"activePlayer":activePlayer,"inactivePlayer":inactivePlayer,"deck":deck})
var jsonBoard = JSON.stringify({"board":board})
setCookie("PlayersAndDeck"+this.saveNumber,jsonPlayersAndDeck,1)
setCookie("Board"+this.saveNumber,jsonBoard,1)
console.log("Game saved under cookie "+this.saveNumber);
this.saveNumber++
this.saveNumber %= this.maxSaveNumber+1
}

this.load = function(numberToLoad){
//load a gamestate
console.log("loading gamestate")
var playersAndDeck  = JSON.parse(getCookie("PlayersAndDeck"+numberToLoad))
var active          = playersAndDeck.activePlayer
var inactive        = playersAndDeck.inactivePlayer
var deck            = playersAndDeck.deck
var board           = JSON.parse(getCookie("Board"+numberToLoad)).board

var returnArray = {"board":board,"activePlayer":active,"inactivePlayer":inactive,"deck":deck}
console.log(returnArray)
return returnArray
}

this.loadLast = function(){
  this.load(this.saveNumber-1)
}
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    console.log(cvalue)
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
