/*
Copyright Roman Riesen 2016-2017

License:
    Do wathever you want. Just keep this comment in this file.
*/


function Deck(deckCanvasCtx){
  this.directions = ["N","NO","O","SO","S","SW","W","NW"]
  this.cards = []
  this.usedCards = []
  this.deckCanvasCtx = deckCanvasCtx

  //add all permutations to deck:
  for (var i = 0; i < this.directions.length; i++){
    for (var j = 1; j <= 3; j++){
      this.cards.push(new Card(this.directions[i],j))
    }
  }

  this.shuffle = function(player1,player2){
    //add usedCards to cards
    this.cards.push.apply(this.cards, this.usedCards)
    //clean the used cards
    this.usedCards = []
    //shuffle Deck
    var temp,j
    for(var i = 0; i < this.cards.length-1; i++){
      //j ← random integer such that i ≤ j < n
      j = Math.floor(Math.random()*(this.cards.length-i)+i)
      temp = this.cards[i]
      this.cards[i] = this.cards[j]
      this.cards[j] = temp
    }
  }

  this.getTopCard = function(){
    var returnCard = this.cards.pop()
    if(this.cards.length == 0){
      this.shuffle()
      //console.log("Deck got shuffled!");
    }
    return returnCard
  }

  this.displayCardStack = function(player, width, height){
    this.deckCanvasCtx.beginPath()
    this.deckCanvasCtx.fillStyle = player.color //'rgb(250,220,190)'
    var cardWidth = width
    var cardHeight = height
    this.deckCanvasCtx.fillRect(this.deckCanvasCtx.width/2-cardWidth/2,this.deckCanvasCtx.height/2-cardHeight/2,cardWidth,cardHeight)
    this.deckCanvasCtx.beginPath()
    this.deckCanvasCtx.fillStyle = player.color2//'rgb(0,0,0)'
    var textHeight = cardWidth
    this.deckCanvasCtx.font = textHeight+"px Arial"
    var textWidth = this.deckCanvasCtx.measureText(this.cards.length).width
    this.deckCanvasCtx.fillText(
    this.cards.length,
    this.deckCanvasCtx.width/2-(textWidth/1.9),//No clue why -5, but it is centered now.
    this.deckCanvasCtx.height/2+(textHeight/3))//same with -10
  }

  this.copy = function(context){
    //returns new deck
    var deckCopy = new Deck(context)
    for (var i = 0; i < this.cards.length; i++) {
        deckCopy.cards[i] = this.cards[i].copy()
    }
    for (var i = 0; i < this.usedCards.length; i++) {
        if(deckCopy.usedCards[i] === undefined){continue}
        deckCopy.usedCards[i] = this.usedCards[i].copy()//copy not necessary, since cards are only read from anyways
    }
    //deckCopy.cards = JSON.parse(JSON.stringify(this.cards))
    //deckCopy.usedCards = JSON.parse(JSON.stringify(this.usedCards))
    return deckCopy
  }

  this.extend = function (jsonString){
    var obj = JSON.parse(jsonString)
    for (var key in obj) {
        this[key] = obj[key]
        console.log("Set ", key ," to ", obj[key])
    }
  }
}
