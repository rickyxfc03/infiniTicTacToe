let p2c1 = document.getElementById("2p1")
let p2c2 = document.getElementById("2p2")
let p2b = document.getElementById("2pp")
let p3c1 = document.getElementById("3p1")
let p3c2 = document.getElementById("3p2")
let p3c3 = document.getElementById("3p3")
let p3b = document.getElementById("3pp")

sessionStorage.clear()

p2b.addEventListener("click", function(){
    color1 = p2c1.value
    color2 = p2c2.value
    sessionStorage.setItem("2playercolors", JSON.stringify({color1, color2}));
    sessionStorage.setItem('players', 2)
    window.location.href = 'canvas.html'
})
p3b.addEventListener("click", function(){
    color1 = p3c1.value
    color2 = p3c2.value
    color3 = p3c3.value
    sessionStorage.setItem("3playercolors", JSON.stringify({color1, color2, color3}));
    sessionStorage.setItem('players', 3)
    window.location.href = 'canvas.html'
})

