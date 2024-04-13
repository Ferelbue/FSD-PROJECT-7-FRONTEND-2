
import { createSlice } from '@reduxjs/toolkit';


export const userBySlice = createSlice({
    name: 'userBy',
    initialState: {
      userBy: {}
    },
    reducers: {
      updateUserBy: (state, action) => {
        return {
          ...state,
          ...action.payload
        }
      },
    }
    
});

export const { updateUserBy } = userBySlice.actions;

export const userByData = (state) => state.userBy;

export default userBySlice.reducer;