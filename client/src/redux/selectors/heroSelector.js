import { createSelector } from '@reduxjs/toolkit'

export const getHero = createSelector(
  state => state.hero.data[0],
  hero => hero
);

export const getBackpack = createSelector(
  state => state.hero.data[0].backpack,
  backpack => backpack
);