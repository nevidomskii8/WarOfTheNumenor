import { createReducer } from "@reduxjs/toolkit";
import { selectedCreepInLocation } from '../actions/locationAction'

const initialState = {
  selectedCreep: ''
};

const creepReducer = createReducer(initialState, {
  [selectedCreepInLocation.type]: (state,action) => {
    state.selectedCreep = action.payload;
  },
});

export default creepReducer