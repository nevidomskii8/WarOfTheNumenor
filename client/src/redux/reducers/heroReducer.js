import { createReducer } from "@reduxjs/toolkit";
import { fetchHero } from '../actions/heroAction'

const initialState = {
  loading: false,
  data: [],
  error: null
};

const heroReducer = createReducer(initialState, {
  [fetchHero.pending]: (state) => {
    state.loading = true;
    state.error = null
  },
  [fetchHero.fulfilled]: (state, action) => {
    state.data = action.payload;
    state.loading = false;
  },
  [fetchHero.rejected]: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
});

export default heroReducer