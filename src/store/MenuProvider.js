import React, { createContext } from "react";

export const MenuContext = createContext();

export const MenuProvider = (props) => {
  console.log("MenuProvider");
  const [menuState, setMenuState] = React.useState({ open: true });

  const toggleMenu = () => {
    setMenuState((prevState) => {
      return { ...prevState, open: !prevState.open };
    });
  };

  return (
    <MenuContext.Provider
      value={{
        menuState,
        toggleMenu,
      }}
    >
      {props.children}
    </MenuContext.Provider>
  );
};
