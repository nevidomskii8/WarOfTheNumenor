import { createSelector } from '@reduxjs/toolkit'

export const getHero = createSelector(
  state => state.hero.data[0],
  hero => hero
);