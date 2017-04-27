function Card(dir, mag){//should be flyweight
  this.direction = dir
  this.magnitude = mag
  this.display = function(ctx,x,y,width,height, player){
    ctx.beginPath()
    ctx.fillStyle = player.color
    //ctx.strokeStyle = player.color2
    ctx.strokeStyle = 'rgb(200,200,200)'
    ctx.rect(x,y,width,height)
    ctx.fill()
    //ctx.stroke()
    ctx.beginPath()
    ctx.strokeStyle = player.color2
    var pi = Math.PI
    //var rot = {"N":0,"NO":pi/4,"O":pi/4*2,"SO":pi/4*3,"S":pi/4*4,"SW":pi/4*5,"W":pi/4*6,"NW":pi/4*7}
    var R = 1.95**0.5/2
    var N = 1
    var rot = {"N":[-N,0],"NO":[-R,R],"O":[0,N],"SO":[R,R],"S":[N,0],"SW":[R,-R],"W":[0,-N],"NW":[-R,-R]}
    ctx.translate(x+width*0.5,y+height*0.5)//translate origin to center of cards
    //ctx.rotate(rot[this.direction])//rotate the pointer (sounds like some weird bitshift hack)
    //ctx.scale(1,height/width)
    ctx.lineWidth=window.LINEWIDTH*3
    ctx.moveTo(0,0)
    //ctx.lineTo(0,-width*0.16666*this.magnitude)
    //alternatively use a for loop and move up to three times in the by rot defined direction.
    ctx.lineTo((rot[this.direction][1]*height*this.magnitude)/(6*(height)/width), (rot[this.direction][0]*width*this.magnitude)/(6*width/height))
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.stroke()
    ctx.beginPath()
    ctx.fillStyle = player.color2
    ctx.arc(x+width*0.5,y+height*0.5,height/20,0,2*Math.PI)
    ctx.fill()

    ctx.lineWidth = window.LINEWIDTH*1.5
    ctx.strokeStyle = player.color
    for(var i = 1; i <= 3; i++){
        ctx.beginPath()
        ctx.ellipse(x+width*0.5,y+height*0.5,(width-ctx.lineWidth)/6*i, (height-ctx.lineWidth)/6*i,0,2*Math.PI, false)
        ctx.stroke()
    }
  }

  this.copy = function(){
      var cardCopy = new Card()
      cardCopy.extend(JSON.stringify(this))
      return cardCopy
  }

  this.extend = function (jsonString){
    var obj = JSON.parse(jsonString)
    for (var key in obj) {
        this[key] = obj[key]
    }
  }
}
