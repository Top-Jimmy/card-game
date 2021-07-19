import React, { useContext } from "react";

import { GameContext } from "../store/GameStateProvider";
import { enoughCoinsToPickup } from "../util/validation";
import { analyzeCard } from "../util/cardFuncs";
import { bankTotal } from "../util/bankUtil";

const Actions = (props) => {
  const gameData = useContext(GameContext);
  if (!gameData) {
    return null;
  }
  const { gameState, endTurn } = gameData;
  const { coinSelection, selectedCard, currentPlayer, phase, players } = gameState;
  if (!players) {
    return null;
  }
  const player = players[currentPlayer];

  let actions = [];
  if (phase === "selection" && coinSelection.length && enoughCoinsToPickup(coinSelection, gameState.bank)) {
    // Pickup Coins
    const pickupOnclick = (e) => {
      e.stopPropagation();
      endTurn("pickup");
    };
    actions.push(
      <button key="0" style={{ lineHeight: "44px", minWidth: "90px" }} onClick={pickupOnclick}>
        End Turn
      </button>
    );
  } else if (selectedCard) {
    // Reserve or Buy
    const card = selectedCard;
    const cardInfo = analyzeCard(player, card);

    let coinCost;
    if (cardInfo && cardInfo.coinCost) {
      coinCost = cardInfo.coinCost;
    }

    if (cardInfo && cardInfo.canBuy) {
      actions.push(
        <button
          key="2"
          style={{ lineHeight: "44px", minWidth: "90px" }}
          onClick={() => endTurn("buy", coinCost, cardInfo.isReserved)}
        >
          Buy
        </button>
      );
    }
    if (player.reserves.length < 3 && !cardInfo.isReserved) {
      // Can reserve more and selected card is not reserved
      actions.push(
        <button key="1" style={{ lineHeight: "44px", minWidth: "90px" }} onClick={() => endTurn("reserve")}>
          Reserve
        </button>
      );
    }
  } else if (phase === "overdraft" && bankTotal(player.bank, true) - coinSelection.length <= 10) {
    // Return coins
    actions.push(
      <button key="0" style={{ lineHeight: "44px", minWidth: "90px" }} onClick={() => endTurn("return")}>
        End Turn
      </button>
    );
  }

  return (
    <div style={{ zIndex: "99", position: "absolute", top: "270px", right: "0px", marginRight: "34.5%" }}>
      {actions}
    </div>
  );
};

export default Actions;
