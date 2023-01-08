import React from 'react'
import NameInput from '../NameInput/NameInput'
import GameButton from '../GameButton/GameButton'
import classes from './gameMenu.module.css'

const GameMenu = ({
  usernameSet,
  fromInvite,
  handleChange,
  handleRandomGame,
  handleCreateInvite,
  handleJoinInvite,
  inviteGameEnded,
}) => {
  return (
    <>
      <main className={classes['main-container']}>
        {!usernameSet && <NameInput handleChange={(e) => handleChange(e.target.value)} />}
        {fromInvite && (
          <>
            <GameButton
              handleClick={handleJoinInvite}
              text={inviteGameEnded ? 'Play Again' : 'Join Game'}
            />
          </>
        )}
        {!fromInvite && (
          <>
            <GameButton handleClick={handleRandomGame} text='Find a Random Game' />
            {/* <button className='btn-start' onClick={handleRandomGame}>
                Find a Random Game
              </button> */}
            <GameButton handleClick={handleCreateInvite} text='Invite A Friend' />
            {/* <button className='btn-start' onClick={handleCreateInvite}>
                Invite A Friend
              </button> */}
          </>
        )}
      </main>
    </>
  )
}

export default GameMenu
