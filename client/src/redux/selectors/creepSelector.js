import { createSelector } from '@reduxjs/toolkit'

export const getCreep = createSelector(
  state => state.creep.data[0],
  creep => creep
);