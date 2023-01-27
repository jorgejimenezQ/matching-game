import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
  uuid: string
}

const initialState: InitialState = {
  uuid: '',
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setUuid: (state, action: PayloadAction<string>) => {
      state.uuid = action.payload
    },
  },
})

export const { setUuid } = adminSlice.actions
export default adminSlice.reducer
