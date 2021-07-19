import React, { useContext } from 'react';

import { GameContext } from '../store/GameStateProvider';
import { getCardFromTier } from './../util/cardFuncs';

import Card from './../Components/Card';
import Deck from './../Components/Deck';


const ROW_SLOTS = 4;

// Draw top 4 cards of deck
const CardRow = (props) => {
    const { deckNum } = props;
    const gameData = useContext(GameContext);
    if (!deckNum || !gameData || !gameData.gameState || !gameData.gameState['deck' + deckNum]) {
        return null;
    }
    const deck = gameData.gameState['deck' + deckNum];

    const renderCardSlots = () => {
        let cardSlots = [];
        for(var i=0; i<ROW_SLOTS; i++) {
            let renderedCard = renderCardSlot(i+1)
            cardSlots.push(renderedCard);
        }
        return cardSlots;
    };

    const renderCardSlot = (slotIndex) => {
        return (
            <Card
                key={slotIndex} 
                card={getCardFromTier(deck, slotIndex)}
            />
        );
    };

    return (
        <div className='card_row'>
            <Deck tierDeck={deck}></Deck>
            {renderCardSlots()}
        </div>
    );
}

export default CardRow;