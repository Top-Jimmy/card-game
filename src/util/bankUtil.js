// const colors = ['white', 'yellow', 'green', 'red', 'black', 'wild'];
// const colors = ['black', 'green', 'red', 'white', 'wild', 'yellow']; // Spread operator puts in alphabetical order

export function generateBank(numPlayers = 2) {
    const numPerColor = numPlayers + 2;
    const colors = ['black', 'green', 'red', 'white', 'yellow'];

    let bank = {};
    colors.forEach(c => bank[c] = numPerColor);
    bank.wild = 6;
    
    return bank;
};

export function updateBank(bank, coinCost, action) {
    let newBank = {...bank};

    if (action === 'buy' || action === 'repay') { // Buying/paying for card
        let short = 0; // Use wilds to cover short total
        Object.keys(coinCost).forEach((color) => {
            const cost = coinCost[color];
            if (cost) {
                const bankAmount = bank[color];
                if (action === 'buy') { // Decrement bank
                    if (bankAmount < cost) {
                        short += cost - bankAmount;
                        newBank[color] = 0;
                    } else {
                        newBank[color] = bankAmount - cost;
                    }
                } else if (action === 'repay') { // Add to bank
                    newBank[color] = newBank[color] + cost;
                    // if (bankAmount < cost) {
                    //     short += cost - bankAmount;
                    //     newBank[color] += bankAmount;
                    // } else {
                    //     newBank[color] += cost;
                    // }
                }
            }
        });
        if (short) {
            console.log('short: ' + short.toString());
            const wilds = newBank.wilds;
            if (short > wilds) {
                console.log('updateBank: short ' + short.toString());
                return;
            } else {
                newBank.wild -= short;
            }
        }
    } else {
        // Picking up coins
        // Add/remove colors from selection to bank
        // Relies on selection being kosher
        const selection = coinCost;
        for (var i = 0; i<selection.length; i++) {
            const colorToAdd = selection[i];
            if (action === 'add') {
                ++newBank[colorToAdd];
            } else if (action === 'remove') {
                --newBank[colorToAdd];
            }
        }
    }

    return newBank;
}

export function bankTotal(bank, isPlayerBank = false) {
	let t = 0;
	t += bank.white;
	t += bank.yellow;
	t += bank.green;
	t += bank.red;
    t += bank.black;
    if (isPlayerBank) {
        t += bank.wild;
    }
	return t;
}

// Does bank have 0 for every color?
export function emptyBank(bank, check_wild = false) {
    if (bank.black) {
        return false;
    } else if (bank.red) {
        return false;
    } else if (bank.green) {
        return false;
    } else if (bank.yellow) {
        return false;
    } else if (bank.white) {
        return false;
    } else if (check_wild && bank.wild) {
        return false;
    }

    return true;
}

export function hasCoinCost(coinCost) {
    // Does array contain anything but 0s?
    for (var i=0; i<coinCost.length; i++) {
        const cost = coinCost[i];
        if (cost) {
            return true;
        }
    }
    return false;
}

