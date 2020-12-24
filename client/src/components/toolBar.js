import React, {useState} from 'react';
import {Link, BrowserRouter} from 'react-router-dom';
import * as GoIcons from 'react-icons/go';
import Logo from '../images/logo-grey.png';
import '../css/toolBar.css';

const ToolBar = props => {

    return(
    <header className="toolbar">
        <nav className="toolbar-navigation">
        <div className={props.hamburger} onClick={props.drawerClickHandler}>
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </div>
            <div className="toolbar-logo">DogAlong</div>
            <div className="spacer"/>
            <div className="toolbar-navigation-items">
                <ul>
                    <li><Link to="/"><span>בית</span></Link></li>
                    <li><Link to="/login"><span>התחברות</span></Link></li>
                </ul>
            </div>
        </nav>
    </header>
    )
}
//<div className="toolbar-logo"><img className="logo" src={Logo}></img></div>
export default ToolBar;