/*
Copyright Roman Riesen 2016-2017

License:
Do wathever you want. Just keep this comment in this file.
*/

function Turn(){
    this.cardIndex  = NaN
    this.playKnight = false
    this.tookCard   = false
    this.hasToPass  = false
}


//used to find best parameters for the value of knights, taking cards (and maybe not being able to play)
function Dna(k0, k1, k2, k3, tc0, tc1, tc2, tc3){//FIXME need a better way of implementing dna and mutation and stuff. Need dna factory.
    this.playKnightScoreValues = [k0, k1, k2, k3]
    this.drawCardScoreValues = [tc0, tc1, tc2, tc3]

    this.drawCardPolynom = new Polynomial(3, this.drawCardScoreValues)
    this.playKnightPolynom = new Polynomial(3, this.playKnightScoreValues)

    this.drawCardScore = function(x = board.remainingStones){return this.drawCardPolynom.valueAt(x)}
    this.playKnightScore = function(x = board.remainingStones){return this.playKnightPolynom.valueAt(x)}


    this.maxMutation = [30,10,0.6,0.2,10,2,0.5,0.25]
    this.mutate = function(){
        var c = 0
        for (var i = 0; i < this.playKnightScoreValues.length; i++, c++) {
            this.playKnightScoreValues[i] += Math.random()*this.maxMutation[c]-Math.random()*this.maxMutation[c]
        }

        for (var i = 0; i < this.drawCardScoreValues.length; i++, c++) {//continue with the c
            this.drawCardScoreValues[i] += Math.random()*this.maxMutation[c]-Math.random()*this.maxMutation[c]
        }
        console.log(this.drawCardScoreValues);
    }
}



function Node(v = null){
    this.parentNode = null
    this.value = v
    this.childNodes = []

    this.addChild = function(c){
        n = new Node(c)
        this.childNodes.push(n)
        return n
    }
}

//TODO choose random strategy (aggressive use of knights/ defensive use of knights, taking many cards, only taking the necessary cards etc.)

