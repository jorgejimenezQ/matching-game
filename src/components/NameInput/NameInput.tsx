import React from 'react'
import classes from './nameInput.module.css'

const NameInput = ({ handleChange }) => {
  return (
    <div className={classes['input-form']}>
      <label htmlFor='name'>Choose a username:</label>
      <input type='text' id='username' onChange={handleChange} />
    </div>
  )
}

export default NameInput
