import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import connection from '../../connection/connection'
import classes from './adminServer.module.css'
import { set } from 'immer/dist/internal'
import { connect } from 'react-redux'

// two tables for the server. one for the connections and one for the games and the players in them
const AdminServer = () => {
  const adminUid = useAppSelector((state) => state.admin.uuid)
  const effectRan = useRef(null)
  const [games, setGames] = useState([])
  const [connections, setConnections] = useState([])

  const events = useCallback(() => {
    connection.socket.on('admin_updateData', (data) => {
      console.log('data: update', data)
      setGames(data.games)
      //   setConnections(data.connections)
    })
  }, [])

  useEffect(() => {
    // Get the server data
    connection.socket.emit('admin_getServerInfo', adminUid, (response) => {
      console.log('response: ', response)
      if (response.success) {
        setGames(response.games)
        setConnections(response.connections)
      } else {
        console.log('Error: ', response.message)
      }
    })

    // Run the events only once
    if (effectRan.current) return
    events()
    return () => {
      effectRan.current = true
    }
  }, [adminUid])

  return (
    <div className='adminWrapper'>
      {Object.keys(games).map((key) => {
        return (
          <div key={key} className={classes.tableWrapper}>
            {/* Game */}
            <h2>
              Game: <span className={classes.small}>{key}</span>
            </h2>
            <table className={classes.connTable}>
              <colgroup>
                <col span={1} style={{ width: '33%' }} />
                <col span={1} style={{ width: '33%' }} />
                <col span={1} style={{ width: '33%' }} />
              </colgroup>
              <thead className={classes.header}>
                <tr>
                  <th>GAME IS INVITE</th>
                  <th>NUMBER OF PLAYERS</th>
                  <th>PAIRS REMAINING</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td key={Math.random() * 1000} id='isInvite'>
                    {games[key].isInvite.toString()}
                  </td>
                  <td key={Math.random() * 1000}>{games[key].numberOfPlayers}</td>
                  <td key={Math.random() * 1000}>{games[key].pairsRemaining}</td>
                </tr>
              </tbody>
            </table>

            {/* Players */}
            <h3>Players</h3>
            <table className={classes.connTable}>
              <colgroup>
                <col span={1} style={{ width: '33%' }} />
                <col span={1} style={{ width: '33%' }} />
                <col span={1} style={{ width: '33%' }} />
              </colgroup>
              <thead className={classes.header}>
                <tr>
                  <th>USERNAME</th>
                  <th>SCORE</th>
                  <th>PLAYER IS READY</th>
                </tr>
              </thead>
              <tbody className={classes.tableBody}>
                {Object.keys(games[key].players).map((playerKey) => {
                  return (
                    <tr key={playerKey}>
                      {/* <td>{playerKey}</td> */}
                      <td>{games[key].players[playerKey].username}</td>
                      <td>{games[key].players[playerKey].score}</td>
                      <td id='isReady'>{games[key].players[playerKey].ready.toString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}

export default AdminServer
