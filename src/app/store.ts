import { configureStore } from '@reduxjs/toolkit'
import usernameReducer from '../features/username/usernameSlice'
import gameSessionReducer from '../features/gameSession/gameSessionSlice'
import adminSliceReducer from '../features/admin/adminSlice'

const store = configureStore({
  reducer: {
    username: usernameReducer,
    gameSession: gameSessionReducer,
    admin: adminSliceReducer,
  },
})

export default store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
