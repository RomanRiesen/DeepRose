//colourscheme
function BWScheme(){
    this.player1color1     =    'rgba(0, 0, 0, 1)'
    this.player1color2     =    'rgba(255, 255, 255, 1)'
    this.player2color1     =    'rgba(255, 255, 255, 1)'
    this.player2color2     =    'rgba(0, 0, 0, 1)'
    this.neutralColor      =    'rgba(122, 122, 122, 1)'
    this.backgroundImage   =    "mandalaSpaceyBlur.jpg"
    this.backgroundColor   =    'rgba(255,255,255,0.0)'
    this.fieldColor        =    'rgba(60, 60, 60,0.5)'
    this.fieldBorderColor  =    'rgb(20,20,20)'
    this.crownColor        =    'rgb(255,0,0)'
}

function DefaultScheme(){
    this.player1color1     =    'rgb(240, 130, 0)'
    this.player1color2     =    'rgb(255, 240, 70)'
    this.player2color1     =    'rgb(50, 103, 222)'
    this.player2color2     =    'rgb(0, 209, 255)'
    this.neutralColor      =    'rgba(0, 0, 0, 0.80)'
    this.backgroundImage   =    "mandalaSpaceyBlur.jpg"
    this.backgroundColor   =    'rgba(0,0,0,0.0)'
    this.fieldColor        =    'rgba(60, 60, 60,0.5)'
    this.fieldBorderColor  =    'rgb(20,20,20)'
    this.crownColor        =    'rgb(255,0,0)'
}

function DarkColorScheme(){
    this.player1color2     =    'rgb(0, 250, 0)'
    this.player1color1     =    'rgb(40,40,40)'
    this.player2color2     =    'rgb(50, 200, 255)'
    this.player2color1     =    'rgb(40,40,40)'
    this.neutralColor      =    'rgb(40,40,40)'//'rgba(30, 30, 30, 0.8)'
    this.backgroundImage   =    ""
    this.backgroundColor   =    'rgb(40,40,40)'
    this.fieldColor        =    'rgba(80, 80, 80, 0.53)'
    this.fieldBorderColor  =    'rgba(0,0,0,0)'
    this.crownColor        =    'rgb(255, 0, 90)'
}

function NeonColorScheme(){
    this.player1color2     =    'rgb(0, 191, 0)'
    this.player1color1     =    'rgb(191,0,100)'
    this.player2color2     =    'rgb(191,0,100)'
    this.player2color1     =    'rgb(0, 191, 0)'
    this.neutralColor      =    'rgb(0, 190, 247)'
    this.backgroundImage   =    'mandalaSpaceyBlur.jpg'
    this.backgroundColor   =    'rgba(0,0,0,0.0)'
    this.fieldColor        =    'rgba(255,255,255,0.3)'
    this.fieldBorderColor  =    'rgba(100,100,155,0.4)'//'rgb(20, 120, 150)'
    this.crownColor        =    'rgb(0, 190, 247)'//'rgb(20, 120, 150)'
}



colorSchemeDict = {

"default":new DefaultScheme(),
"dark":new DarkColorScheme(),
//"dark 2":new TronColorScheme(),
"fresh":new NeonColorScheme(),
"black and white":new BWScheme()


}
