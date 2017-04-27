
/*
Copyright Roman Riesen 2016-2017

License:
Do wathever you want. Just keep this comment in this file.
*/
function StorageHandler(){

    this.storedNames = []

    this.save = function(name, stringToSave){
        if (typeof(Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.
            window.localStorage.setItem(name, stringToSave)
            this.storedNames.push(name)
        } else {
            // Sorry! No Web Storage support..
            alert("No web storage support!\nGames will cannot be saved.")
        }
    }


    this.load = function(specificName = undefined){
        var totIt = 1
        if(arguments.length > 1){
            totIt = arguments.length
        }

        var returnArr = []
        for(var j = 0; i < totIt; i++){
            for (var i = 0; i < this.storedNames.length; i++) {
                var name = this.storedNames[i]
                if (specificName !== undefined) {
                    //has a specific request, thus need only to return the requested value
                    if(specificName !== name){continue}
                }
                returnArr.push({key: name, value: window.localStorage.getItem(name)})
            }
        }
        return returnArr
    }
}

function saveGamestate(board, deck, activePlayer, inactivePlayer){
    //saves board, deck, activePlayer, inactivePlayer but gameMode can be figured out by looking at the players.
    var sto = new StorageHandler()
    sto.save(JSON.stringify({"board":board, "deck":deck, "activePlayer":activePlayer, "inactivePlayer":inactivePlayer}))
}


function loadGamestate(){
    //takes board, deck, players and puts the new values in. //FIXME TODO My objects will need an extend function that takes a json string and sets the internal values accordingly. I hope that I'm far enough, that there won't be many changes left.
    var sto = new StorageHandler()
    sto.load()
}
