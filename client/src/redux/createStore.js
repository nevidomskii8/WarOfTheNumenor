import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer';

export default () => {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
  })
};