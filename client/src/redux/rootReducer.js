import { combineReducers } from '@reduxjs/toolkit'
import { reducer as formReducer } from 'redux-form'
import heroReducer from './reducers/heroReducer'

export default combineReducers({
  hero: heroReducer,
  form: formReducer
})