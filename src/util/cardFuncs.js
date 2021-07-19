// const colors = ['black', 'green', 'red', 'white', 'wild', 'yellow']; // Spread operator puts in alphabetical order
const colors = ['white', 'yellow', 'green', 'red', 'black']; // Card cost

export function getCardFromTier(deck, slot) {
    if (!deck || !deck.cardList || deck.cardList.length === 0) {
        return;
    }

    const card = deck.cardList.filter(c => c.slot === slot)[0];
    return card;
}

export function getColor(identifier) {
    // Get opposite of color string or index
    const colors = ['white', 'yellow', 'green', 'red', 'black']; // blue is now yellow
    if (identifier === 'blue') {
        return 'yellow';
    } else if (typeof identifier === 'number') {
        return colors[identifier];
    }
}

export function analyzeCard(player, card) {
    // Can player buy card? How many coins do they need?
    if (!player || !card || !card.cost) {
        console.log('[analyzeCard] no player/card/cost');
        return;
    }
    let canBuy = true;
    let coinCost = {};
    let remainingWilds = player.bank.wild;

    // Loop through each color
    for (var i=0; i<5; i++) {
        const color = colors[i];
        const cost = card.cost[color];
        if (!cost) {
            continue;
        }

        const cardCount = player.cardCount[color];
        if (cost > cardCount) {
            const coinAmount = player.bank[color];
            if (cost > cardCount + coinAmount + remainingWilds) { // Can't buy, not enough wilds
                canBuy = false;
                break;
            } else if (cost > cardCount + coinAmount) { // Can buy with wilds
                // Increase wild cost, decrease remainingWilds
                const wildsRequired = cost - cardCount - coinAmount;
                remainingWilds -= wildsRequired;
                coinCost.wild = wildsRequired;
                coinCost[color] = cost - cardCount - wildsRequired;
            } else { // Can buy with coins
                coinCost[color] = cost - cardCount;
            }
        }
    }

    if (remainingWilds < 0) {
        canBuy = false;
    }    

    return {
        canBuy,
        coinCost,
        isReserved: player.reserves.filter(c => c.id === card.id).length,
    };
}

export function drawCard(deck, slot) {
    // Return updated deck after drawing next card into slot
    if (!deck || !slot) {
        return;
    }
    const nextTopIndex = deck.topIndex + 1;
    let newCardList = [...deck.cardList];

    // Remove slot from current card
    const curCardIndex = deck.cardList.findIndex(c => c.slot === slot)
    let curCard = {...deck.cardList[curCardIndex]};
    delete curCard.slot;
    newCardList[curCardIndex] = curCard;
        
    if (nextTopIndex >= deck.cardList.length) {
        console.log('[drawCard] no more cards to draw');
        return {
            topIndex: deck.topIndex,
            cardList: newCardList,
        };
    }

    let nextCard = {...deck.cardList[nextTopIndex]};
    if (nextCard.slot) {
        console.log('[drawCard] should not draw card with slot');
        return {
            topIndex: nextTopIndex,
            cardList: newCardList,
        };
    }
    nextCard.slot = slot; 
    newCardList[nextTopIndex] = nextCard;
    return {
        topIndex: nextTopIndex,
        cardList: newCardList,
    };
};
