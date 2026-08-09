import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  byId: {
    platform1: { id: 'platform1', name: 'LinkedIn' },
    platform2: { id: 'platform2', name: 'X' },
  },
  allIds: ['platform1', 'platform2'],
}

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    addPlatform: (state, action) => {
      const platform = action.payload
      state.byId[platform.id] = platform
      state.allIds.push(platform.id)
    },
  },
})

export const { addPlatform } = platformsSlice.actions
export default platformsSlice.reducer
