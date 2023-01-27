import { useEffect, useRef, useState } from 'react'
import classes from './adminLogin.module.css'
import connection from '../../connection/connection'
import { useNavigate } from 'react-router-dom'
import { setUuid } from './adminSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

/**
 * The AdminLogin component is the login page for the admin. It is the only page with a login form.
 */
const AdminLogin = () => {
  // const [username, setUsername] = useState('')
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const effectRan = useRef(null)
  const [connected, setConnected] = useState(false)
  const navigate = useNavigate()

  const adminUuid = useAppSelector((state) => state.admin.uuid)
  const dispatch = useAppDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (key === '') {
      setError('Please enter a key')
      return
    }

    connection.socket.emit('adminLogin', key, (data) => {
      console.log('data: ', data)
      const { success, message, uid } = data
      if (success) {
        // Redirect to admin page
        dispatch(setUuid(uid))
        navigate('/admin')
      } else {
        setError(message)
      }
    })
  }

  // Renders a form with a username and password field.
  return (
    <div className={classes.wrapper}>
      <h1>Admin Login </h1>
      <form className={classes.form}>
        <label className={classes.label} htmlFor='key'>
          Key
        </label>
        <input
          className={classes.input}
          type='key'
          id='key'
          name='key'
          onChange={(e) => {
            setKey(e.target.value)
            setError('')
          }}
        />
        <button className={classes.button} type='submit' onClick={handleSubmit}>
          Enter
        </button>
      </form>
      <div className={classes.error}>{error}</div>
    </div>
  )
}

export default AdminLogin
