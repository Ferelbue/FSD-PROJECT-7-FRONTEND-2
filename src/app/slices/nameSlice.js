
import { createSlice } from '@reduxjs/toolkit';

export const nameSlice = createSlice({
    name: 'name',
    initialState: {
      name: {}
    },
    reducers: {
      updateName: (state, action) => {
        return {
          ...state,
          ...action.payload
        }
      },
    }
    
});

export const { updateName } = nameSlice.actions;

export const nameData = (state) => state.name;

export default nameSlice.reducer;