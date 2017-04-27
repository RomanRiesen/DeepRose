/*
Copyright Roman Riesen 2016-2017

License:
    Do wathever you want. Just keep this comment in this file.
*/

function Field(x,y){
  this.x = x
  this.y = y
  this.owner = "No Player"//player.name
  this.isCounted = false //false: to be counted in the countConnected function true ignored in countConnected function.
}

function Board(boardSize, crownColor, fieldColor, fieldBorderColor,backgroundColor){
  //TODO create fields getter for board so each request for an item beyond the array is answered with a field with zero and no player.
  //also create setter, which warns when requested index is outside of bonds.

  this.size = boardSize//number of fields
  this.borderPixels = window.LINEWIDTH*2//borderPixels
  this.fields = []
  this.remainingStones = Math.ceil(boardSize**2/1.56)//52 when boardSize == 9//FIXME SOMETHING decreases this number too quickly. Game ended with only 45 stones played for example.
  this.crownPosition = {"x": Math.floor(this.size/2), "y": Math.floor(this.size/2)}
  this.lastCrownPosition = this.crownPosition
  this.crownColor = crownColor
  this.fieldColor = fieldColor
  this.fieldBorderColor = fieldBorderColor
  this.backgroundColor = backgroundColor

  for (var x = 0; x < this.size; x++){
    this.fields[x] = new Array();
    for (var y = 0; y < this.size; y++){
      this.fields[x][y] = new Field(x,y)
    }
  }

  this.display = function(boardCtx,stonesCtx,player1,player2,deck,activePlayer){//FIXME build myDisplay function in here instead of index.
    fillInBackground(boardCtx,this.backgroundColor)
    fillInBackground(stonesCtx, this.backgroundColor)
    fillInBackground(deck.deckCanvasCtx, this.backgroundColor)
    fillInBackground(player1.cardCanvasContext,this.backgroundColor)
    fillInBackground(player2.cardCanvasContext,this.backgroundColor)
    fillInBackground(player1.knightCanvasContext,this.backgroundColor)
    fillInBackground(player2.knightCanvasContext,this.backgroundColor)
    fillInBackground(player1.pointsCanvasContext,this.backgroundColor)
    fillInBackground(player2.pointsCanvasContext,this.backgroundColor)

    //console.log(this.calculateStoneGridSize(stonesCtx));
    this.stonesObj = this.calculateStoneGridSize(stonesCtx)

    for (var x = 0; x < this.size; x++){
      for (var y = 0; y < this.size; y++){
        this.displayAt(boardCtx,x,y,this.fields[x][y].owner)
      }
    }
    this.displayCrown(boardCtx)
    this.displayStones(stonesCtx, activePlayer)
    player1.displayHand(80)
    player2.displayHand(80)
    player1.displayPoints(board,deck)
    player2.displayPoints(board,deck)
    deck.displayCardStack(activePlayer, player1.cardWidth, player1.cardHeight)
  }

  this.displayStones = function(stonesCtx, activePlayer, stroke = true){
      stonesCtx.fillStyle = activePlayer.color
      var obj = this.stonesObj
      var radius = 10
      var distance = 30
      var minD = 2
      stonesCtx.lineWidth = window.LINEWIDTH
      var n = 0
      var hr = Math.floor(0.5*radius)+1
      var hh = Math.floor(stonesCtx.height/2)
      var hw = Math.floor(stonesCtx.width/2)
      //   for (var i = -hw+radius; i < hw-radius; i+= distance) {
      //       for (var j = -hh+radius; j < hh-radius; j+= distance) {
      for (var i = obj.r*2; i < obj.nx*obj.dx-obj.r; i+= obj.dx) {
          for (var j = obj.r*2; j < obj.ny*obj.dy-obj.r; j+= obj.dy) {
              if(n < this.remainingStones){
                n++
                //console.log(i,j);
                stonesCtx.beginPath()
                stonesCtx.fillStyle = activePlayer.color
                stonesCtx.arc(i,j,obj.r-minD,0,2*Math.PI)
                stonesCtx.fill()
                if(stroke){
                stonesCtx.beginPath()
                stonesCtx.strokeStyle = activePlayer.color2
                stonesCtx.arc(i,j,obj.r-minD,0,2*Math.PI)
                stonesCtx.stroke()
                }
              }
          }
      }
  }

  this.calculateStoneGridSize = function(stonesCtx){
    //returns an object with x, y, r and d, which represent the amount of stones in x and y direction as well as their radius and distance.
    var obj = {"nx":0,"ny":0,"r":8, "dx":15, "dy":15}
    var hToW = stonesCtx.height/stonesCtx.width
    //first calculate nx and ny
    while(obj.nx * obj.ny <= this.remainingStones){
        obj.nx++
        obj.ny = Math.ceil(obj.nx*hToW)
    }
      obj.nx++
      obj.ny++

      obj.r = Math.min(0.5*((stonesCtx.width)/(obj.nx)), 0.5*((stonesCtx.height)/obj.ny))

      var d = obj.r*1

      obj.dx = d
      obj.dy = d

      var restX = stonesCtx.width - (obj.nx*d)
      var restY = stonesCtx.height - (obj.ny*d)

      obj.dx += restX / obj.nx
      obj.dy += restY / obj.ny

      //console.log(obj)
      return obj
    }


  this.displayAt = function(ctx,x,y,player){
     ctx.strokeStyle = this.fieldBorderColor//rgb(0,0,0)
     //var prevStrokeStyle = ctx.strokeStyle
     ctx.lineWidth = window.LINEWIDTH
    if(player !== "No Player" && player !== undefined){
      ctx.fillStyle = player.color
      ctx.strokeStyle = player.color2//'rgb(0,0,0)'
    }else{ctx.fillStyle = this.fieldColor}
    ctx.beginPath()
    var fieldSize = (ctx.width/this.size)-this.borderPixels
    var xs = (ctx.width/this.size)*x+this.borderPixels/2
    var ys = (ctx.height/this.size)*y+this.borderPixels/2
    ctx.rect(xs,ys,fieldSize,fieldSize)
    ctx.fill()
    ctx.stroke()
    //ctx.strokeStyle = prevStrokeStyle
  }

  this.displayCrown = function(ctx){
    var fieldSize = (ctx.width/this.size)-this.borderPixels
    var xs = (ctx.width/this.size)*(this.crownPosition.x+0.5)+this.borderPixels/2-0.5*this.borderPixels//from the edge creation/centring process
    var ys = (ctx.height/this.size)*(this.crownPosition.y+0.5)+this.borderPixels/2-0.5*this.borderPixels
    ctx.lineWidth = window.LINEWIDTH
    ctx.fillStyle = this.crownColor
    ctx.strokeStyle = this.crownColor
    // var n = 10
    // for(var i = 0.0; i < n+1; i++){
    //     ctx.beginPath()
    //     ctx.arc(xs,ys,(((fieldSize/2-ctx.lineWidth)/n)*i),0,2*Math.PI)
    //     ctx.stroke()
    //     }
    ctx.beginPath()
    ctx.arc(xs,ys,(fieldSize/2-window.LINEWIDTH),0,2*Math.PI)
    ctx.fill()
  }


  // this.displayCrown = function(ctx, n = 0){//move crown animated.
  //   var fieldSize = (ctx.width/this.size)-this.borderPixels
  //   console.log(this.crownPosition);
  //   var xs = (ctx.width/this.size)*(this.crownPosition.x+0.5)+this.borderPixels/2-0.5*this.borderPixels//from the edge creation/centring process
  //   var ys = (ctx.height/this.size)*(this.crownPosition.y+0.5)+this.borderPixels/2-0.5*this.borderPixels
  //   ctx.beginPath()
  //   ctx.fillStyle = this.crownColor
  //   ctx.arc(xs,ys,(fieldSize-this.borderPixels)/2,0,2*Math.PI)
  //   ctx.fill()
  //   var speed = 0.01
  //   var currX = this.crownPosition.x, currY = this.crownPosition.y
  //   if(this.crownPosition != this.lastCrownPosition && n < (1/speed)){//if crown position changed, then animate it's path
  //       //FIXME probably have to clear the rectangle before
  //       //this.displayAt(ctx, currX, currY, this.fields[Math.round(currX)][Math.round(currY)].player)
  //       console.log(this.lastCrownPosition);
  //       this.crownPosition.x += (currX - this.lastCrownPosition.x)*speed
  //       this.crownPosition.y += (currY - this.lastCrownPosition.y)*speed
  //       n++
  //       this.displayCrown(ctx, n)
  //       console.log(1/speed, n);
  //   }
  //
  //   this.crownPosition.x = Math.round(this.crownPosition.x)
  //   this.crownPosition.y = Math.round(this.crownPosition.y)
  //   this.lastCrownPosition = this.crownPosition
  //
  // }

  this.setCrownPosition = function(ctx,x,y){
    this.crownPosition = {"x":x,"y":y}
    this.displayCrown(ctx,x,y)
  }

  this.gameHasEnded = function(player1, player2, deck){
    if(this.remainingStones <= 0){
      return true
    }
    player1Nac = 0
    player2Nac = 0
    for (var i = 0; i < player1.maxCards; i++) {
        if(player1.cards[i] == "NaC"){return false}//still is able to draw cards
        if(player2.cards[i] == "NaC"){return false}
    }
    if(player1.checkPossibleMoves(this,deck) === player2.checkPossibleMoves(this, deck) === "noPossibleTurnLeft"){//kind of ugly because expensive
      return true
    }
    return false
  }

  this.copy = function(){
    //returns new board.
    var newBoard = new Board(this.boardSize, this.borderPixels, this.crownColor, this.fieldColor, this.backgroundColor)
    newBoard.fields = JSON.parse(JSON.stringify(this.fields))
    newBoard.remainingStones = this.remainingStones
    newBoard.crownPosition = this.crownPosition
    newBoard.size = this.size
    return newBoard
  }

  this.extend = function (jsonString){
    var obj = JSON.parse(jsonString)
    for (var key in obj) {
        this[key] = obj[key]
        console.log("Set ", key ," to ", obj[key])
    }
  }
}
