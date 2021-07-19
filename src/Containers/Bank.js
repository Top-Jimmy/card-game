import React, { useContext, useState } from "react";

import { GameContext } from "../store/GameStateProvider";

const colors = ["wild", "white", "yellow", "green", "red", "black"]; // blue is now yellow

// Display number of coins in bank for each color
// Also display which coins are selected during 'selection' phase

const Bank = (props) => {
  // const Bank = React.memo(props => {

  // Handle animation of 'de-selecting' coin and transitioning to 'empty'
  const [deselectAnimations, setAnimations] = useState({
    white: false,
    yellow: false,
    green: false,
    red: false,
    black: false,
  });
  const gameData = useContext(GameContext);
  if (!gameData) {
    return null;
  }
  const { gameState, addToSelection, resetSelection } = gameData;
  const { bank, coinSelection, phase } = gameState;
  if (!bank) {
    return null;
  }

  const animateColor = (color) => {
    setAnimations((prevState) => {
      return {
        ...prevState,
        [color]: true,
      };
    });
  };
  const doneAnimation = (color) => {
    setAnimations((prevState) => {
      return {
        ...prevState,
        [color]: false,
      };
    });
  };

  const renderBankCoins = colors.map((c, i) => {
    // Display number of coins in bank (minus selected coins)
    let bankCount = bank[c];
    let displayCount = bankCount;

    let chipClasses = "chip";
    if (!bankCount) {
      chipClasses += " empty";
    } else if (phase === "selection") {
      const numSelections = coinSelection.filter((selectionColor) => selectionColor === c).length;
      displayCount = bankCount - numSelections;
    }

    return (
      <div key={i} className={chipClasses} id={"chips_" + c}>
        <div
          style={{
            position: "absolute",
            right: "110%",
            top: "50%",
            marginTop: "-10px",
            fontFamily: "Barlow sans-serif",
            fontSize: "13px",
            color: "rgba(10, 10, 10, 1)",
          }}
        >
          {displayCount || ""}
        </div>
      </div>
    );
  });

  const renderedSelectedCoins = colors.map((c, i) => {
    const numSelections = coinSelection.filter((selectionColor) => selectionColor === c).length;

    let chipClasses = "chip";
    let coinClick;
    let coinRightClick;
    const endAnimationFn = () => {
      //   e.stopPropagation();
      doneAnimation(c);
    };

    if (phase === "pickup coins") {
      if (numSelections) {
        chipClasses += " pickup";
      } else {
        chipClasses += " notSelected";
      }
    } else if (phase === "selection") {
      if (numSelections === 0) {
        chipClasses += " notSelected";
        // select coin
        coinClick = (e) => {
          e.stopPropagation();
          addToSelection(c);
        };
      } else {
        chipClasses += " selected";

        // de-select coin (start animation)
        coinClick = (e) => {
          e.stopPropagation();
          animateColor(c);
          resetSelection(c);
        };

        // coinRightClick = (e) => {
        //   e.preventDefault();
        //   resetSelection(c);
        //   animateDeselection(c);
        // };
      }
    }

    if (numSelections === 0 && bank[c] === 0) {
      chipClasses += " empty";
    }

    // const endAnimationFn = () => doneAnimation(c);

    return (
      <div
        key={i}
        onClick={coinClick}
        onContextMenu={coinRightClick}
        className={chipClasses}
        id={"chips_" + c}
        onAnimationEnd={endAnimationFn}
      >
        <div
          style={{
            position: "absolute",
            right: "110%",
            top: "50%",
            marginTop: "-10px",
            fontFamily: "Barlow sans-serif",
            fontSize: "13px",
            color: "rgba(10, 10, 10, 1)",
          }}
        />
      </div>
    );
  });

  return (
    <React.Fragment>
      <section id="chips">{renderBankCoins}</section>
      <section id="selected_chips">{renderedSelectedCoins}</section>
    </React.Fragment>
  );
};

export default Bank;
