const defaultColors = ["white", "green", "black", "yellow", "red"];

// custom_offset: [4, 2, 4, 2, 3] i.e. white offset = 4, green = 2, black = 4, yellow = 2, red = 3

const generateSet = (deckName, points, costPatterns, existingCardsInDeck) => {
  // Return an array of generated cards
  let setList = [];
  for (var i = 0; i < 5; i++) {
    // Draw 1 card per color
    let id = deckName + "_" + (existingCardsInDeck + i);
    let cardCost = {};
    // Loop through patterns, for each add color and amount to card cost
    for (let costIndex = 0; costIndex < costPatterns.length; costIndex++) {
      const pattern = costPatterns[costIndex];
      const { amount, custom_offset, offset } = pattern;

      let this_offset = offset; // Every color uses same offset
      if (!offset && custom_offset) {
        this_offset = custom_offset[i]; // Use offset specific to each color
      }

      let colorIndex = i + this_offset;
      if (colorIndex >= 5) {
        // Wrap
        colorIndex -= 5;
      }
      cardCost[defaultColors[colorIndex]] = amount;
    }

    setList.push({
      id: id,
      color: defaultColors[i],
      points: points,
      cost: cardCost,
    });
  }
  return setList;
};

const generateDeck1 = () => {
  const cardList = []; // 40 cards
  const deckName = "deck1";

  // 1 pointers
  let costPatterns = [{ amount: 4, offset: 1 }];
  cardList.push(...generateSet(deckName, 1, costPatterns, cardList.length));

  // 3 coins
  costPatterns = [{ amount: 3, offset: 3 }]; // 3
  cardList.push(...generateSet(deckName, 0, costPatterns, cardList.length));
  costPatterns = [
    { amount: 2, offset: 4 },
    { amount: 1, offset: 2 },
  ]; // 2, 1
  cardList.push(...generateSet(deckName, 0, costPatterns, cardList.length));

  // 4 coins
  costPatterns = [
    { amount: 1, offset: 1 },
    { amount: 1, offset: 2 },
    { amount: 1, offset: 3 },
    { amount: 1, offset: 4 },
  ]; // 1, 1, 1, 1
  cardList.push(...generateSet(deckName, 0, costPatterns, cardList.length));
  costPatterns = [
    // 2, 2
    // 2 cost colors... white: 2,3  green: 2,3  black: 3,4  blue: 3,4  red: 0,1
    { amount: 2, custom_offset: [2, 2, 3, 3, 0] },
    { amount: 2, custom_offset: [3, 3, 4, 4, 1] },
  ];
  cardList.push(...generateSet(deckName, 0, costPatterns, cardList.length));

  // 5 coins
  costPatterns = [
    { amount: 2, offset: 1 },
    { amount: 1, offset: 2 },
    { amount: 1, offset: 3 },
    { amount: 1, offset: 4 },
  ]; // 2, 1, 1, 1
  cardList.push(...generateSet(deckName, 0, costPatterns, cardList.length));
  costPatterns = [
    { amount: 1, offset: 2 },
    { amount: 2, offset: 1 },
    { amount: 2, offset: 3 },
  ]; // 1, 2, 2
  cardList.push(...generateSet(deckName, 0, costPatterns, cardList.length));
  costPatterns = [
    // 3, 1, 1
    { amount: 3, custom_offset: [0, 2, 2, 3, 3] },
    { amount: 1, custom_offset: [2, 0, 0, 0, 0] },
    { amount: 1, custom_offset: [3, 4, 4, 1, 1] },
  ];
  cardList.push(...generateSet(deckName, 0, costPatterns, cardList.length));
  return cardList;
};

const generateDeck2 = () => {
  const cardList = []; // 30 cards
  const deckName = "deck2";

  let points = 3;
  let costPatterns = [{ amount: 6, offset: 0 }];
  cardList.push(...generateSet(deckName, points, costPatterns, cardList.length));

  points = 2;
  costPatterns = [{ amount: 5, custom_offset: [4, 0, 3, 0, 3] }];
  cardList.push(...generateSet(deckName, points, costPatterns, cardList.length));

  costPatterns = [
    { amount: 5, custom_offset: [4, 2, 4, 2, 3] },
    { amount: 3, custom_offset: [2, 0, 2, 0, 1] },
  ];
  cardList.push(...generateSet(deckName, points, costPatterns, cardList.length));

  costPatterns = [
    { amount: 4, offset: 4 },
    { amount: 2, offset: 2 },
    { amount: 1, offset: 1 },
  ]; // 4, 2, 1
  cardList.push(...generateSet(deckName, points, costPatterns, cardList.length));

  points = 1;
  costPatterns = [
    { amount: 3, offset: 3 },
    { amount: 3, offset: 4 },
    { amount: 2, offset: 0 },
  ]; // 3, 3, 2
  cardList.push(...generateSet(deckName, points, costPatterns, cardList.length));

  costPatterns = [
    // 3, 2, 2
    { amount: 3, custom_offset: [1, 2, 3, 1, 3] },
    // 2 cost colors... white: 2,4  green: 1,4  black: 1,4  blue: 0,3  red: 0,1
    { amount: 2, custom_offset: [2, 1, 1, 0, 0] },
    { amount: 2, custom_offset: [4, 4, 4, 3, 1] },
  ];
  cardList.push(...generateSet(deckName, points, costPatterns, cardList.length));

  return cardList;
};

const generateDeck3 = () => {
  const cardList = []; // 20 cards
  const deckName = "deck3";

  let points = 5;
  let costPatterns = [
    { amount: 7, offset: 2 },
    { amount: 3, offset: 0 },
  ]; // 7, 3
  cardList.push(...generateSet(deckName, points, costPatterns, cardList.length));

  points = 4;
  costPatterns = [{ amount: 7, offset: 2 }]; // 7
  cardList.push(...generateSet(deckName, points, costPatterns, cardList.length));
  costPatterns = [
    { amount: 6, offset: 2 },
    { amount: 3, offset: 4 },
    { amount: 3, offset: 0 },
  ]; // 6, 3, 3
  cardList.push(...generateSet(deckName, points, costPatterns, cardList.length));

  points = 3;
  costPatterns = [
    { amount: 5, offset: 4 },
    { amount: 3, offset: 3 },
    { amount: 3, offset: 2 },
    { amount: 3, offset: 1 },
  ]; // 5, 3, 3, 3
  cardList.push(...generateSet(deckName, points, costPatterns, cardList.length));

  return cardList;
};

function shuffleAndDraw(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  // Set slot value for top 4 cards
  for (var i = 0; i < 4; i++) {
    const card = array[i];
    card.slot = i + 1;
  }

  return array;
}

// function drawFromDeck(deck) {
//     // Draw cards from deck into 4 slots
//     for (var i=0; i<4; i++) { // 3 decks
//         const card = deck[i];
//         card.slot = i + 1;
//     }
//     return deck;
// }

export function generateGameDeck() {
  return {
    deck3: {
      topIndex: 3,
      cardList: shuffleAndDraw(generateDeck3()),
    },
    deck2: {
      topIndex: 3,
      cardList: shuffleAndDraw(generateDeck2()),
    },
    deck1: {
      topIndex: 3,
      cardList: shuffleAndDraw(generateDeck1()),
    },
  };
}
