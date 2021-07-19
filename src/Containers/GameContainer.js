import React, { useContext } from "react";
import { GameContext } from "../store/GameStateProvider";

const GameContainer = (props) => {
  const gameInfo = useContext(GameContext);
  if (!gameInfo) {
    return null;
  }
  const { gameState, resetSelection } = gameInfo;
  const { phase, titles } = gameState;

  const resetClick = () => resetSelection(null);
  const backdropClick = phase === "selection" || phase === "overdraft" ? resetClick : null;
  let containerClass;
  if (titles && titles.length === 5) {
    // Reduce padding on bottom (need room to draw 5 titles)
    containerClass = "fiveTitles";
  } else if (titles && titles.length === 4) {
    containerClass = "fourTitles";
  }
  return (
    <div id="container_overall" className={containerClass} onClick={backdropClick}>
      {props.children}
    </div>
  );
};

export default GameContainer;
