const runGame = () => {
    let haveEvents = 'GamepadEvent' in window;
    let controllers = {};
    let rAF = window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.requestAnimationFrame;
    let usedButtons = [BUTTONS.FRONT_FOOT, BUTTONS.MIDDLE, BUTTONS.BACK_FOOT, BUTTONS.FOIL];
    let foilReset = false;
    let spacebarPressed = false;
    let useSpacebar = false;
    let pressedButtons;

    function setkeyboardListeners() {
        window.onkeydown = function (event) {
            if (event.code === 'Space') {
                spacebarPressed = true;
                useSpacebar = true;
            }

            if (event.code === 'Tab') {
                const log = document.getElementById('log');
                if (log.className === 'show') {
                    log.className = '';
                } else {
                    log.className = 'show';
                }
            }
        };
        window.onkeyup = function (event) {
            if (event.code === 'Space') {
                spacebarPressed = false;
            }
        };
    }

    function populateFootworkArray() {
        for (let i = 0; i < 20; i++) {
            const randomFootwork = footworkDefinitionArray[Math.floor(Math.random() * footworkArray.length)];
            if (randomFootwork !== undefined) {
                footworkArray.push(randomFootwork);
            }
        }
        currentFootwork = footworkArray.shift();
    }

    setkeyboardListeners();

    let chanceToScore = false;
    let comboToScore = 5;
    let comboToScoreCount = 0;
    let comboToBeHit = 3;
    let comboToBeHitCount = 0;
    let stepIndex = 0;
    let successCount = 0;
    let done = false;
    let comboCount = 0;
    let actionTime = 5;
    let actionTimeRemaining;
    let failed = false;

    function actionTimer() {
        if (failed === false) {
            if (actionTimeRemaining > 0) {
                actionTimeRemaining -= 1;
            } else {
                actionTimeRunout();
            }

            document.getElementById('actionTimer').innerText = actionTimeRemaining + 1;
        } else {
            document.getElementById('actionTimer').innerText = '';
        }
    }

    let actionTimerInterval;
    function startClock() {
        actionTimeRemaining = actionTime;
        clearInterval(actionTimerInterval);
        actionTimerInterval = setInterval(actionTimer, 1000);
    }

    const successSound = new Audio('success.mp3');
    const failSound = new Audio('fail.mp3');
    const alertSound = new Audio('alert.mp3');
    const goodSound = new Audio('good.mp3');

    const footworkArray = [];
    let currentFootwork;
    populateFootworkArray();


    function displayRemainingFootwork() {
        let message = '';

        if (currentFootwork.scoring === true) {
            message += '<div class="currentAction scoring">' + currentFootwork.name + '</div>';
        } else {
            message += '<div class="currentAction">' + currentFootwork.name + '</div>';
        }

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

    function actionTimeRunout() {
        fail();
    }

    function getRandomFootwork() {
        let randomFootwork = undefined;
        while (randomFootwork === undefined) {
            randomFootwork = footworkDefinitionArray[Math.floor(Math.random() * footworkArray.length)];
        }
        return randomFootwork;
    }

    function getRandomScoringFootwork() {
        let randomFootwork = undefined;
        while (randomFootwork === undefined) {
            randomFootwork = scoringDefinitionArray[Math.floor(Math.random() * footworkArray.length)];
        }
        return randomFootwork;
    }

    function nextAction() {
        startClock();
        stepIndex = 0;
        failed = false;

        if (comboToScore === comboToScoreCount) {
            comboToScoreCount = 0;
            chanceToScore = true;
            alertSound.pause();
            alertSound.currentTime = 0;
            alertSound.play();
            currentFootwork = getRandomScoringFootwork();
        } else {
            currentFootwork = footworkArray.shift();
            let randomFootwork = getRandomFootwork();
            footworkArray.push(randomFootwork);
        }
        displayRemainingFootwork();
    }

    function success() {
        clearInterval(actionTimerInterval);
        successCount += 1;
        comboToScoreCount += 1;
        comboToBeHitCount = 0;

        comboCount += 1;

        if (chanceToScore === true) {
            successSound.pause();
            successSound.currentTime = 0;
            successSound.play();
            chanceToScore = false;

            document.getElementById('response').innerHTML = '<div class="success">SCORE!</div>';
        } else {
            goodSound.pause();
            goodSound.currentTime = 0;
            goodSound.play();

            if (comboCount >= 5) {
                document.getElementById('response').innerHTML = '<div class="success">COMBO ' + comboCount + '!</div>';
            } else {
                document.getElementById('response').innerHTML = '<div class="good">GOOD</div>';
            }
        }


        nextAction();

    }

    function opponentHits() {
        comboToBeHitCount = 0;
        document.getElementById('response').innerHTML = '<div class="fail">You got scored on!</div>';
    }

    function fail() {
        clearInterval(actionTimerInterval);
        stepIndex = 0;
        comboCount = 0;
        comboToScoreCount = 0;
        chanceToScore = false;
        failed = true;

        comboToBeHitCount += 1;

        if (comboToBeHitCount === comboToBeHit) {
            opponentHits();
        }

        document.getElementsByClassName('currentAction')[0].className = 'currentAction fail';
        document.getElementById('actionTimer').innerText = 'X';

        failSound.pause();
        failSound.currentTime = 0;
        failSound.play();
        document.getElementById('response').innerHTML = '<div class="fail">MISS!</div>';




        setTimeout(nextAction, 2000);
    }


    function connectHandler(e) {
        addGamePad(e.gamepad);
    }

    function addGamePad(gamepad) {
        displayRemainingFootwork();
        controllers[gamepad.index] = gamepad;
        let divElement = document.createElement("div");
        divElement.setAttribute("id", "controller" + gamepad.index);
        divElement.setAttribute("class", 'log');
        let headingElement = document.createElement("h1");
        headingElement.appendChild(document.createTextNode("gamepad: " + gamepad.id));
        divElement.appendChild(headingElement);
        let buttons = document.createElement("div");
        buttons.className = "buttons";
        for (let buttonsIndex = 0; buttonsIndex < gamepad.buttons.length; buttonsIndex++) {
            let spanElement = document.createElement("span");
            spanElement.className = "button";
            spanElement.innerHTML = buttonsIndex;
            buttons.appendChild(spanElement);
        }
        divElement.appendChild(buttons);
        let axesDiv = document.createElement("div");
        axesDiv.className = "axes";
        for (let axesIndex = 0; axesIndex < gamepad.axes.length; axesIndex++) {
            let axis = document.createElement("progress");
            axis.className = "axis";
            axis.setAttribute("max", "2");
            axis.setAttribute("value", "1");
            axis.innerHTML = axesIndex;
            axesDiv.appendChild(axis);
        }
        divElement.appendChild(axesDiv);
        document.getElementById("start").style.display = "none";
        const log = document.getElementById("log");
        log.appendChild(divElement);
        rAF(updateStatus);
    }

    function disconnectHandler(e) {
        removegamepad(e.gamepad);
    }

    function removegamepad(gamepad) {
        let d = document.getElementById("controller" + gamepad.index);
        document.body.removeChild(d);
        delete controllers[gamepad.index];
    }

    let lastPressedButtons = [];

    function correctButton(pressedButtons) {


        if (stepIndex < currentFootwork.steps.length) {
            if (currentFootwork.steps[stepIndex].indexOf(BUTTONS.FOIL) > -1) {
                showTarget();
            } else {
                hideTarget();
            }
        }
    }

    function getPressedButtons(controller) {
        let pressedButtons = [];
        for (let buttonsIndex = 0; buttonsIndex < controller.buttons.length; buttonsIndex++) {
            let val = controller.buttons[buttonsIndex];
            let pressed = (parseFloat(val) === 1.0);
            if (typeof (val) == "object") {
                pressed = val.pressed;
                val = val.value;
            }

            if (buttonsIndex === BUTTONS.FOIL && useSpacebar === false) {
                pressed = !pressed;
            }

            if (pressed) {
                if (usedButtons.indexOf(buttonsIndex) > -1) {
                    pressedButtons.push(buttonsIndex);
                }
            }
        }

        controller.axes.forEach((axis, index) => {
            if (axis === 1) {
                // add 100 to axes
                pressedButtons.push(i + 100);
            }
        });

        if (useSpacebar && spacebarPressed) {
            pressedButtons.push(BUTTONS.FOIL);
        }

        if (pressedButtons.indexOf(BUTTONS.FRONT_FOOT) > -1) {
            document.getElementById('Top').className = 'pressed';
        } else {
            document.getElementById('Top').className = '';
        }

        if (pressedButtons.indexOf(BUTTONS.MIDDLE) > -1) {
            document.getElementById('Middle').className = 'pressed';
        } else {
            document.getElementById('Middle').className = '';
        }

        if (pressedButtons.indexOf(BUTTONS.BACK_FOOT) > -1) {
            document.getElementById('Bottom').className = 'pressed';
        } else {
            document.getElementById('Bottom').className = '';
        }

        if (pressedButtons.indexOf(BUTTONS.FOIL) > -1) {
            document.getElementById('Foil').className = 'pressed';
        } else {
            document.getElementById('Foil').className = '';
        }

        // Only consider the first instance of the BUTTONS.FOIL going down
        if (foilReset) {
            if (pressedButtons.indexOf(BUTTONS.FOIL) > -1) {
                pressedButtons = pressedButtons.filter(button => button !== BUTTONS.FOIL);
            } else {
                foilReset = false;
            }
        } else {
            if (pressedButtons.indexOf(BUTTONS.FOIL) > -1) {
                foilReset = true;
            }
        }

        return pressedButtons;
    }

    function updateStatus() {
        scanGamePads();
        for (let controllerIndex in controllers) {
            let controller = controllers[controllerIndex];
            pressedButtons = getPressedButtons(controller);

            // Its okay to hit the target whenever you want
            if (JSON.stringify(currentFootwork.steps[stepIndex].sort()) === JSON.stringify(pressedButtons.sort())) {
                stepIndex += 1;
                lastPressedButtons = pressedButtons;
                correctButton(pressedButtons);
            } else if (failed === false && pressedButtons.length !== 0 && JSON.stringify(lastPressedButtons.sort()) !== JSON.stringify(pressedButtons.sort())) {
                fail();
                console.log('Reset', lastPressedButtons, pressedButtons);
                lastPressedButtons = pressedButtons;
            }

            if (stepIndex === currentFootwork.steps.length) {
                success();
            }
        }
        rAF(updateStatus);
    }

    function scanGamePads() {
        let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                if (!(gamepads[i].index in controllers)) {
                    addGamePad(gamepads[i]);
                } else {
                    controllers[gamepads[i].index] = gamepads[i];
                }
            }
        }
    }

    if (haveEvents) {
        window.addEventListener("gamepadconnected", connectHandler);
        window.addEventListener("gamepaddisconnected", disconnectHandler);
    } else {
        setInterval(scanGamePads, 500);
    }
};

runGame();