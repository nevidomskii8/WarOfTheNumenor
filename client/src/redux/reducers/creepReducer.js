import { createReducer } from "@reduxjs/toolkit";
import { fetchCreep } from '../actions/creepAction'

const initialState = {
  loading: false,
  data: {},
  error: null
};

const creepReducer = createReducer(initialState, {
  [fetchCreep.pending]: (state) => {
    state.loading = true;
    state.error = null
  },
  [fetchCreep.fulfilled]: (state, action) => {
    state.data = action.payload;
    state.loading = false;
  },
  [fetchCreep.rejected]: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  }
});

export default creepReducer