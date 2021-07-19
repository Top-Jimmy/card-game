import { bankTotal } from './bankUtil';

const colors = ['white', 'yellow', 'green', 'red', 'black']; // blue is now yellow

export function enoughCoinsToPickup(selection, bank) {
    if (!bank || !selection) {
        return false;
    }

    // Assuming selection is kosher
    if (selection.length === 3) { // Picking 3
        return true;
    } else if (selection.length === 2 && selection[0] === selection[1]) { // Picking 2 of same color
        return true;
    } 
    // else if (bankTotal(bank) - selection.length === 0) { // Bank is out
    //     return true;
    // }

    // Bank has no more colors to select
    let unSelectedColors = [];
    for (var i = 0; i<5; i++) {
        let color = colors[i];
        if (selection.indexOf(color) === -1 && bank[color]) {
            unSelectedColors.push(color);
        }
    }
    if (unSelectedColors.length === 0) {
        return true;
    }

    return false;
}

export function canAddToSelection(color, bank, selection) { // Trying to pickup coins
    const selectionCount = selection.filter((c) => c === color).length;
    if (bank[color] - selectionCount === 0) {
        console.log('bank has no more ' + color);
        return false;
    }

    if (selection[0] && selection[1] && selection[0] === selection[1]) {
        console.log('already have 2 of same color');
        return false;
    }

    // Trying to get same color
    if (selection.includes(color)) {
        console.log('trying to select 2 of same color (ok)');
        if (selection.length === 2) {
            console.log('trying to select 2 of same color (already have 2 in selection);')
            return false;
        }

        // Bank >= 3
        if (bank[color] - selectionCount < 2) {
            console.log('invalid: not enough in bank to take 2');
            return false;
        }
    }

    if (color === selection[1]) {
        console.log('trying to select 2 of same color (too many)');
        return false;
    }

    // Max of 3
    if (selection.length > 2) {
        console.log('already have 3');
        return false;
    }
    return true;
}

export function canAddToOverdraft(phase, playerBank, coinSelection) { // More than 10 coins in hand
    if (phase !== 'overdraft') {
        console.log('canAddToOverdraft: wrong phase');
        return false;
    }

    // Must have at least 10 in hand (after subtracting ones already added to selection)
    if (bankTotal(playerBank, true) - coinSelection.length <= 10) {
        console.log('canAddToOverdraft: 10 or fewer coins');
        return false;
    }

    return true;
}

export function canBuyTitle(cardCount, titles) {
    let newTitleIndi = [];
    titles.forEach((t, i) => {
        if (t.owned) {
            return;
        }
        let afford = true;
        Object.keys(t).forEach(color => {
            let cost = t[color];
            let cardTotal = cardCount[color];
            if (cost > cardTotal) {
                afford = false;
            }
        });
        
        if (afford) {
            newTitleIndi.push(i);
        }
    });

    return newTitleIndi;
}