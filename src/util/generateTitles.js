const gameTitles = [

    {green: 3, yellow: 3, red: 3},
    {black: 3, red: 3, green: 3},
    {black: 3, red: 3, white: 3},
    {black: 3, yellow: 3, white: 3},
    {green: 3, yellow: 3, white: 3},

    {red: 4, green: 4},
    {yellow: 4, green: 4},
    {black: 4, red: 4},
    {black: 4, white: 4},
    {yellow: 4, white: 4},

    // {yellow: 1},
    // {green: 1},
    // {black: 1},
    // {white: 1},
    // {red: 1},
];


    


export function generateTitles(numPlayers) {
    // Grab n + 1 random titles from gameTitles
    const numTitles = numPlayers + 1;

    let titleIndi = [];
    while (titleIndi.length < numTitles) {
        let randomIndex = Math.floor(Math.random() * gameTitles.length);
        if (titleIndi.indexOf(randomIndex) === -1) {
            titleIndi.push(randomIndex);
        }
    }

    let titles = titleIndi.map(i => gameTitles[i]);

    return titles;
}