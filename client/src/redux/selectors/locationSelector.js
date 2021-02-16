import { createSelector } from '@reduxjs/toolkit'

export const getSelectedLocData = createSelector(
  state => state.location,
  location => location
);

export const getSelectedType = createSelector(
  state => state.location.selectedType,
  type => type
);

export const getSelectedCreep = createSelector(
  state => state.location.selectedCreep,
  creep => creep
);

export const getSelectedLvl = createSelector(
  state => state.location.selectedLvl,
  lvl => lvl
);

export const getSelectedLoc = createSelector(
  state => state.location.selectedLoc,
  loc => loc
);

export const getCreeps = createSelector(
  state => state.location.creeps.data,
  creeps => creeps
);

export const getDataLocations = createSelector(
  state => state.location.locations.data,
  locs => locs
);