function AI(player,oponent,depth){
    //FIXME the function that determines the value of a played card
    // should incorporate the amount of neighbouring fieds that belong to the player!!!
    //although it kind of already does this by the nature of how the score is determined.
    this.player = player
    this.startPlayer = player
    this.oponent = oponent
    this.depth = depth
    this.treeNode = new Node()
    this.notAbleToPlayPenalty = -50
    this.dna = new Dna(-55,0, 0.008, 0, 2, 0, 0, 0)
    //this.knightPenalty = this.dna.playKnightScore()//-16//Low, constant penalties (-9) lead to an early waste of knights, leading to a lead for the AI, then the player.
    //penalty should probably increase as the ai has less knights available
    //this.drawCardScore = this.dna.drawCardScore()//2
    //this.strategies = []

    this.__getScore = function(board, player, oponent){
        return player.countScore(board) - oponent.countScore(board)
    }

    this.drawCardTurn = function(){
        var turn = new Turn()
        var playerCopy = player.copy()
        var boardCopy  = board.copy()
        var deckCopy   = deck.copy()
        turn.tookCard  = true//should only add the turn to turns if player is able to take a card
        turn.score = this.__getScore(boardCopy, playerCopy, oponent.copy())
        +this.dna.drawCardScore()//+playerCopy.countScore(boardCopy)
        //console.log("Turn:", turn);
        return turn
    }



    this.playCardTurn = function(index){
        var turn = new Turn()
        var playerCopy = player.copy()
        var boardCopy  = board.copy()
        var deckCopy   = deck.copy()
        turn.cardIndex = index
        turn.playKnight = false
        playerCopy.playCard(turn.cardIndex, boardCopy, deckCopy, turn.playKnight, true)
        turn.score = this.__getScore(boardCopy, playerCopy, oponent.copy())//playerCopy.countScore(boardCopy)
        //console.log("Turn:", turn);
        return turn
    }



    this.playKnightTurn = function(index){
        var turn = new Turn()
        var playerCopy = player.copy()
        var boardCopy  = board.copy()
        var deckCopy   = deck.copy()
        turn.cardIndex = index
        turn.playKnight = true
        playerCopy.playCard(turn.cardIndex, boardCopy, deckCopy, true, true)
        var scoreDif = this.__getScore(boardCopy, playerCopy, oponent.copy())
        turn.score = scoreDif
        +this.dna.playKnightScore()
        -playerCopy.countScore(boardCopy)*0.25//FIXME experimental! !!!! TODO !!!
        //playerCopy.countScore(boardCopy) //*((player.maxKnights+1)-player.knightCount)
        console.log("Knight has a value of "+turn.score+" for the ai.")
        return turn
    }



    this.listAllTurns = function(board, deck, player = this.player, oponent = this.oponent){
        var obj = player.checkPossibleMoves(board,deck)
        //    "noPossibleTurnLeft"
        //    "hasToPlayKnight"
        //    "hasToTakeCard"
        //    "hasToTakeCardOrPlayKnight"
        //    "isAbleToPlayNormally"
        var state = obj.state
        var playableIndices = obj.playableIndices
        var knightIndices = obj.playableWithKnightIndices
        //var currentNode = node !== undefined ? node : new Node()

        var turns = []//turns stored each time the possible moves are evaluated.

        //Then attatch a node for each turn to the currentNode.
        //FIXME player.countScore(boardCopy) counts on the board version on which was not played for some reason.
        //TODO FIXME should I give a penalty for using a knight? Else I might mostly play knights when I can either draw a card or play a knight.
        switch(state){


            //player has to take either a card or play a knight
            case "hasToPlayKnightOrTakeCard":
            turn = this.drawCardTurn()
            turns.push(turn)
            for(var i = 0; i < knightIndices.length; i++){
                turn = this.playKnightTurn(knightIndices[i])
                turns.push(turn)
            }
            break
            //player has to take a card
            case "hasToTakeCard"://FIXME put calculations for drawing a card, playing all without and with knight into a function each.
            turn  = this.drawCardTurn()
            turns.push(turn)
            break


            //player has to play a knight (and is able to)
            case "hasToPlayKnight"://FIXME doesn't seem to be providing a turn
            for(var i = 0; i< knightIndices.length; i++){
                turn = this.playKnightTurn(knightIndices[i])
                turns.push(turn)
            }
            break

            //player is able to do whatever he wants
            case "isAbleToPlayNormally"://FIXME figure out whether can actually draw a card. Create it's own case? "isAbleToPlayButNotDrawCard"?? TODO FIXME
            //FIXME only do this when possible to draw a card (player's nac count  > 0)
            turn = this.drawCardTurn()
            turns.push(turn)
            for (var i = 0; i < playableIndices.length; i++) {
                turn = this.playCardTurn(playableIndices[i])
                turns.push(turn)
            }
            for (var i = 0; i < knightIndices.length; i++) {
                turn = this.playKnightTurn(knightIndices[i])
                turns.push(turn)
            }
            break

            case "isAbleToPlayCardButNotKnight":
            turn = this.drawCardTurn()
            turns.push(turn)
            for (var i = 0; i < playableIndices.length; i++) {
                turn = this.playCardTurn(playableIndices[i])
                turns.push(turn)
            }
            break

            case "noPossibleTurnLeft":
            //if game is over and this player won, add plus infinity to score
            //    if oponent won, then add negative infinity
            var turn = new Turn()
            var playerCopy = player.copy()
            var boardCopy  = board.copy()
            var deckCopy   = deck.copy()
            if(board.gameHasEnded(playerCopy,oponent,deck)){
                playerScore = playerCopy.countScore(board)
                oponentScore = oponent.countScore(board)
                if(playerScore > oponentScore){
                    turn.score = 1/0//To infinity and beyond
                }else{
                    turn.score = -1/0
                }
            }
            //TODO
            //if game is not yet over, but player is only unable to play, give SOME
            //    negative weight to this path.
            else{
                turn.score = playerCopy.countScore(board)+this.notAbleToPlayPenalty
                turn.hasToPass = true
            }
            turns.push(turn)
            break
        }
        //check the original player object if it was able to take cards
        //if the player was actually unable to take a card, this the turns with tookCard === true will be removed.
        if(player.copy().addCard(deck.copy()) !== true){
            for (var i = turns.length-1; i >= 0; i--) {
                if(turn === undefined || turns[i].tookCard === true){//FIXME sometimes turns are undefined and I don't know why
                turns.splice(i, 1)
            }
        }
    }
    //check if the original player has knights left, if not remove the turns where he tries to play a knight
    if(player.knightCount < 1){
        for (var i = turns.length-1; i >= 0; i--) {
            if(turns[i].playKnight === true){//FIXME sometimes turns are undefined and I don't know why
            turns.splice(i, 1)
            console.log("Knight Turn removed");
        }
    }
}
return(turns)
}

this.createStrategyTree = function(board, deck, player = this.player, oponent = this.oponent, node = new Node(null), depth = 5, currDepth = 0, startNode = new Node(null), turns){
    //Create and return a Tree out of nodes
    if(depth == currDepth){
        return node
    }
    if (turns === undefined){
        node = startNode
    }
    var turns = this.listAllTurns(board, deck, player, oponent)
    for (var i = 0; i < turns.length; i++) {
        board2      = board.copy()
        deck2       = deck.copy()
        oponent2    = oponent.copy()
        player2     = player.copy()
        //for all the turns call listAllTurns with the new node and an inversion of player and oponent
        //Play turn by player so the board and deck change.
        this.player.playTurn(turns[i], board2, deck2)
        var n = this.createStrategyTree(board2, deck2, oponent2, player2, node.addChild(turns[i]), depth, currDepth+1, startNode, turns)
        console.log(n.value)
    }
    return startNode
}

this.findBestPathInTree = function(tree){}


this.calculateBestTurnViaTree = function(baord, deck, depth){
    this.createStrategyTree(board, deck, this.player, this.oponent, node = new Node(null), depth = 1)//FIXME WRONG order of parameters
    return best}

    this.takeRandomTurn = function(board,deck){//FIXME "cannot" use knights. No chance of getting those reasonable by chance.

    //   // STATE: the state may be one of the following strings:
    //   //    "noPossibleTurnLeft"
    //   //    "hasToPlayKnight"
    //   //    "hasToTakeCard"
    //   //    "hasToTakeCardOrPlayKnight"
    //   //    "isAbleToPlayNormally"

    var playableIndices = this.player.checkPossibleMoves(board,deck).playableIndices
    if (playableIndices.length === 0){
        //no playable card left -> take a card
        var wasAbleToDrawCard = (this.player.addCard(deck) === true)
        if (!wasAbleToDrawCard){
            //not able to play or take card
            //(without using a knight, which I do not do for now in the takeRandomTurn function)
            return "hasToPass"
        }
    }

    //Randomly draw a card
    var c = Math.random()//*((this.player.maxCards-playableIndices.length)/this.player.maxCards)
    if(c < 0.7){
        if (!(this.player.addCard(deck) === true)){
            return true
        }
    }
    //play random indices until one works, then return true
    v = !(this.player.playCard(chooseFromArray(playableIndices),board,deck) === true)
    return true
}



this.playBestNextTurn = function(board, deck){//FIXME check whether game has ended!
    bestTurn = new Turn()//FIXME Somehow is able to get at end of function without playing. weird.
    bestTurn.score = -1/0//FIXME somehow manage to get into an infinite loop somewhere inside this function (player.js 145 and minmax.js 99)
    turns = this.listAllTurns(board, deck)
    for (var i = 0; i < turns.length; i++) {
        if(bestTurn.score <= turns[i].score){
            bestTurn = turns[i]
        }
    }
    if(bestTurn.hasToPass){
        return
    }
    if(bestTurn.tookCard === true){//FIXME With a value of 2, drawing a card is in the beginning always better than any other move, thus I'll have to check in the listAllTurns function whether I can draw a card.
    this.player.addCard(deck)
    return
}
this.player.playCard(bestTurn.cardIndex, board, deck, bestTurn.playKnight, true )
}
}






function chooseFromArray(arr){
    i = Math.floor(Math.random()*arr.length)
    return arr[i]
}
