import React, { useContext, useState } from "react";

import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { GameContext } from "../store/GameStateProvider";
import { MenuContext } from "../store/MenuProvider";

const stopProp = (e) => {
  // don't let clicks from children travel to parents
  // i.e. don't click background (parent) because menu was clicked
  e.stopPropagation();
};

const MenuScreen = (props) => {
  const gameInfo = useContext(GameContext);
  const menuInfo = useContext(MenuContext);
  const { gameState, reshuffle } = gameInfo;
  const { menuState, toggleMenu } = menuInfo;
  const open = menuState.open;
  const turn = gameState.turn;
  const [selectedPlayers, setNumPlayers] = useState(
    gameState.players && gameState.players.length ? gameState.players.length : 2
  );
  const changePlayers = (e) => setNumPlayers(e.target.value);
  if (!open) {
    return null;
  }

  const shuffleClick = () => {
    reshuffle({
      numPlayers: selectedPlayers,
      phase: "selection",
    });
    toggleMenu();
  };

  let backdropClasses = open ? "backdrop" : "";

  const currentTurn = <p>Turn: {turn}</p>;

  const optionNumPlayers = (
    <React.Fragment>
      <span className="selectSpan">Number of Players:</span>
      <FormControl>
        <Select value={selectedPlayers} onChange={changePlayers}>
          <MenuItem value={2}>
            <em>2</em>
          </MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
        </Select>
      </FormControl>
    </React.Fragment>
  );

  //   const randInt = Math.floor(Math.random() * Math.floor(10));

  return (
    <div className={backdropClasses} onClick={toggleMenu}>
      <div className="menuScreen" onClick={stopProp}>
        <p className="title">Game Settings</p>
        {currentTurn}
        {optionNumPlayers}

        <div style={{ margin: "30px 0px 20px 0px", textAlign: "center" }}>
          <button onClick={shuffleClick}>Start new game with {selectedPlayers} players</button>
        </div>
      </div>
    </div>
  );
};

export default MenuScreen;
