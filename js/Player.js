/*
Copyright Roman Riesen 2016-2017

License:
    Do wathever you want. Just keep this comment in this file.
*/

function State(){//Keeps track of the possible states.
    this.hasKnightLeft
    this.playableWithKnightIndices
    this.playableIndices
    this.canDrawCard
}



function Player(color, color2, name, isAi, canvasContext, knightCanvasContext, pointsContext){
    this.color = color
    this.color2 = color2
    this.name = name
    this.maxCards = 5
    this.cards = []
    this.maxKnights = 5
    this.knightCount = this.maxKnights
    this.knightCanvasContext = knightCanvasContext
    this.won = false
    this.cardCanvasContext = canvasContext
    this.pointsCanvasContext = pointsContext
    this.additionalPoints = 0
    this.isAi = isAi
    this.maxHeightToWidth = 2
    this.minHeightToWidth = 2
    this.cardWidth = 0
    this.cardHeight = 0

    this.countScore = function(board){
        //counts the total score of this player.
        var score = 0
        for (var x = 0; x < board.fields.length; x++) {
            for (var y = 0; y < board.fields.length; y++) {
                board.fields[x][y].isCounted = false
            }
        }
        for (var x = 0; x < board.fields.length; x++) {
            for (var y = 0; y < board.fields.length; y++) {
                score+=Math.pow(this.countConnected(x,y,board),2)
            }
        }
        return score+this.additionalPoints
    }

    this.countConnected = function(x,y,board,n=0){
        //counts all the connected fields to the one with the coordinates x,y
        //console.log(x,y)

        if(x > board.size-1 || x < 0 || y > board.size-1 || y < 0){return 0}
        if(board.fields[x][y].isCounted){return 0}
        board.fields[x][y].isCounted = true
        if(board.fields[x][y].owner.name !== this.name){return 0}

        var n1 = this.countConnected(x+1,y,board,n)
        var n2 = this.countConnected(x,y+1,board,n)
        var n3 = this.countConnected(x-1,y,board,n)
        var n4 = this.countConnected(x,y-1,board,n)

        n = n+n1+n2+n3+n4+1//+ 1 for this field itself.

        //console.log("Number of connected tiles: ", n);

        return n
    }

    this.numberOfCards = function(){
        var n = this.cards.length
        for (var i = 0; i <= this.cards.length; i++) {
            if(this.cards[i] == "NaC"){
                n--
            }
        }
        return n
    }

    this.addCard = function(deck){
        for (var i = 0; i <= this.cards.length; i++) {
            if(this.cards[i] == "NaC"){
                this.cards[i] = deck.getTopCard()
                return true
            }
        }
        var s = "Max cards reached!"; //console.log(s);
        return s//false;//FIXME call function here instead, as in displayHand method.
    }

    this.displayHand = function(cardWidth){
        //displays the cards in the cardsCanvas of the player
        var widthPerCard = this.cardCanvasContext.width/(this.cards.length)
        var border = 10//(this.cardCanvasContext.width)/10
        var width = (this.cardCanvasContext.width-(this.cards.length-1)*border)/(this.cards.length)
        this.cardWidth = width
        this.cardHeight = Math.min(Math.max(this.cardCanvasContext.height, this.minHeightToWidth*width), Math.min(this.cardCanvasContext.height, this.maxHeightToWidth*width))
        var y = -(this.cardHeight - this.cardCanvasContext.height)/2

        for (var i = 0; i < this.cards.length; i++) {
            if(this.cards[i] == "NaC"){continue}

            var x = (widthPerCard+border/this.cards.length)*i
            this.cards[i].display(this.cardCanvasContext,x,y,width,this.cardHeight, this)//display initial cards //+2.5 because stroke width.
        }

        this.displayKnights(this.cardHeight, this.cardWidth)
    }

    this.displayKnights = function(height,width){
        //displays knights of the player (who would've guessed, right?)
        var knightWidth = width
        var knightHeight = height
        this.knightCanvasContext.beginPath()
        this.knightCanvasContext.fillStyle = this.color//color2
        this.knightCanvasContext.rect((this.knightCanvasContext.width-knightWidth)/2,(this.knightCanvasContext.height-knightHeight)/2,knightWidth,knightHeight)
        this.knightCanvasContext.fill()
        this.knightCanvasContext.beginPath()
        this.knightCanvasContext.fillStyle = this.color2//color
        // this.knightCanvasContext.lineWidth=5
        // this.knightCanvasContext.arc(knightWidth/2+5,knightHeight/2,20,0,2*Math.PI)
        // this.knightCanvasContext.fill()
        var textHeight = height
        this.knightCanvasContext.font = textHeight+"px Arial";
        var textWidth = this.knightCanvasContext.measureText(this.knightCount).width
        this.knightCanvasContext.fillText(
            this.knightCount,
            this.knightCanvasContext.width/2-(textWidth/2),
            this.knightCanvasContext.height/2+(textHeight/2-0.16*this.cardHeight))
            //this.knightCanvasContext.drawImage(document.getElementById("player2KnightCanvas"),10,10,150,180);
        }

        this.displayPoints = function(board,deck,stroke = true){
            this.pointsCanvasContext.clearRect(-200,-200,1000,1000)
            height = this.cardHeight
            width = this.cardWidth
            var score = this.countScore(board,deck)
            this.pointsCanvasContext.beginPath()
            this.pointsCanvasContext.lineWidth = window.LINEWIDTH
            this.pointsCanvasContext.fillStyle = this.color
            this.pointsCanvasContext.strokeStyle = this.color2
            this.pointsCanvasContext.font = height+"px Arial";
            var textWidth = this.pointsCanvasContext.measureText(score).width
            var textHeight = (width/height)*this.pointsCanvasContext.width
            var maxWidth = this.pointsCanvasContext.width
            var newHeight=height
            while(textWidth > maxWidth -10){//reduce height until it fits. Doable with some maths, but...eh.//FIXME Dreisatz benutzen.
                this.pointsCanvasContext.font = "font-weight light "
                this.pointsCanvasContext.font = (newHeight--)+"px Arial";
                textWidth = this.pointsCanvasContext.measureText(score).width//at most the width of the context.
                textHeight = (width/height)*this.pointsCanvasContext.width
            }

            height = textHeight + (this.pointsCanvasContext.height - textHeight) - 3*window.LINEWIDTH
            this.pointsCanvasContext.fillText(
                score,
                this.pointsCanvasContext.width/2-(textWidth/2),
                this.pointsCanvasContext.height/2+(height/2)-0.16*this.cardHeight)
                if(stroke){
                    this.pointsCanvasContext.strokeText(
                        score,
                        this.pointsCanvasContext.width/2-(textWidth/2),
                        this.pointsCanvasContext.height/2+(height/2)-0.16*this.cardHeight);
                    }
                }

                this.playCard = function(index, board, deck, playKnight, isAI = false){//FIXME clean this mess up.
                    //plays a card, changing board but not the view
                    //FIXME figure out ar reasonable way of returning which of all the cases happened
                    //FIXME check whether has knight left when trying to play a card with a knight.
                    if(this.cards[index] == "NaC"){return "You already played this card."}
                    if(this.cards[index] == undefined){return "This card does not exist."}
                    if(board.remainingStones == 0){var s = "The game has ended!"; console.log(s); return s}
                    var crownPos = board.crownPosition
                    var move = []
                    var moves = {"N":[0,-1],"NO":[1,-1],"O":[1,0],"SO":[1,1],"S":[0,1],"SW":[-1,1],"W":[-1,0],"NW":[-1,-1]}
                    move[0] = moves[this.cards[index].direction][0]*this.cards[index].magnitude
                    move[1] = moves[this.cards[index].direction][1]*this.cards[index].magnitude
                    var newXPos = crownPos.x+move[0]
                    var newYPos = crownPos.y+move[1]
                    if(newXPos >= board.size || newXPos < 0 || newYPos >= board.size || newYPos < 0){/*console.log("Out of range: ", newXPos, newYPos);*/return "Card not playable: Out of range"}
                    var owner = board.fields[newXPos][newYPos].owner
                    if(this.knightCount < 1 && this.playKnight === true){return "Out of knights!"}
                    if(owner === undefined){return false}
                    if(owner.name === this.name && playKnight === true){return("No need for a knight, field is yours already.");}
                    if(owner === "No Player" && playKnight === true){return "No need for a knight field is unoccupied.";}
                    if(owner !== "No Player")//not free
                    {
                        //console.log("Already occupied...")
                        if(owner.name == this.name){//does belong to player
                            //console.log("...by yourself.")
                            return "This field belongs to yourself.";
                        }else{//does not belong to player
                            if(playKnight === true){
                                this.playKnight(newXPos,newYPos,board)
                                //console.log("...but you do not care and sack their estates by using a knight!")
                            } else{
                                //console.log("owner: ",owner,"player: ",this,"...by an enemy!")
                                return "This field is occupied by an enemy use a knight to conquer it.";
                            }
                        }
                    }
                    board.crownPosition = {"x":newXPos,"y":newYPos}
                    board.fields[board.crownPosition.x][board.crownPosition.y].owner = this
                    //only reduce number of stones if no knight was played.
                    if(!playKnight){
                        board.remainingStones--
                    }
                    deck.usedCards.push(this.cards[index])
                    this.cards[index] = "NaC"//Not A Card
                    return true
                }

                this.playTurn = function(turn, board, deck){
                    //plays changes the board and deck according to turn.
                    if(turn.hasToPass === true){return}
                    if(turn.tookCard  === true){this.addCard(deck);return}
                    this.playCard(turn.cardIndex, board, deck, turn.playKnight)
                    return
                }

                this.checkPossibleMoves = function(board,deck){//FIXME use the state object defined in the top part of this file to set the state of the player. might be easier to deal with than all those strings and if cases.
                    //Returns an object: {"state": STATE, "playableIndices": ARRAY}
                    // STATE: the state may be one of the following strings:
                    //    "noPossibleTurnLeft"
                    //    "hasToPlayKnight"
                    //    "hasToTakeCard"
                    //    "hasToTakeCardOrPlayKnight"
                    //    "isAbleToPlayNormally"
                    //
                    // playableIndices:
                    //    array containg the indices of the cards which would be valid to play
                    var boardCopy0 = board.copy()
                    var playerCopy0 = this.copy()
                    var deckCopy0 = deck.copy()
                    var returnObject = {"state":"","playableIndices":[],"playableWithKnightIndices":[]}
                    var playableIndices = []
                    var playableWithKnightIndices = []
                    //deep copy board and player
                    //count how many empty card spots there are.
                    var nacCount = 0

                    for (var i = 0; i < playerCopy0.maxCards; i++) {
                        var boardCopy = boardCopy0.copy()
                        var playerCopy = playerCopy0.copy()
                        var deckCopy = deckCopy0.copy()
                        if(playerCopy.cards[i] === "NaC"){nacCount++; continue}
                        //Add the indices to to each type of "playability" array.
                        var playCardResult = playerCopy.playCard(i,boardCopy,deckCopy, false)
                        if(playCardResult === true){
                            playableIndices.push(i)
                        }

                        console.log(playerCopy.name, "card index: ", i, " : ", playCardResult)
                        //!!! //FIXME //FIXME //FIXME does not work for computer player
                        //!!! //FIXME //FIXME //FIXME does not work for computer player
                        //!!! //FIXME //FIXME //FIXME does not work for computer player
                        if(playCardResult === "This field is occupied by an enemy use a knight to conquer it."){//FIXME TODO !!! FIXME use an object to return the result from player.playCard as well.
                            playableWithKnightIndices.push(i)
                        }
                    }

                    if(nacCount > 0 && playableIndices.length == 0 && playableWithKnightIndices.length > 0 && this.knightCount > 0){
                        //player can only play card with knight -> must use knight.
                        returnObject.state = "hasToPlayKnightOrTakeCard"
                        returnObject.playableWithKnightIndices = playableWithKnightIndices
                        return returnObject
                    }

                    //console.log(playableIndices,playableWithKnightIndices)
                    if(nacCount > 0 && playableIndices.length == 0  && playableWithKnightIndices.length == 0){
                        //no cards playable (even with knight), but still empty card spots left -> player has to take a card or play a knight.
                        returnObject.state = "hasToTakeCard"
                        returnObject.playableIndices = []
                        return returnObject
                    }


                    if(nacCount == 0 && playableIndices.length == 0 && playableWithKnightIndices.length > 0 && this.knightCount > 0){
                        //has no more space for cards, but a knight is still playable.
                        returnObject.state = "hasToPlayKnight"
                        returnObject.playableWithKnightIndices = playableWithKnightIndices
                        return returnObject
                    }

                    if(nacCount >= 0 && playableIndices.length > 0 && this.knightCount > 0){
                        returnObject.state = "isAbleToPlayNormally"
                        returnObject.playableIndices = playableIndices
                        returnObject.playableWithKnightIndices = playableWithKnightIndices
                        return returnObject
                    }

                    if(playableIndices.length > 0){
                        returnObject.state = "isAbleToPlayCardButNotKnight"
                        returnObject.playableIndices = playableIndices
                        returnObject.playableWithKnightIndices = playableWithKnightIndices
                        return returnObject
                    }

                    if(board.remainingStones < 1){
                        returnObject.state = "noPossibleTurnLeft"
                        console.log("NOT ABLE TO PLAY: Out of stones.");
                        return returnObject
                    }

                    if(nacCount == 0 && playableIndices.length == 0 && playableWithKnightIndices.length == 0){
                        //no knight is playable and there are no cards left to play
                        returnObject.state = "noPossibleTurnLeft"
                        console.log("NOT ABLE TO PLAY: No move possible.");
                        return returnObject
                    }

                    if (nacCount == 0 && this.knightCount < 1 && playableWithKnightIndices.length > 0 && playableIndices.length == 0){
                        //would have to play knigth, but has none left
                        returnObject.state = "noPossibleTurnLeft"
                        console.log("NOT ABLE TO PLAY");
                        return returnObject
                    }

                    if(this.nacCount > 0){
                        returnObject.state = "hasToTakeCard"
                        return returnObject
                    }

                    //FIXME PLEASE TODO SOMETIMES THIS SECTION IS REACHED.
                    console.log("ERROR IN MY LOGIC: This should not be displayed. Check previous ifs")
                    returnObject.state = "isAbleToPlayNormally"

                    return returnObject
                }

                this.askWhichCardAlongsideKnight = function(){
                    //asks the player either which card they want to play alongside the knight

                }

                this.askIfUseKnight = function(){
                    //asks the player if he wants to play a knight alongside the card of which the index is given as a parameter

                }

                this.playKnight = function(x,y,board){
                    board.fields[x][y].owner = this
                    this.knightCount--
                }

                this.handleMouseClickOnCards = function(callbackFunction,canvas){
                    console.log(document.getElementById(this.id));
                    var canvas = document.getElementById(this.id)
                    var rect = canvas.getBoundingClientRect()
                    var x = event.clientX - rect.left
                    var fieldSizeX = (canvas.clientWidth/player1.cards.length)
                    var xf = (x/(fieldSizeX+border))
                    var msg = player1.playCard(Math.floor(xf),board)
                    if(msg !== true){alert(msg); falseOnEvent = false}
                    callbackFunction()
                }

                this.handleMouseClickOnKnight = function(callbackFunction){
                    callbackFunction()
                }

                this.handleMouseClickOnStack = function(callbackFunction){
                    this.addCard(deck)
                    callbackFunction()
                }

                this.copy = function(){
                    //returns deepcopy of player object (a.k.a new player object with same values as this)
                    var newPlayer = new Player(this.color, this.color2, this.name, this.cardCanvasContext, this.knightCanvasContext, this.pointsCanvasContext)

                    newPlayer.maxCards = this.maxCards
                    newPlayer.cards = JSON.parse(JSON.stringify(this.cards))
                    newPlayer.knightCount = this.knightCount
                    newPlayer.won = this.won
                    newPlayer.isAi = this.isAi
                    //Do I even need to copy these?
                    newPlayer.additionalPoints = this.additionalPoints
                    newPlayer.maxHeightToWidth = this.maxHeightToWidth
                    newPlayer.minHeightToWidth = this.minHeightToWidth
                    newPlayer.cardWidth = this.cardWidth
                    newPlayer.cardHeight = this.cardHeight

                    return newPlayer
                }

                this.extend = function (jsonString){
                  var obj = JSON.parse(jsonString)
                  for (var key in obj) {
                      this[key] = obj[key]
                      console.log("Set ", key ," to ", obj[key])
                  }
                }
            }
