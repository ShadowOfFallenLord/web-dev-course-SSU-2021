import '../scss/app.scss';

import { render } from './components/render.js'
import { ConstrolKeys, Commands } from './components/controls.js'
import { isInArray } from './components/utils.js'
import { MenuComponent } from './components/menuComponent.js'

var mainDisplay = document.getElementById('main_disp');

const menuItems = {
    item1: {
        value: "item1",
        isActive: true,
    },
    item2: {
        value: "item2",
        isActive: false,
    },
    item3: {
        value: "item3",
        isActive: true,
    },
};

let menu = new MenuComponent([menuItems.item1, menuItems.item2, menuItems.item3], { element: 'header' }, { element: 'footer' });

menu.items.actions[menuItems.item1.value] = function() {
    alert(menuItems.item1.value);
}
menu.items.actions[menuItems.item2.value] = function() {
    alert(menuItems.item2.value);
}
menu.items.actions[menuItems.item3.value] = function() {
    alert(menuItems.item3.value);
}

function renderMenu() {
    mainDisplay.innerHTML = '';
    let menuElemenet = menu.createElement();
    let menuHtml = render(menuElemenet);
    mainDisplay.appendChild(menuHtml);
}

function action(command) {
    console.log(command);
    menu.executeCommand(command);
    renderMenu();
}

renderMenu();

document.getElementById('button_up').addEventListener("click", function() {
    action(Commands.Up);
});

document.getElementById('button_right').addEventListener("click", function() {
    action(Commands.Right);
});

document.getElementById('button_down').addEventListener("click", function() {
    action(Commands.Down);
});

document.getElementById('button_left').addEventListener("click", function() {
    action(Commands.Left);
});

document.getElementById('button_use').addEventListener("click", function() {
    action(Commands.Use);
});

document.getElementById('button_back').addEventListener("click", function() {
    action(Commands.Back);
});

document.addEventListener('keydown', function(e) {
    const currentKey = e.code;

    if (isInArray(currentKey, ConstrolKeys.Up)) {
        action(Commands.Up);
    } else if (isInArray(currentKey, ConstrolKeys.Right)) {
        action(Commands.Right);
    } else if (isInArray(currentKey, ConstrolKeys.Down)) {
        action(Commands.Down);
    } else if (isInArray(currentKey, ConstrolKeys.Left)) {
        action(Commands.Left);
    } else if (isInArray(currentKey, ConstrolKeys.Use)) {
        action(Commands.Use);
    } else if (isInArray(currentKey, ConstrolKeys.Back)) {
        action(Commands.Back);
    }
});

import './demo.js';