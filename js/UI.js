/*
Copyright 2020 Andrew Blommestyn. All Rights Reserved
andrewblommestyn.com
*/

//root
const root = document.documentElement;

//canvas
const canvas = document.querySelector("#mainCanvas");

//screens
const darkScreen = document.querySelector("#dark-screen");

//menus
const mainMenu = document.querySelector("#main-menu");
const deathMenu = document.querySelector("#death-menu");
const settingsMenu = document.querySelector("#settings-menu");
const howtoMenu = document.querySelector("#how-to-menu");
const pausedMenu = document.querySelector("#paused-menu");

let activeMenu = mainMenu; //holds which menu is open

//text
const scoreHeader = document.querySelector("#score");
const highScoreHeader = document.querySelector("#highscore");

//graphics settings inputs
const graphicsInput = document.querySelector("#graphics-input");
graphicsInput.value = localStorage.getItem("settings-graphics") !== null ? localStorage.getItem("settings-graphics") : -1;

const darkThemeInput = document.querySelector("#dark-theme-input");
darkThemeInput.checked = localStorage.getItem("settings-darkTheme") !== null ? localStorage.getItem("settings-darkTheme") == "true" : false;

const shadowsInput = document.querySelector("#shadows-input");
shadowsInput.checked = localStorage.getItem("settings-shadows") !== null ? localStorage.getItem("settings-shadows") == "true" : true;

//game settings inputs
const difficultyInput = document.querySelector("#difficulty-input");
difficultyInput.value = localStorage.getItem("settings-difficulty") !== null ? localStorage.getItem("settings-difficulty") : 6.5;

//settings local variables
let graphicsSettings = graphicsInput.value;
let darkThemeSettings = darkThemeInput.checked;
updateStyle();
let difficultySettings = difficultyInput.value;
let shadowsSettings = shadowsInput.checked;



//animations
function darken() { //darkens screen
	darkScreen.classList.remove("brighten");
	darkScreen.classList.add("darken");
}

function brighten() { //brightens screen if it was darkened
	darkScreen.classList.remove("darken");
	darkScreen.classList.add("brighten");
}

function animateMenuUp(menu) { //animates a given menu up
	menu.classList.add("go-up");

	//disables all the buttons and inputs of the menu
	menu.querySelectorAll("button, input").forEach(button => {
		button.disabled = true;
	});
}

function animateMenuDown(menu) { //animates a given menu down to be active
	menu.classList.remove("go-up");

	//enables all the buttons and inputs of the menu
	menu.querySelectorAll("button, input").forEach(button => {
		button.disabled = false;
	});
}

function animateMenu(menu) { //shorthand function that takes care of all the animations and activates the given menu
	animateMenuUp(activeMenu);
	animateMenuDown(menu);
	activeMenu = menu;
}

function startGameAnimation() { //starts the canvas, takes care of all the animations
	animateMenuUp(activeMenu);
	activeMenu = canvas;
	brighten();
	start();
}

function endGameAnimation() { //animations for when you die
	if (activeMenu != canvas) { //This shouldn't be true normally. I'm just making sure there isn't multiple menues open
		animateMenuUp(activeMenu);
	}
	animateMenuDown(deathMenu);
	activeMenu = deathMenu;
	darken();
}

function pause() { //animations and operations to pause the game
	if (activeMenu === canvas) {
		window.cancelAnimationFrame(currentAnimation); //stops canvas animations
		animateMenuDown(pausedMenu);
		activeMenu = pausedMenu;
		darken();
	}
}

//buttons

//all of the buttons that go back to main menu
document.querySelectorAll(".main-menu-buttons").forEach((button) => {
	button.addEventListener("click", () => {
		animateMenu(mainMenu)
	});
});

//all the buttons that start the game
document.querySelectorAll(".play-buttons").forEach((button) => {
	button.addEventListener("click", () => {
		startGameAnimation();
	});
});

//main menu buttons
document.querySelector("#settings-button").addEventListener('click', () => {
	animateMenu(settingsMenu);
});

document.querySelector("#how-to-button").addEventListener('click', () => {
	animateMenu(howtoMenu);
});

//pause menu buttons
document.querySelector("#resume").addEventListener("click", () => {
	animateMenuUp(pausedMenu);
	activeMenu = canvas;
	brighten();
	enable();
});

//settings inputs
graphicsInput.addEventListener("input", event => {
	localStorage.setItem("settings-graphics", event.target.value);
	graphicsSettings = event.target.value;
});

shadowsInput.addEventListener("input", event => {
	localStorage.setItem("settings-shadows", event.target.checked);
	shadowsSettings = event.target.checked;
});

darkThemeInput.addEventListener("input", event => {
	localStorage.setItem("settings-darkTheme", event.target.checked);
	darkThemeSettings = event.target.checked;
	updateStyle();
});

difficultyInput.addEventListener("input", event => {
	localStorage.setItem("settings-difficulty", event.target.value);
	difficultySettings = event.target.value;
});

//updates colors to be dark theme or light theme
function updateStyle() {
	if (darkThemeSettings) {
		//dark theme colors
		root.style.setProperty("--background-color", "#0F0F0F");
		root.style.setProperty("--foreground-color", "#FFFFFF");
		root.style.setProperty("--red-color", "#a53737");
	} else {
		//light theme colors
		root.style.setProperty("--background-color", "#FFFFFF");
		root.style.setProperty("--foreground-color", "#000000");
		root.style.setProperty("--red-color", "#f55555");
	}
}


//visibility changes
document.addEventListener("visibilitychange", event => {
	if (document.visibilityState != "visible") { //when you leave the page
		pause();
	}
});

//Upate stores in html
function updateScores() {
	scoreHeader.textContent = `Score: ${score}`;
	if (score > localStorage.getItem("highscore")) { //update highscore
		localStorage.setItem("highscore", score);
	}
	highScoreHeader.textContent = `High Score: ${localStorage.getItem("highscore") || 0}`;
}
