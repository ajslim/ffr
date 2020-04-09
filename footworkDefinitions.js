const scoringDefinitionArray = [
    {
        name: 'Step Forward, Hit, Step back',
        scoring: true,
        steps: [
            [BUTTONS.MIDDLE],
            [BUTTONS.FRONT_FOOT],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT, BUTTONS.FOIL],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT],
            [BUTTONS.MIDDLE]
        ]
    },
    {
        name: 'Shuffle, Hit, Step Back',
        scoring: true,
        steps: [
            [BUTTONS.MIDDLE],
            [BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT, BUTTONS.FOIL],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT],
            [BUTTONS.MIDDLE]
        ]
    },
    {
        name: 'Half Step, Hit, Recover',
        scoring: true,
        steps: [
            [BUTTONS.MIDDLE],
            [BUTTONS.FRONT_FOOT],
            [BUTTONS.FRONT_FOOT, BUTTONS.FOIL],
            [BUTTONS.FRONT_FOOT],
            [BUTTONS.MIDDLE]
        ]
    }
];

const footworkDefinitionArray = [
    {
        name: 'Half Step, Recover',
        steps: [
            [BUTTONS.MIDDLE],
            [BUTTONS.FRONT_FOOT],
            [BUTTONS.MIDDLE]
        ]
    },
    {
        name: 'Step Forward, Step Back',
        steps: [
            [BUTTONS.MIDDLE],
            [BUTTONS.FRONT_FOOT],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT],
            [BUTTONS.MIDDLE]
        ]
    },
    {
        name: 'Shuffle, Step Back',
        steps: [
            [BUTTONS.MIDDLE],
            [BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT],
            [BUTTONS.MIDDLE]
        ]
    },
    {
        name: 'Step Forward, Duck, Step Back',
        steps: [
            [BUTTONS.MIDDLE],
            [BUTTONS.FRONT_FOOT],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT, BUTTONS.MIDDLE],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT],
            [BUTTONS.MIDDLE]
        ]
    },
    {
        name: 'Shuffle, Duck, Step Back',
        steps: [
            [BUTTONS.MIDDLE],
            [BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT, BUTTONS.MIDDLE],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT],
            [BUTTONS.MIDDLE]
        ]
    },
    {
        name: 'Step Forward, Appel, Step Back',
        steps: [
            [BUTTONS.MIDDLE],
            [BUTTONS.FRONT_FOOT],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT],
            [BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT, BUTTONS.BACK_FOOT],
            [BUTTONS.FRONT_FOOT],
            [BUTTONS.MIDDLE]
        ]
    },
    {
        name: 'Appel',
        steps: [
            [BUTTONS.MIDDLE],
            [],
            [BUTTONS.MIDDLE]
        ]
    },
];
