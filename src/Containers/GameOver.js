import React, { useContext } from "react";
import { GameContext } from "../store/GameStateProvider";

const GameOver = (props) => {
  const gameData = useContext(GameContext);
  const { gameState } = gameData;
  const { phase, players, turn } = gameState;
  const tableRowStyle = { minWidth: "100px" };

  if (phase !== "game over") {
    return null;
  }

  const sortedPlayers = players.sort((a, b) => (a.points > b.points ? -1 : 1));
  const resultRows = sortedPlayers.map((p, i) => {
    // let cardCount = p.cardList.reduce()
    return (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{p.name}</td>
        <td>{p.points}</td>
      </tr>
    );
  });

  const currentTurn = <p>Last Turn: {turn}</p>;

  return (
    <div className="backdrop">
      <div className="menuScreen">
        <p>Game Over</p>
        {currentTurn}
        <table style={{ margin: "auto" }}>
          <thead>
            <td style={tableRowStyle}>Place</td>
            <td style={tableRowStyle}>Player Name</td>
            <td style={tableRowStyle}>Points</td>
          </thead>
          {resultRows}
        </table>
      </div>
    </div>
  );
};

export default GameOver;
