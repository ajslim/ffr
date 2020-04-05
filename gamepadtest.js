/*
 * Gamepad API Test
 * Written in 2013 by Ted Mielczarek <ted@mielczarek.org>
 *
 * To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
 *
 * You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
 */
let haveEvents = 'GamepadEvent' in window;
let controllers = {};
let rAF = window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.requestAnimationFrame;


const FRONT_FOOT = 2;
const MIDDLE = 13;
const BACK_FOOT = 3;
const FOIL = 8;
const usedButtons = [FRONT_FOOT, MIDDLE, BACK_FOOT, FOIL];

let foilReset = false;

const footworkDefinitionArray = [
    {
        name: 'Step Forward, Step Back',
        steps:  [
            [MIDDLE],
            [FRONT_FOOT],
            [FRONT_FOOT, BACK_FOOT],
            [FRONT_FOOT],
            [MIDDLE]
        ]
    },
    {
        name: 'Step Forward, Hit, Step back',
        steps:  [
            [MIDDLE],
            [FRONT_FOOT],
            [FRONT_FOOT, BACK_FOOT],
            [FRONT_FOOT, BACK_FOOT, FOIL],
            [FRONT_FOOT, BACK_FOOT],
            [FRONT_FOOT],
            [MIDDLE]
        ]
    },
    {
        name: 'Step Forward, Duck, Step Back',
        steps:  [
            [MIDDLE],
            [FRONT_FOOT],
            [FRONT_FOOT, BACK_FOOT],
            [FRONT_FOOT, BACK_FOOT, MIDDLE],
            [FRONT_FOOT,BACK_FOOT],
            [FRONT_FOOT],
            [MIDDLE]
        ]
    },
    {
        name: 'Step Forward, Appel, Step Back',
        steps:  [
            [MIDDLE],
            [FRONT_FOOT],
            [FRONT_FOOT, BACK_FOOT],
            [BACK_FOOT],
            [FRONT_FOOT, BACK_FOOT],
            [FRONT_FOOT],
            [MIDDLE]
        ]
    },
    {
        name: 'Shuffle Step, Hit, Step Back',
        steps:  [
            [MIDDLE],
            [BACK_FOOT],
            [FRONT_FOOT, BACK_FOOT],
            [FRONT_FOOT, BACK_FOOT, FOIL],
            [FRONT_FOOT, BACK_FOOT],
            [FRONT_FOOT],
            [MIDDLE]
        ]
    },
    {
        name: 'Half Step, Hit, Recover',
        steps:  [
            [MIDDLE],
            [FRONT_FOOT],
            [FRONT_FOOT, FOIL],
            [FRONT_FOOT],
            [MIDDLE]
        ]
    },
    {
        name: 'Appel',
        steps:  [
            [MIDDLE],
            [],
            [MIDDLE]
        ]
    },
];

let currentFootwork = footworkDefinitionArray[0];
let stepIndex = 0;
let successCount = 0;
let done = false;
let comboCount = 0;

const successSound = new Audio('success.mp3');
const failSound = new Audio('fail.mp3');
const goodSound = new Audio('good.mp3');

const footworkArray = [];
for (let i = 0; i < 20; i++) {
    const randomFootwork = footworkDefinitionArray[Math.floor(Math.random() * footworkArray.length)];
    if (randomFootwork !== undefined) {
        footworkArray.push(randomFootwork);
    }
}

currentFootwork = footworkArray.shift();

function displayRemainingFootwork() {
    let message = '';
    message += '<div class="currentAction">' + currentFootwork.name + '</div>';
    footworkArray.forEach(footwork => {
        message += '<div class="action">' + footwork.name + '</div>';
    });

    document.getElementById('footworkActions').innerHTML = message;
}

function showTarget() {
    document.getElementById('target').className = 'active';
}

function hideTarget() {
    document.getElementById('target').className = '';
}

function success() {
    successCount +=1;
    stepIndex = 0;

    currentFootwork = footworkArray.shift();

    let randomFootwork = undefined;
    while (randomFootwork === undefined) {
        randomFootwork = footworkDefinitionArray[Math.floor(Math.random() * footworkArray.length)];
    }
    footworkArray.push(randomFootwork)

    comboCount += 1;

    if (comboCount >= 5) {
        successSound.pause();
        successSound.currentTime = 0;
        successSound.play();

        document.getElementById('response').innerHTML = '<div class="success">COMBO ' + comboCount + '!</div>';
    } else {
        goodSound.pause();
        goodSound.currentTime = 0;
        goodSound.play();

        document.getElementById('response').innerHTML = '<div class="good">GOOD</div>';
    }

    displayRemainingFootwork();
}

