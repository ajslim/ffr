const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

let BUTTONS = {
    FRONT_FOOT: 2,
    MIDDLE: 13,
    BACK_FOOT: 3,
    FOIL: 8,
};

if (isMac) {
    BUTTONS = {
        FRONT_FOOT: 3,
        MIDDLE: 102,
        BACK_FOOT: 0,
        FOIL: 8,
    };
}