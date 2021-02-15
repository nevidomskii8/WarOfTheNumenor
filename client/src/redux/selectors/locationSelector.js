import { createSelector } from '@reduxjs/toolkit'

export const getSelectedCreep = createSelector(
  state => state.location.selectedCreep,
  creep => creep
);