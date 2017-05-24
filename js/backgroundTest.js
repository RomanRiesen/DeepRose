
function createBackground(){
    var canvas = document.getElementById("background")
    var ctx = canvas.getContext("2d")

    ctx.globalCompositeOperation = "xor"

    ctx.filter = "blur(10px)"

    var width = canvas.width
    var height = canvas.height

    var radius = 200

    var maxConcRings = 2
    var radiusDecrease = 1.5

    //ctx.fillStyle = 'rgb(0,0,0)'
    for (var n = 0; n < 200; n++) {
        var h = Math.floor(Math.random()*255)
        var s = 0.6//Math.floor(Math.random()*255)
        var v = 0.4//Math.floor(Math.random()*255)
        var a = Math.floor(Math.random()*255)
        var c = [h,s,v].join()

        var col = ["rgb(0,0,0)", "rgb(255,255,255)"]
        var v = Math.random() <= 0.4 ? col[0] : col[1]
        ctx.fillStyle = v//HSVtoRGB(h,s,v)//
        //console.log(ctx.fillStyle);



        var x = Math.random()*width
        var y =  Math.random()*height
        var rx = Math.random()*radius+100
        var ry = Math.random()*radius+100
        var rot = Math.random()*Math.PI

        //ctx.beginPath()
        //ctx.ellipse(x,y,rx, ry,0,rot, 2*Math.PI)
        //ctx.fill();


        for(var i = 0; i < maxConcRings; i++){
            ctx.beginPath()
            var h = Math.floor(Math.random()*255)
            var s = 0.6//Math.floor(Math.random()*255)
            var v = 0.9//Math.floor(Math.random()*255)
            var a = Math.floor(Math.random()*255)
            var v = Math.random() < 0.5 ? col[0] : col[1]
            ctx.strokeStyle = v//"rgba("+v+")" HSVtoRGB(h,s,v)//
            //console.log(ctx.fillStyle);
            ctx.ellipse(x, y, rx/((radiusDecrease)), ry/(radiusDecrease), rot, 0, 2*Math.PI)
            ctx.stroke()
        }
    }
}
