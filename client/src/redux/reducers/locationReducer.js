import { createReducer } from "@reduxjs/toolkit";
import { selectedCreepInLocation, selectLocationType, selectLocLvl, fetchLocation, selectLocation,fetchCreepsInLocation,setCreepVictory } from '../actions/locationAction'

const initialState = {
  selectedType: 'Охота',
  selectedLvl: null,
  selectedLoc: '',
  selectedCreep: '',
  locations: {
    loading: false,
    error: null,
    data: [],
  },
  creeps: {
    loading: false,
    error: null,
    data: [],
  }
};

const creepReducer = createReducer(initialState, {
  [selectLocationType.type]: (state, action) => {
    state.selectedType = action.payload;
  },
  [selectLocLvl.type]: (state, action) => {
    state.selectedLvl = action.payload;
  },
  [selectLocation.type]: (state, action) => {
    state.selectedLoc = action.payload;
  },
  [selectedCreepInLocation.type]: (state, action) => {
    state.selectedCreep = action.payload;
  },
  [fetchLocation.pending]: (state) => {
    state.locations.loading = true;
    state.locations.error = null
  },
  [fetchLocation.fulfilled]: (state, action) => {
    state.locations.data = action.payload;
    state.locations.loading = false;
  },
  [fetchLocation.rejected]: (state, action) => {
    state.locations.loading = false;
    state.locations.error = action.payload;
  },
  [fetchCreepsInLocation.pending]: (state) => {
    state.creeps.loading = true;
    state.creeps.error = null
  },
  [fetchCreepsInLocation.fulfilled]: (state, action) => {
    state.creeps.data = action.payload;
    state.creeps.loading = false;
  },
  [fetchCreepsInLocation.rejected]: (state, action) => {
    state.creeps.loading = false;
    state.creeps.error = action.payload;
  },
  [setCreepVictory.type]: (state, action) => {
    state.creeps.data[action.payload[0]].isVictory = action.payload[1];
  },
  
});

export default creepReducer