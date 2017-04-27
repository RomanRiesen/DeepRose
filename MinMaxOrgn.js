function Turn(){
this.cardIndex
this.playKnight
this.tookCard
this.score
}

// function MinMaxTurn(player, board, cardIndex, playKnight){
//   if(arguments.length == 2){this.turn = new Turn(0,0,true)}
//   if(arguments.length == 3){this.turn = new Turn(cardIndex, playKnight)}
//   this.score = player.countScore(board)
// }

function AI(player,oponent,depth){
this.player = player
this.oponent = oponent
this.depth = depth



this.minmax = function(board, deck){
  //returns a Turn object//BTW FIXME use the turn object in other places and maybe extend for more cleanliness

}

this.max = function(board, deck){
  var obj = player.checkPossibleMoves(board,deck)
  //    "noPossibleTurnLeft"
  //    "hasToPlayKnight"
  //    "hasToTakeCard"
  //    "hasToTakeCardOrPlayKnight"
  //    "isAbleToPlayNormally"
  var state = obj.state
  var indices = obj.playableIndices
  var knightIndices = obj.playableWithKnightIndices
  var resultArray = []

//    for (var i = 0; i < this.depth; i++) {
      var result = []
      for(var j = 0; j <10;j++){//calculate scores for all possible moves
        var playerCopy = this.player.copy()
        var boardCopy = board.copy()
        var hasToTakeCard = false
        var turn = new Turn()

        if(playerCopy.cards.length < 1 || state === "hasToTakeCard"){
          //this.player.addCard(deck)
          hasToTakeCard = true
        }
        var useKnight = false
        useKnight = i >= 5
        playerCopy.playCard(i,board,deck,useKnight,true)//true -> function is called from an AI

        //calculate score for the taken turn
        var score = playerCopy.countScore(boardCopy)

        if(hasToTakeCard){
          turn.tookCarrd = true
          turn.score = score
        }
      }


      //}
  }
//}
this.min = function(board, deck){

}

// this.takeTurn = function(player, board, deck){
//
// }

this.takeRandomTurn = function(board,deck){//cannot use knights. No chance of getting those reasonable by chance.

  // STATE: the state may be one of the following strings:
  //    "noPossibleTurnLeft"
  //    "hasToPlayKnight"
  //    "hasToTakeCard"
  //    "hasToTakeCardOrPlayKnight"
  //    "isAbleToPlayNormally"
  //
  // playableIndices: array containing exactly what it says

  var n = 0;
  var cardsLength = this.player.cards.length
  //console.log(((cardsLength-this.player.numberOfCards())/cardsLength * (Math.random()+1)));
  if((cardsLength-this.player.numberOfCards())/cardsLength * (Math.random()+1) > 0.5){
    this.player.addCard(deck)
  }
  else{
  while(!(this.player.playCard(Math.floor(Math.random()*5),board,deck) === true)){//When a card is succesfully played, it returns true
    n++
    if(n > 20){//very heuristic. very ugly. (I hope that at this point every card has been tried.)
      if(this.player.addCard(deck) == true){n = 0;return true}
      else{
        if(this.player.checkPossibleMoves(board,deck).playableIndices===[] && cardsLength >= 5){
          return "hasToPass"}
        else{return false}
      }
    }
    }
  }
  return true
}

}
