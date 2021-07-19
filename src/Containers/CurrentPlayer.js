import React, { useContext } from "react";

import Card from "../Components/Card";
import { GameContext } from "../store/GameStateProvider";
import { bankTotal } from "../util/bankUtil";

const colors = ["yellow", "red", "green", "black", "white"];

function CurrentPlayer(props) {
  const gameData = useContext(GameContext);
  if (!gameData) {
    console.log("CurrentPlayer: no gameData");
    return null;
  }
  const { gameState, addToSelection, resetSelection } = gameData;
  const { coinSelection, currentPlayer, phase, players } = gameState;
  if (!players) {
    return null;
  }
  const player = players[currentPlayer];
  if (!player) {
    console.log("CurrentPlayer: no player");
    return null;
  }
  const { bank, cardCount, points, name, reserves } = player;
  if (!bank) {
    console.log("CurrentPlayer: no bank");
    return null;
  }
  const reserveTotal = reserves.length;

  let ownedColors = [...colors];
  if (bank.wild) {
    ownedColors.push("wild");
  }

  let renderedCoins = ownedColors.map((color, i) => {
    const numCoins = bank[color];
    const numCards = cardCount[color] || 0;
    const numSelections = coinSelection.filter((c) => c === color).length;
    let total = numCoins + numCards;
    let id = color === "wild" ? "score_wild" : null;

    let coinClick;
    let coinRightClick;
    let coinClasses = "score_" + color;
    if (phase === "overdraft") {
      // Only clickable if player has more coins than in selection

      if (numCoins > numSelections) {
        coinClick = (e) => {
          e.stopPropagation();
          addToSelection(color);
        };
      }
      coinRightClick = (e) => {
        e.preventDefault();
        resetSelection(color);
      };

      if (numSelections === 1) {
        coinClasses += " selected";
      } else if (numSelections === 2) {
        coinClasses += " doubleSelected";
      }
    }

    return (
      <div id={id} className={coinClasses} key={i} onClick={coinClick} onContextMenu={coinRightClick}>
        <p className="chips_total">{color !== "wild" ? total : ""}</p>
        {color !== "wild" ? (
          <p className="score_cards">
            {numCards} {numCards === 1 ? "Card" : "Cards"}
          </p>
        ) : null}
        <p className="score_chips">
          {numCoins} {numCoins === 1 ? "Coin" : "Coins"}
        </p>
      </div>
    );
  });

  const coinTotal = bankTotal(bank, true);
  const reservedCards = reserves.map((card, i) => {
    // Apply class based on position. <Card> handles whether it's selected
    let cardClass = "card reserved";
    if (reserveTotal === 1 || (reserveTotal === 3 && i === 1)) {
      cardClass += " center";
    } else if (reserveTotal === 2) {
      cardClass += i === 0 ? " right" : " left";
    } else if (reserveTotal === 3) {
      cardClass += i === 0 ? " far_right" : " far_left";
    }

    return <Card key={i} reserved reservedClass={cardClass} card={card} />;
  });

  // const id = "score";
  //   const currentPlayerClassName = "score_" + currentPlayer;

  // Animate changing players after picking up coins
  let classes = "";
  if (phase === "pickup coins") {
    // No animation when more than 10 coins in hand
    if (coinTotal + coinSelection.length < 10) {
      classes += " pickup";
    }
  }

  return (
    <div id="score" className={classes}>
      <div style={{ paddingTop: "20px", color: "white", fontWeight: "600" }}>{name}</div>
      <div className="score_points">
        <p className="number">{points}</p>
        <p>{points === 1 ? "Point" : "Points"}</p>
      </div>
      <div className="chip_count">
        <p className="number">{coinTotal}</p>
        <p>{coinTotal === 1 ? "Chip" : "Chips"}</p>
      </div>
      {renderedCoins}
      {reservedCards}
    </div>
  );
}

export default CurrentPlayer;
