import { useState, useEffect, useCallback, useRef } from 'react'
import { setUsername } from '../../features/username/usernameSlice'
import { useParams } from 'react-router-dom'
import classes from './startScreen.module.css'

import {
  setSessionId,
  setOtherPlayer,
  setCardIndexes,
  setFirstPlayer,
  setGameStarted,
  gameExists,
  resetAll,
  setIsMobile,
  setInviteUrl,
  setInviteGameEnded,
} from '../../features/gameSession/gameSessionSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Phaser from 'phaser'
import gameConfig from '../../game/game.config'
import connection from '../../connection/connection'
import GameComponent from '../Game/GameComponent'
import GameMenu from '../GameMenu/GameMenu'
import InviteMenu from '../InviteMenu/InviteMenu'

export default function StartScreen() {
  const [usernameInput, setUsernameInput] = useState('')
  const [player2, setPlayer2] = useState('')
  const [waiting, setWaiting] = useState(false)
  // const [game, setGame] = useState<Phaser.Game | null>(null)
  const [waitingMsg, setWaitingMsg] = useState('Waiting for the other player to join...')
  const [inviteKey, setInviteKey] = useState('')
  const [invite, setInvite] = useState(false)
  const [fromInvite, setFromInvite] = useState(false)
  const [gameNumber, setGameNumber] = useState(0)
  const effectRan = useRef(false)
  const gameRef = useRef(null)

  // Params
  const { inviteKey: inviteKeyParam } = useParams<{ inviteKey: string }>()

  // Redux state
  const gameStarted = useAppSelector((state) => state.gameSession.gameStarted)
  const currPlayerOneScore = useAppSelector((state) => state.gameSession.playerScore)
  const currPlayerTwoScore = useAppSelector((state) => state.gameSession.playerTwoScore)
  const usernameSet = useAppSelector((state) => state.username.username !== '')
  const currentTurn = useAppSelector((state) => state.gameSession.firstPlayerCurrentTurn)
  const isGameCreated = useAppSelector((state) => state.gameSession.gameExists)
  const inviteUrl = useAppSelector((state) => state.gameSession.inviteUrl)
  const inviteGameEnded = useAppSelector((state) => state.gameSession.inviteGameEnded)
  const sessionId = useAppSelector((state) => state.gameSession.sessionId)
  const dispatch = useAppDispatch()

  // Check if mobile device or not
  useEffect(() => {
    if (window.innerWidth < 600) {
      dispatch(setIsMobile(true))
      gameConfig.height = 500
      gameConfig.width = 400
    }

    if (inviteKeyParam) {
      setInviteKey(inviteKeyParam)
      setFromInvite(true)
    }

    console.log('effect ran on start screen')
    const game = gameRef.current
    // Fix to run only once
    if (effectRan.current) return

    // Listen for the game to start
    connection.socket.on('gameOver', (winner) => {
      dispatch(setGameStarted(false))
      dispatch(setInviteGameEnded(true))

      if (winner == 'draw') {
        alert('Draw!')
      } else {
        const winnerString = winner == connection.connectionId ? 'You WIN' : 'You LOSE'
        alert(winnerString)
      }

      // Reset all the game state
      setPlayer2('')
      setGameStarted(false)
      setWaiting(false)

      dispatch(resetAll())
      console.log(game)
      gameRef.current.destroy(true)
      dispatch(setInviteGameEnded(true))
      setInvite(false)
      // game.destroy(true)
      // effectRan.current = false
      // connection.socket.emit('restartGame')
    })

    return () => {
      effectRan.current = true
    }
  }, [gameNumber])

  const startGameEvent = useCallback((isGameCreated) => {
    // Wait for the other player to join
    connection.socket.on('startGame', ({ players, firstPlayer }) => {
      if (gameStarted) return

      const keys = Object.keys(players)
      const otherPlayerId = keys.find((key) => key !== connection.connectionId)
      setPlayer2(players[otherPlayerId].username)
      dispatch(setOtherPlayer(players[otherPlayerId].username))
      dispatch(setFirstPlayer(firstPlayer))

      // start the game
      gameRef.current = new Phaser.Game(gameConfig)
      dispatch(gameExists())

      setWaiting(false)
      dispatch(setGameStarted(true))
    })
  }, [])

  // Join a random game
  const handleRandom = () => {
    if (usernameInput === '') return

    connection.socket.emit('join', { username: usernameInput, isInvite: false }, (response) => {
      dispatch(setSessionId(response.sessionId))
      dispatch(setCardIndexes(response.cardIndexes))
    })

    dispatch(setUsername(usernameInput))

    const game = gameRef.current
    if (!game) startGameEvent(isGameCreated)
    if (game) game.destroy(true)

    startGame()
  }

  // Create an invite link for a friend to join
  const handleCreateInvite = () => {
    if (usernameInput === '') return

    connection.socket.emit('join', { username: usernameInput, createInvite: true }, (response) => {
      dispatch(setSessionId(response.sessionId))
      dispatch(setCardIndexes(response.cardIndexes))

      const inviteUrl = `${window.location.origin}/invite/${response.sessionId}`

      setInviteKey(response.sessionId)
      setInvite(true)
      dispatch(setInviteUrl(inviteUrl))
    })
    const game = gameRef.current

    setFromInvite(true)
    dispatch(setUsername(usernameInput))
    if (!game) startGameEvent(isGameCreated)
    if (game) game.destroy(true)
  }

  // Join a game from an invite link
  const joinInvite = () => {
    if (usernameInput === '') return

    connection.socket.emit(
      'join',
      { username: usernameInput, isInvite: true, sessionId: inviteKey || sessionId },
      (response) => {
        dispatch(setSessionId(response.sessionId))
        dispatch(setCardIndexes(response.cardIndexes))
      }
    )

    dispatch(setUsername(usernameInput))

    const game = gameRef.current
    if (!game) startGameEvent(isGameCreated)
    if (game) game.destroy(true)

    startGame()
  }

  const startGame = () => {
    setWaiting(true)

    dispatch(setInviteGameEnded(true))

    setGameNumber((prev) => prev + 1)
    console.log('game number', gameNumber)
    // new Phaser.Game(gameConfig)
    connection.socket.emit('playerReady', (response) => {
      console.log('response from playerReady', response)
    })
  }

  return (
    <>
      <div className='main-wrapper'>
        {waiting ? (
          <div className={classes.waiting}>
            <h2>{waitingMsg}</h2>
          </div>
        ) : (
          <>
            {!gameStarted &&
              (!invite ? (
                <GameMenu
                  fromInvite={fromInvite}
                  inviteGameEnded={inviteGameEnded}
                  usernameSet={usernameSet}
                  handleChange={setUsernameInput}
                  handleRandomGame={handleRandom}
                  handleCreateInvite={handleCreateInvite}
                  handleJoinInvite={joinInvite}
                />
              ) : (
                <InviteMenu
                  fromInvite={fromInvite}
                  inviteKey={inviteKey}
                  inviteUrl={inviteUrl}
                  handleSubmit={startGame}
                />
              ))}
          </>
        )}
        <GameComponent
          gameStarted={gameStarted}
          currentTurn={currentTurn}
          currPlayerOneScore={currPlayerOneScore}
          currPlayerTwoScore={currPlayerTwoScore}
          player2={player2}
          username={usernameInput}
        />
      </div>
    </>
  )
}
