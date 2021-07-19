import React, { useContext } from 'react';

import { GameContext } from '../store/GameStateProvider';

const Titles = (props) => {
    const gameData = useContext(GameContext);
    if (!gameData) {
        return null;
    }
    const { gameState } = gameData;
    const { titles } = gameState;
    if (!titles) {
        return null;
    }

    const renderCosts = (titleCosts) => {
        let renderedCosts = [];
        Object.keys(titleCosts).forEach((color, i) => {
            renderedCosts.push(
                <div key={i} className={'cost_' + color} >
                    <span>{titleCosts[color]}</span>
                </div>
            );
        });
        return renderedCosts;
    };

    let titleClass = "card_special"; // Adjust styles to draw titles of different sizes
    if (titles.length === 5) {
        titleClass += " fiveTitles";
    } else if (titles.length === 4) {
        titleClass += " fourTitles";
    }
    const renderedTitles = titles.filter((t) => !t.owned).map((t, i) => {
        return (
            <div className={titleClass} key={i}>
                <div className="points points_3">3</div>
                <div className="cost">
                    {renderCosts(t)}
                </div>
            </div>
        );
    });


    return (
        <section id="cards_special">
            {renderedTitles}
        </section>
    )
}

export default Titles;