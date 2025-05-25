import React from 'react';
import header__logo from '../images/Mesto.svg';
import '../blocks/header/header.css';
import '../blocks/header/__logo/header__logo.css';

function Header()  {
    return (
            <header className="header">
                <img className="header__logo" src={header__logo} alt="Место"/>
            </header>
    );
}

export default Header;