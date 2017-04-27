//colourscheme
function BWScheme(){ 
    this.player1color1     =    'rgba(0, 0, 0, 1)'
    this.player1color2     =    'rgba(255, 255, 255, 1)'
    this.player2color1     =    'rgba(255, 255, 255, 1)'
    this.player2color2     =    'rgba(0, 0, 0, 1)'
    this.neutralColor      =    'rgba(122, 122, 122, 1)'
    this.backgroundImage   =    "mandalaSpaceyBlur.jpg"
    this.backgroundColor   =    'rgba(0,0,0,0.0)'
    this.fieldColor        =    'rgba(60, 60, 60,0.5)'
    this.fieldBorderColor  =    'rgb(20,20,20)'
    this.crownColor        =    'rgb(255,0,0)'
}   

function DefaultScheme(){   
    this.player1color1     =    'rgb(255, 140, 0)'
    this.player1color2     =    'rgb(250, 211, 51)'
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
    this.player1color1     =    'rgb(0, 250, 0)'
    this.player1color2     =    'rgb(0,0,0)'
    this.player2color1     =    'rgb(50, 200, 255)'
    this.player2color2     =    'rgb(0,0,0)'
    this.neutralColor      =    'rgba(80, 80, 80, 1)'
    this.backgroundImage   =    ""
    this.backgroundColor   =    'rgba(0,0,0,0.0)'
    this.fieldColor        =    'rgba(0, 0, 0, 0.53)'
    this.fieldBorderColor  =    'rgb(255,0,0)'
    this.crownColor        =    'rgb(255, 0, 0)'
}   



colorSchemeDict = {

"default":new DefaultScheme(),
"dark":new DarkColorScheme(),
"bw":new BWScheme()

}











