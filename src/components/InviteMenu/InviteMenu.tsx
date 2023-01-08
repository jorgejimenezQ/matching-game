import React from 'react'
import classes from './inviteMenu.module.css'
import GameButton from '../GameButton/GameButton'

// This component will display a link to share with a friend
// The link should be clickable and copy the link to the clipboard
// There should be a button to start the game
const InviteMenu = ({ inviteKey, inviteUrl, handleSubmit, fromInvite }) => {
  const [copied, setCopied] = React.useState(false)
  const handleClick = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
  }
  return (
    <div className={classes['invite-menu']}>
      <div className={classes['inner-wrapper']}>
        <h2>Invite a friend</h2>
        <p className={classes.message}>
          {/* Share this link with a<br /> friend to play a game <br /> together */}
          Copy &#x26; share with a friend
        </p>
        <div className={classes['invite-link']}>
          <p className={classes['invite-key']}>{inviteKey}</p>
          {/* <textarea value={inviteKey} readOnly /> */}
          <button onClick={handleClick} className={classes['copy-button']}>
            <img src='/src/assets/copy.svg' alt='copy' />
          </button>
        </div>
        <GameButton handleClick={handleSubmit} text='Start Game' />
        {/* <button className='btn-start' onClick={handleSubmit}>
        Start Game
      </button> */}
        {copied && <p className={classes['copied']}>Invite key copied to clipboard</p>}
      </div>
    </div>
  )
}

export default InviteMenu
