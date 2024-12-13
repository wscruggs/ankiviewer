import {Link } from 'react-router-dom';

export const NavBar = () => {

    return (
        <nav className='navMenu'>
            <Link to="/deck">Deck</Link>
            <Link to="/addCard">Request Card</Link>
            <Link to="/requestedCardList">Requested Cards</Link>
            <Link to="/downloads">Download Deck</Link>
            <div className='a-right'>
                <Link to="/login">Log In</Link>
            </div>
        </nav>
    )
}