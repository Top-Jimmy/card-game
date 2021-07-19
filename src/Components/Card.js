import React, { useContext } from 'react';

import { GameContext } from '../store/GameStateProvider';

const Card = (props) => {
    const { card, reserved, reservedClass } = props;
    const gameData = useContext(GameContext);
    if (!card || !gameData) {
        console.log('[Card] no card or gameData');
        return null;
    }
    const { gameState, setSelectedCard } = gameData;
    const { selectedCard, phase } = gameState;
    if (!phase) {
        console.log('[Card] no phase');
        return null;
    }
    
    const selected = (selectedCard && selectedCard.id) === card.id;
    const cardClick = phase === 'selection' ? (e) => {
        e.stopPropagation();
        setSelectedCard(card);
    } : null;

    const renderCosts = () => {
        let renderedCosts = [];
        Object.keys(card.cost).forEach((color, i) => {
            renderedCosts.push(
                <div key={i} className={'cost_' + color} >
                    <span>{card.cost[color]}</span>
                </div>
            );
        });
        return renderedCosts;
    };

    let cardClass;
    if (reserved && reservedClass) {
        cardClass = reservedClass;
        if (selected) {
            cardClass += ' selected';
        }
    } else {
        cardClass = selected ? "card selected" : "card"
    }

    return (
        <div
            className={cardClass}
            onClick={cardClick}
        >
            <div className="points points_3">{card.points || ''}</div>
            <div className={"type type_" + card.color}></div>
            <div className="cost" >
                {renderCosts()}
            </div>
        </div>
    );
}

export default Card;
