import React, { useState} from 'react';
import {Link} from 'react-router-dom'

import SideDrawers from './SideDrawers';
import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import Backdrop from '../UIElements/Backdrop'


import './MainNavigation.css'


const MainNavigation = props => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false)

    const openDrawerHandler = () => {
        setDrawerIsOpen(true)
    }

    const closeDrawerHandler = () => {
        setDrawerIsOpen(false)
    }


    return (
        <React.Fragment>
            {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
        <SideDrawers show={drawerIsOpen} onClick={closeDrawerHandler}>
            <nav className='main-navigation__drawer-nav'>
                <NavLinks />
            </nav>
        </SideDrawers>

        <MainHeader>
            <button className='main-navigation__menu-btn' onClick={openDrawerHandler}>
                <span />
                <span />
                <span />
            </button>

            <h1 className='main-navigation__title'>
                <Link to="/">Your Places</Link>
            </h1>

            <nav className='main-navigation__header-nav'>
                <NavLinks />
            </nav>

        </MainHeader>
        </React.Fragment>
    )
}

export default MainNavigation