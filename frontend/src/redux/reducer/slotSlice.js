import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

export const slotSlice = createSlice({
  name: 'slot',
  initialState,
  reducers: {
    addSlot : (state, action) => {
      return {
        ...state,
        state : action.payload
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { addSlot } = slotSlice.actions;

export default slotSlice.reducer;