function fail() {
    stepIndex = 0;
    comboCount = 0;

    failSound.pause();
    failSound.currentTime = 0;
    failSound.play();
    document.getElementById('response').innerHTML = '<div class="fail">MISS!</div>';
}


function connecthandler(e) {
    addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
    displayRemainingFootwork();
    controllers[gamepad.index] = gamepad;
    let d = document.createElement("div");
    d.setAttribute("id", "controller" + gamepad.index);
    d.setAttribute("class", 'log');
    let t = document.createElement("h1");
    t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
    d.appendChild(t);
    let b = document.createElement("div");
    b.className = "buttons";
    for (let i=0; i<gamepad.buttons.length; i++) {
        let e = document.createElement("span");
        e.className = "button";
        //e.id = "b" + i;
        e.innerHTML = i;
        b.appendChild(e);
    }
    d.appendChild(b);
    let a = document.createElement("div");
    a.className = "axes";
    for (i=0; i<gamepad.axes.length; i++) {
        e = document.createElement("progress");
        e.className = "axis";
        //e.id = "a" + i;
        e.setAttribute("max", "2");
        e.setAttribute("value", "1");
        e.innerHTML = i;
        a.appendChild(e);
    }
    d.appendChild(a);
    document.getElementById("start").style.display = "none";
    const log = document.getElementById("log");
    log.appendChild(d);
    rAF(updateStatus);
}

function disconnecthandler(e) {
    removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
    let d = document.getElementById("controller" + gamepad.index);
    document.body.removeChild(d);
    delete controllers[gamepad.index];
}

let lastPressedButtons = [];

function updateStatus() {
    scangamepads();
    for (j in controllers) {
        let controller = controllers[j];
        let d = document.getElementById("controller" + j);
        let buttons = d.getElementsByClassName("button");
        let pressedButtons = [];
        for (let i = 0; i<controller.buttons.length; i++) {
            let b = buttons[i];
            let val = controller.buttons[i];
            let pressed = val == 1.0;
            if (typeof(val) == "object") {
                pressed = val.pressed;
                val = val.value;
            }

            if (i === FOIL) {
                pressed = !pressed;
            }

            let pct = Math.round(val * 100) + "%";
            b.style.backgroundSize = pct + " " + pct;
            if (pressed) {
                if (usedButtons.indexOf(i) > -1) {
                    pressedButtons.push(i);
                }
                b.className = "button pressed";
            } else {
                b.className = "button";
            }
        }


        // Only consider the first instance of the foil going down
        if (foilReset) {
             if (pressedButtons.indexOf(FOIL) > -1) {
                 pressedButtons = pressedButtons.filter(button => button !== FOIL);
             } else {
                 foilReset = false;
             }
        } else {
            if (pressedButtons.indexOf(FOIL) > -1) {
                foilReset = true;
            }
        }



        // Its okay to hit the target whenever you want
        if (JSON.stringify(currentFootwork.steps[stepIndex].sort()) === JSON.stringify(pressedButtons.sort())) {
            stepIndex += 1;
            lastPressedButtons = pressedButtons;

            if (stepIndex < currentFootwork.steps.length) {
                if (currentFootwork.steps[stepIndex].indexOf(FOIL) > -1) {
                    showTarget();
                } else {
                    hideTarget();
                }
            }

            console.log('Yup');
        } else if (pressedButtons.length !== 0 && JSON.stringify(lastPressedButtons.sort()) !== JSON.stringify(pressedButtons.sort())) {
            fail();
            console.log('Reset', lastPressedButtons, pressedButtons);
            lastPressedButtons = pressedButtons;
        }

        if (stepIndex === currentFootwork.steps.length) {
            success()
        }

        let axes = d.getElementsByClassName("axis");
        for (let i=0; i<controller.axes.length; i++) {
            let a = axes[i];
            a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
            a.setAttribute("value", controller.axes[i] + 1);
        }
    }
    rAF(updateStatus);
}

function scangamepads() {
    let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            if (!(gamepads[i].index in controllers)) {
                addgamepad(gamepads[i]);
            } else {
                controllers[gamepads[i].index] = gamepads[i];
            }
        }
    }
}

if (haveEvents) {
    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);
} else {
    setInterval(scangamepads, 500);
}