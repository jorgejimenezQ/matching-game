import React, { useState } from 'react'
import classes from './gameButton.module.css'

const GameButton = ({ handleClick, text }) => {
  const [buttonClasses, setButtonClass] = useState(classes['game-button'])
  const [clicked, setClicked] = useState(false)
  const onClick = () => {
    if (clicked) return
    // Add 'game-button--clicked' to the button
    setButtonClass((prev) => (prev += ' ' + classes['game-button--clicked']))
    setClicked(true)

    // Remove 'game-button--clicked' from the button after 200ms
    setTimeout(() => {
      console.log('timeout')
      setButtonClass((prev) => prev.replace(' ' + classes['game-button--clicked'], ''))
      setClicked(false)
    }, 200)

    handleClick()
  }

  return (
    <>
      <button onClick={onClick} className={buttonClasses}>
        {text}
      </button>
    </>
  )
}

export default GameButton
