import React from 'react'
import classes from './game.module.css'

const GameComponent = ({
  gameStarted,
  currentTurn,
  username,
  currPlayerOneScore,
  currPlayerTwoScore,
  player2,
}) => {
  return (
    <div id='game' className='game-container'>
      <div>
        {gameStarted && (
          <div className='score-container'>
            <div className={currentTurn ? 'player-score active' : 'player-score'}>
              <h2>{username}</h2>
              <div className='score-value'>{'Pairs Found: ' + currPlayerOneScore}</div>
              {!currentTurn ? (
                <div className='turn-indicator'>Other player...</div>
              ) : (
                <div className='turn-indicator'>Your turn...</div>
              )}
            </div>
            <div className={!currentTurn ? 'player-score active' : 'player-score'}>
              <h2>{player2}</h2>
              <div className='score-value'>{'Pairs Found: ' + currPlayerTwoScore}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameComponent
