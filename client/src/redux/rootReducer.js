import { combineReducers } from '@reduxjs/toolkit'
import { reducer as formReducer } from 'redux-form'
import heroReducer from './reducers/heroReducer'
import locationReducer from './reducers/locationReducer'
import navReducer from './reducers/navReducer'

export default combineReducers({
  hero: heroReducer,
  location: locationReducer,
  nav: navReducer,
  form: formReducer
})