import React, { createContext, useEffect } from "react";

import { getNextPlayer, initialPlayers } from "../util/playersUtil";
import { generateGameDeck } from "../util/generateGameDeck";
import { generateTitles } from "../util/generateTitles";
import { canAddToSelection, canAddToOverdraft, canBuyTitle } from "../util/validation";
import { bankTotal, generateBank, updateBank } from "../util/bankUtil";
import { drawCard } from "../util/cardFuncs";

// Phases
// setup: display settings (no deck?)
// selection: current player can buy/reserve/pickup
// overdraft: current player can return excess coins
// game over: display game over screen

const defaultRules = {
  numPlayers: 2,
  phase: "setup",
};
const generateState = (rules = defaultRules) => {
  const gameDeck = generateGameDeck();
  return {
    players: initialPlayers(rules.numPlayers),
    bank: generateBank(rules.numPlayers),
    deck1: gameDeck.deck1,
    deck2: gameDeck.deck2,
    deck3: gameDeck.deck3,
    titles: generateTitles(rules.numPlayers),

    currentPlayer: 0,
    turn: 1,
    phase: rules.phase,
    lastRound: false,
    lastPlayerIndex: null, // Set this to last player in game when 1st person reaches 15 points.
    selectedCard: null,
    coinSelection: [],
  };
};

