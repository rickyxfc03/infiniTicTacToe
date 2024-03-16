let placed=[]
let available=[{'x': 0, 'y': 0}]
let turn
let color1, color2, color3
let stilltowin
let totForWin

//puts the first coord down and refreshes the state
function initialize(){
    placed=[]
    available=[{'x': 0, 'y': 0}]
    turn = 1
    stilltowin=true
    restorecolors()
    refreshcanvas()
    setblock(0, 0, 'x')
}

//places sign on coord and updates neighbors with a call
function setblock(x, y, sign) {
    ai = availindex(x, y)
    if(ai >= 0){
        placed.push({'x':x, 'y':y, 'sign':sign})
        //console.log("--piazzato-- coord:",x,y)
        available.splice(ai, 1)
        updateNeighbors(x, y)
        refreshcanvas()
        if(stilltowin) wincheck(x,y)
        return true
    }
    else return false
}

//given a coord, it adds to the available list only the coords which are 'empty' near it
function updateNeighbors(x, y){
    for (let i=x-1; i<=x+1; i++){
        for (let j=y-1; j<=y+1; j++){
            let doweadd = true
            for (let p of placed){
                if (p.x == i && p.y == j) doweadd = false
            }
            for (let a of available){
                if (a.x == i && a.y == j) doweadd = false
            }
            if (doweadd)
                available.push({'x':i, 'y':j})
        }
    }
}

//auxiliary functions for checks and stuff
function availindex(x, y){
    return available.findIndex((e) => e.x == x && e.y == y)
}
function placeindex(x, y){
    return placed.findIndex((e) => e.x == x && e.y == y)
}
function getBlock(x, y){
    return placed[placeindex(x, y)]
}

function refreshcanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    smallupdater()
}



let dirlist = [[-1,1],[0,1],[1,1],[-1,0],[0,0],[1,0],[-1,-1],[0,-1],[1,-1]]
//given a point finds a point to which start the winning condition from
function wincheck(x,y){
    let s = getBlock(x,y).sign
    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            diridx = i*3+j
            if(diridx==4) continue
            if (b = getBlock(x+j-1, y-i+1)){
                if (b.sign == s && diridx<4){
                    //console.log("--wincheck-- coord and s:", x, y,s, 'block looked:', b, 'dirinfo:', diridx, dirlist[diridx])
                    wincheck(x+j-1, y-i+1)
                }
                else if (b.sign == s && diridx>4){
                    //console.log("--prestep-- coord: ",x,y,'block: ', b, diridx, dirlist[diridx])
                    winstep(x,y,dirlist[diridx],s,0)
                }
            }
        }
    }
}
//recursive call with accumulator
function winstep(x, y, dir, sign, count){
    b = getBlock(x,y)
    if(b==undefined) return
    if (b.sign == sign){
        count++
        //console.log('--step-- n:',count, 'coords:',x,y, 'other:', sign, dir)
        if (count == totForWin){
            alert('hai vinto')
            //initialize()
            stilltowin = false
            return
        }
        winstep(x+dir[0], y+dir[1], dir, sign, count)
    }
}

canvas = document.getElementById("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
ctx = canvas.getContext('2d')
unit = 30
ctrofscrW = window.innerWidth/2 - unit
ctrofscrH = window.innerHeight/2 - unit

function smallupdater(){
    for(i of available){
        ctx.fillStyle = 'rgba(210, 210, 210, .4)'
        ctx.fillRect(ctrofscrW+ unit*i.x, ctrofscrH+ -unit* i.y, unit, unit)
    }
    for(i of placed){
        if (i.sign == 'x') ctx.fillStyle = color1
        else if (i.sign == 'o') ctx.fillStyle = color2
        else ctx.fillStyle = color3
        ctx.fillRect(ctrofscrW+ unit*i.x, ctrofscrH+ -unit* i.y, unit, unit)
    }
}

//manages user input and steps through turns
window.addEventListener('click', function(event){
    clickedx = Math.floor((event.x-ctrofscrW)/unit)
    clickedy = -Math.floor((event.y-ctrofscrH)/unit)+0 //weird js bullsh
    if (turn==0){
        if(setblock(clickedx, clickedy, 'x')) turn++
    }
    else if (turn==1){
        if(setblock(clickedx, clickedy, 'o')){
            if(players==2) turn=0
            else turn=2
        }
    }
    else{
        if(setblock(clickedx, clickedy, 'A')) turn=0
    }
})

//retrieves colors from session and sets the win length
function restorecolors(){
    let p = sessionStorage.getItem("players");
    (players = JSON.parse(p))
    totForWin=players*(-1)+7
    if(players==2){
        let p2c = sessionStorage.getItem("2playercolors");
        if (p2c != null) ({color1, color2} = JSON.parse(p2c))
    }
    else{
        let p3c = sessionStorage.getItem("3playercolors");
        if (p3c != null) ({color1, color2, color3} = JSON.parse(p3c))
    }
}

function zoom(){
    unit += Math.ceil(unit/6) 
    refreshcanvas()
}
function unzoom(){
    unit -= Math.floor(unit/6)
    refreshcanvas()
}
function movegridup(){
    ctrofscrH += unit
    refreshcanvas()
}
function movegriddown(){
    ctrofscrH -= unit
    refreshcanvas()
}
function movegridleft(){
    ctrofscrW += unit
    refreshcanvas()
}
function movegridright(){
    ctrofscrW -= unit
    refreshcanvas()
}

//manages key presses
window.addEventListener('keydown', function(e){
    if (e.code == 'BracketRight') zoom()
    if (e.code == 'BracketLeft') unzoom()
    if (e.code == 'ArrowUp') movegridup()
    if (e.code == 'ArrowDown') movegriddown()
    if (e.code == 'ArrowLeft') movegridleft()
    if (e.code == 'ArrowRight') movegridright()
    if (e.code == 'KeyR') initialize()
})

initialize()