import React from 'react';
import {Link} from 'react-router-dom';

import * as GoIcons from 'react-icons/go';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';
import * as AiIcons from 'react-icons/ai';

import '../css/sideDrawer.css';


const sideDrawer = props => {
    let drawerClasses = 'side-drawer';
    if(props.show){
        drawerClasses = 'side-drawer open';
    }
    return(
        <nav className={drawerClasses}>
            <div className='side-drawer-top'>
                <div className='sidebar-close-icon' onClick={props.drawerClickHandler}><AiIcons.AiOutlineClose /></div>
            </div>
            <ul>
                <li onClick={props.drawerClickHandler}><Link to="/"><span>בית</span></Link></li>
                <li onClick={props.drawerClickHandler}><Link to="/login"><span>התחברות</span></Link></li>
            </ul>
        </nav>
    )
};

export default sideDrawer;