export const GameContext = createContext();
export const GameProvider = (props) => {
  const [gameState, setGameState] = React.useState(() => {
    let x = localStorage.getItem("gameState");
    let y = JSON.parse(x);
    // return y || generateState();
    return y || {};
  });
  useEffect(() => localStorage.setItem("gameState", JSON.stringify(gameState)));

  const reshuffle = (newRuleSet = defaultRules) => {
    console.log("[reshuffle]");
    setGameState(() => {
      let newGameState = { ...generateState(newRuleSet) };
      Object.keys(newRuleSet).forEach((newRule, i) => {
        newGameState[newRule] = newRuleSet[newRule];
      });
      return newGameState;
    });
  };

  // Selection
  const setSelectedCard = (card) => {
    // Click a card
    console.log("[setSelectedCard]");
    setGameState((prevGameState) => {
      return {
        ...prevGameState,
        coinSelection: [],
        selectedCard: card,
      };
    });
  };
  const addToSelection = (color) => {
    // Click a coin
    console.log("[addToSelection] " + color);
    const { bank, coinSelection } = gameState;
    if (gameState.phase === "selection") {
      // Add up to 3 different colors, 2 if same color
      if (canAddToSelection(color, bank, coinSelection)) {
        setGameState((prevGameState) => {
          const newCoinSelection = [...prevGameState.coinSelection, color];
          return {
            ...prevGameState,
            selectedCard: null,
            coinSelection: newCoinSelection,
          };
        });
      }
    } else if (gameState.phase === "overdraft") {
      // More than 10 coins in hand
      let currentPlayer = gameState.players[gameState.currentPlayer];
      if (canAddToOverdraft(gameState.phase, currentPlayer.bank, coinSelection)) {
        setGameState((prevGameState) => {
          const newCoinSelection = [...prevGameState.coinSelection, color];
          console.log(newCoinSelection);
          return {
            ...prevGameState,
            coinSelection: newCoinSelection,
          };
        });
      }
    }
  };
  const resetSelection = (color = null) => {
    console.log("[resetSelection]");
    setGameState((prevGameState) => {
      let newCoinSelection = prevGameState.coinSelection;
      if (color) {
        // Right clicked a coin, remove color from selection
        newCoinSelection = prevGameState.coinSelection.filter((s) => s !== color);
      } else {
        // Totally clear selection
        newCoinSelection = [];
      }
      return {
        ...prevGameState,
        coinSelection: newCoinSelection,
        selectedCard: null,
      };
    });
  };
  const endTurn = (action, coinCost = null, isCardReserved = null) => {
    console.log("[endTurn] " + gameState.currentPlayer.toString() + " " + action);
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const { bank, coinSelection, lastPlayerIndex } = gameState;

    // Don't change players when newPhase is one of these
    const sameTurnActions = ["pickup coins", "overdraft"];

    let newPlayers = [...gameState.players];
    let newPhase = gameState.phase;
    let newBank = { ...gameState.bank };
    let newTitles = [...gameState.titles];
    let lastRound = gameState.lastRound;
    let newPlayerBank;
    let newDeck;
    let deckKey; // 'deck1'
    let newCoinSelection = [];

    let card = gameState.selectedCard || null;
    if (gameState.selectedCard) {
      card = gameState.selectedCard;
    }

    let postAction;
    if (action === "pickup") {
      // Animate buying coins, then end turn
      newPhase = "pickup coins";
      setTimeout(() => {
        endTurn("done pickup");
      }, 750);

      // keep coin selection
      newCoinSelection = gameState.coinSelection;
    } else if (action === "done pickup") {
      // Update banks
      newBank = updateBank(bank, coinSelection, "remove");
      newPlayerBank = updateBank(currentPlayer.bank, coinSelection, "add");
      newPlayers[gameState.currentPlayer] = { ...currentPlayer, bank: newPlayerBank };

      if (newPlayerBank && bankTotal(newPlayerBank, true) > 10) {
        // Go to overdraft phase, don't change player
        newPhase = "overdraft";
      }
    } else if (action === "return") {
      // Returning coins from overdraft
      // Update banks, rotate player, reset phase
      newBank = updateBank(bank, coinSelection, "add");
      newPlayerBank = updateBank(currentPlayer.bank, coinSelection, "remove");
      newPlayers[gameState.currentPlayer] = { ...currentPlayer, bank: newPlayerBank };
      newPhase = "selection";
    } else if (action === "reserve") {
      postAction = "draw card";
      // Update Player bank and reserve list
      newPlayerBank = { ...currentPlayer.bank };
      newPlayerBank.wild += 1;
      const newReserveList = [...currentPlayer.reserves, card];
      newPlayers[gameState.currentPlayer] = { ...currentPlayer, bank: newPlayerBank, reserves: newReserveList };

      // Remove wild from bank
      newBank.wild -= 1;

      if (newPlayerBank && bankTotal(newPlayerBank, true) > 10) {
        // Go to overdraft phase
        newPhase = "overdraft";
      }
    } else if (action === "buy") {
      if (coinCost && Object.keys(coinCost).length !== 0) {
        // Card costs coins. Update both banks
        newPlayerBank = updateBank(currentPlayer.bank, coinCost, "buy");
        newBank = updateBank(bank, coinCost, "repay");
      }

      // Update player: cardList, titles, points,
      const newCardList = [...currentPlayer.cardList, gameState.selectedCard.id];
      let newCardCount = { ...currentPlayer.cardCount };
      newCardCount[card.color] += 1;

      // Titles
      const newTitlesIndi = canBuyTitle(newCardCount, gameState.titles);
      let newPlayerTitles = [];
      newTitlesIndi.forEach((titleIndex) => {
        let newTitle = { ...newTitles[titleIndex], owned: currentPlayer.name };
        newTitles[titleIndex] = newTitle;
        newPlayerTitles.push(newTitle);
      });
      // Points
      const newPointTotal = currentPlayer.points + card.points + newPlayerTitles.length * 3;
      if (!lastRound && newPointTotal >= 15) {
        // Trigger end game
        console.log("trigger end game");
        if (gameState.currentPlayer === gameState.players.length - 1) {
          console.log("Current player is last player. Game over");
          newPhase = "game over";
        } else {
          console.log("start last round");
          lastRound = true;
        }
      }
      let newPlayerReserves = [...currentPlayer.reserves];
      if (isCardReserved) {
        // Remove card from reserves
        const selectedIndex = newPlayerReserves.findIndex((c) => c.id === card.id);
        newPlayerReserves.splice(selectedIndex, 1);
      } else {
        // Draw new card
        postAction = "draw card";
      }

      newPlayers[gameState.currentPlayer] = {
        ...currentPlayer,
        bank: newPlayerBank || currentPlayer.bank,
        cardCount: newCardCount,
        cardList: newCardList,
        points: newPointTotal,
        titles: [...currentPlayer.titles, ...newPlayerTitles],
        reserves: newPlayerReserves,
      };
    }

    if (postAction === "draw card") {
      // Draw new card and set slot
      deckKey = gameState.selectedCard.id.slice(0, 5);
      const deck = gameState[deckKey];
      if (card.slot) {
        newDeck = drawCard(deck, card.slot);
      }
    }

    if (lastRound && lastPlayerIndex === gameState.currentPlayer) {
      console.log("Last player has finished final round. end game");
      newPhase = "game over";
    }

    setGameState((prevGameState) => {
      let res = {
        ...prevGameState,
        coinSelection: newCoinSelection,
        selectedCard: null,
        bank: newBank,
        titles: newTitles,
        turn:
          prevGameState.currentPlayer === prevGameState.players.length && newPhase !== "game over"
            ? prevGameState.turn++
            : prevGameState.turn,
        currentPlayer: sameTurnActions.includes(newPhase) ? prevGameState.currentPlayer : getNextPlayer(prevGameState),
        phase: newPhase,
        players: newPlayers,
        // [deckKey]: newDeck,
      };
      if (newDeck && deckKey) {
        res[deckKey] = newDeck;
      }
      if (!prevGameState.lastRound && lastRound && newPhase !== "game over") {
        res.lastRound = true;
        res.lastPlayerIndex = prevGameState.players.length - 1;
      }
      return res;
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setSelectedCard,
        addToSelection,
        resetSelection,
        endTurn,
        reshuffle,
      }}
    >
      {props.children}
    </GameContext.Provider>
  );
};
