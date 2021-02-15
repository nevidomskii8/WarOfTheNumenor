import { combineReducers } from '@reduxjs/toolkit'
import { reducer as formReducer } from 'redux-form'
import creepReducer from './reducers/creepReducer'
import heroReducer from './reducers/heroReducer'
import locationReducer from './reducers/locationReducer'

export default combineReducers({
  hero: heroReducer,
  creep: creepReducer,
  location: locationReducer,
  form: formReducer
})