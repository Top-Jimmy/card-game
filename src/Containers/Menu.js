import React, { useContext } from 'react';

import {MenuContext} from '../store/MenuProvider';

const Menu = (props) => {
    const menuData = useContext(MenuContext);
    if (!menuData) {
        return null;
    }
    const { toggleMenu } = menuData;

    return (
        <div className="hamburger" onClick={toggleMenu}>
            <svg viewBox="0 0 100 80" width="40" height="40">
                <rect width="100" height="20"></rect>
                <rect y="30" width="100" height="20"></rect>
                <rect y="60" width="100" height="20"></rect>
            </svg>
        </div>
    );
};

export default Menu;