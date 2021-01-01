/*
Copyright 2020 Andrew Blommestyn. All Rights Reserved
andrewblommestyn.com
*/

//root
const root = document.documentElement;

//canvas
const canvas = document.querySelector("#mainCanvas");

//menus
let menus = {
	mainMenu: document.querySelector("#main-menu"),
	settingsMenu: document.querySelector("#settings-menu"),
	howtoMenu: document.querySelector("#how-to-menu"),
	aboutMenu: document.querySelector("#about-menu"),
	deathMenu: document.querySelector("#death-menu"),
	pausedMenu: document.querySelector("#paused-menu"),
	activeMenu: document.querySelector("#main-menu")
};

//settings local variables
const settings = {
	graphicsSettings: localStorage.getItem("settings-graphics") !== null ? localStorage.getItem("settings-graphics") : -1,
	darkThemeSettings: localStorage.getItem("settings-darkTheme") !== null ? localStorage.getItem("settings-darkTheme") == "true" : false,
	difficultySettings: localStorage.getItem("settings-difficulty") !== null ? localStorage.getItem("settings-difficulty") : 6.5,
	shadowsSettings: localStorage.getItem("settings-shadows") !== null ? localStorage.getItem("settings-shadows") == "true" : true
}

//update inputs values
document.querySelector("#graphics-input").value = settings.graphicsSettings;
document.querySelector("#dark-theme-input").checked = settings.darkThemeSettings;
document.querySelector("#shadows-input").checked = settings.shadowsSettings;
document.querySelector("#difficulty-input").value = settings.difficultySettings;
updateStyle();

//animations
function darken() { //darkens screen
	const darkScreen = document.querySelector("#dark-screen");
	darkScreen.classList.remove("brighten");
	darkScreen.classList.add("darken");
}

function brighten() { //brightens screen if it was darkened
	const darkScreen = document.querySelector("#dark-screen");
	darkScreen.classList.remove("darken");
	darkScreen.classList.add("brighten");
}

function animateMenuUp(menu) { //animates a given menu up
	menu.classList.add("hide");

	//disables all the buttons and inputs of the menu
	menu.querySelectorAll("button, input").forEach(button => {
		button.disabled = true;
	});
}

function animateMenuDown(menu) { //animates a given menu down to be active
	menu.classList.remove("hide");

	//enables all the buttons and inputs of the menu
	menu.querySelectorAll("button, input").forEach(button => {
		button.disabled = false;
	});
}

function animateMenu(menu) { //shorthand function that takes care of all the animations and activates the given menu
	animateMenuUp(menus.activeMenu);
	animateMenuDown(menu);
	menus.activeMenu = menu;
}

function startGameAnimation() { //starts the canvas, takes care of all the animations
	animateMenuUp(menus.activeMenu);
	menus.activeMenu = canvas;
	brighten();
	start();
}

function endGameAnimation() { //animations for when you die
	if (menus.activeMenu != canvas) { //This shouldn't be true normally. I'm just making sure there isn't multiple menues open
		animateMenuUp(menus.activeMenu);
	}
	animateMenuDown(menus.deathMenu);
	menus.activeMenu = menus.deathMenu;
	darken();
}

function pause() { //animations and operations to pause the game
	if (menus.activeMenu === canvas) {
		window.cancelAnimationFrame(currentAnimation); //stops canvas animations
		animateMenuDown(menus.pausedMenu);
		menus.activeMenu = menus.pausedMenu;
		darken();
	}
}

//buttons

//all of the buttons that go back to main menu
document.querySelectorAll(".main-menu-buttons").forEach((button) => {
	button.addEventListener("click", () => {
		animateMenu(menus.mainMenu)
	});
});

//all the buttons that start the game
document.querySelectorAll(".play-buttons").forEach((button) => {
	button.addEventListener("click", () => {
		startGameAnimation();
	});
});

//main menu buttons
document.querySelector("#settings-button").addEventListener("click", () => {
	animateMenu(menus.settingsMenu);
});

document.querySelector("#how-to-button").addEventListener("click", () => {
	animateMenu(menus.howtoMenu);
});

document.querySelector("#about-button").addEventListener("click", () => {
	animateMenu(menus.aboutMenu);
});

//pause menu buttons
document.querySelector("#resume").addEventListener("click", () => {
	animateMenuUp(menus.pausedMenu);
	menus.activeMenu = canvas;
	brighten();
	enable();
});

//settings inputs
document.querySelector("#graphics-input").addEventListener("input", event => {
	localStorage.setItem("settings-graphics", event.target.value);
	settings.graphicsSettings = event.target.value;
});

document.querySelector("#dark-theme-input").addEventListener("input", event => {
	localStorage.setItem("settings-darkTheme", event.target.checked);
	settings.darkThemeSettings = event.target.checked;
	updateStyle();
});

document.querySelector("#shadows-input").addEventListener("input", event => {
	localStorage.setItem("settings-shadows", event.target.checked);
	settings.shadowsSettings = event.target.checked;
});

document.querySelector("#difficulty-input").addEventListener("input", event => {
	localStorage.setItem("settings-difficulty", event.target.value);
	settings.difficultySettings = event.target.value;
});

//updates colors to be dark theme or light theme
function updateStyle() {
	if (settings.darkThemeSettings) {
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
	document.querySelector("#score").textContent = `Score: ${score}`;
	if (score > localStorage.getItem("highscore")) { //update highscore
		localStorage.setItem("highscore", score);
	}
	document.querySelector("#highscore").textContent = `High Score: ${localStorage.getItem("highscore") || 0}`;
}
