import { createReducer } from "@reduxjs/toolkit";
import { openBackpack } from '../actions/navAction'

const initialState = {
  loading: false,
  isOpenBackpack: false,
  error: null
};

const heroReducer = createReducer(initialState, {
  [openBackpack.type]: (state,action) => {
    state.isOpenBackpack = action.payload;
  }
});

export default heroReducer