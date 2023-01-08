import React from 'react'
import classes from './navbar.module.css'

const NavbarComponent = ({
  usernameInput,
  player2,
  gameStarted,
  currPlayerOneScore,
  currPlayerTwoScore,
  mobile,
}) => {
  return (
    <nav>
      <div id='user-1' className='playerNames'>
        {!mobile && usernameInput}
        {/* {usernameInput + (mobile && gameStarted ? ': ' + currPlayerOneScore : '')} */}
      </div>
      <h1 className={classes.title}>Fantasy Match</h1>
      <div id='user-2' className='playerNames'>
        {!mobile && player2}
        {/* {player2 + (mobile && gameStarted ? ': ' + currPlayerTwoScore : '')} */}
      </div>
    </nav>
  )
}

export default NavbarComponent
