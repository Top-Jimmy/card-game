import React from "react";

import { GameProvider } from "./store/GameStateProvider";
import { MenuProvider } from "./store/MenuProvider";

import "./App.css";
import GameContainer from "./Containers/GameContainer";
import Actions from "./Containers/Actions";
import CardRow from "./Containers/CardRow";
import Bank from "./Containers/Bank";
import CurrentPlayer from "./Containers/CurrentPlayer";
import Titles from "./Containers/Titles";
import GameOver from "./Containers/GameOver";
import Menu from "./Containers/Menu";
import MenuScreen from "./Containers/MenuScreen";

const App = React.memo((props) => {
  return (
    <GameProvider>
      <MenuProvider>
        <GameContainer>
          <Menu />
          <MenuScreen />
          <GameOver />

          <div id="card_rows">
            <CardRow deckNum={"3"}></CardRow>
            <CardRow deckNum={"2"}></CardRow>
            <CardRow deckNum={"1"}></CardRow>
          </div>
          <Actions />
          <Bank />
          <Titles />
        </GameContainer>
        <CurrentPlayer />
      </MenuProvider>
    </GameProvider>
  );
});

export default App;
