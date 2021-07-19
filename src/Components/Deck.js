import React from "react";

const Deck = (props) => {
  // Render the deck for given tier.
  const { tierDeck } = props;
  if (!tierDeck) {
    return null;
  }
  const { cardList, topIndex } = tierDeck;

  // 2px wide per card
  const deckCount = cardList.length - (topIndex + 1);
  const width = (deckCount * 2).toString();
  const deckWidth = {
    width: width + "px",
  };

  return (
    <div className="cards_reserve">
      <div className="cards_reserve_container">
        <div className="card_deck" style={deckWidth} />
      </div>
    </div>
  );
};

export default Deck;
