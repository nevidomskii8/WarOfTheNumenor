import { createSelector } from '@reduxjs/toolkit'

export const getCreep = createSelector(
  state => state.creep.data,
  creep => creep
);