function changeMode(){
    var element = document.body;
    element.classList.toggle("dark-mode")

    if (document.getElementById("theme").getAttribute("src") == "pics/DarkThemeIcon.png") {
        document.getElementById("theme").src = "pics/sun.png";
    } else {
        document.getElementById("theme").src = "pics/DarkThemeIcon.png";
    }
}