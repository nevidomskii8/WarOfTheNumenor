import { createSelector } from '@reduxjs/toolkit'

export const isOpenBackpack = createSelector(
  state => state.nav.isOpenBackpack,
  isOpenBackpack => isOpenBackpack
);