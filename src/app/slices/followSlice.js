
import { createSlice } from '@reduxjs/toolkit';

export const followSlice = createSlice({
    name: 'follow',
    initialState: {
      detail: {}
    },
    reducers: {
      updateFollow: (state, action) => {
        return {
          ...state,
          ...action.payload
        }
      },
    }
    
});

export const { updateFollow } = followSlice.actions;

export const followData = (state) => state.follow;

export default followSlice.reducer;