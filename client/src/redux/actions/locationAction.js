import { createAction,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import config from '../../config/default.json'

export const selectLocationType = createAction('CHANGE_SELECTED_TYPE')

export const selectLocLvl = createAction('CHANGE_SELECTED_LOCATION_LVL')

export const selectLocation = createAction('CHANGE_SELECTED_LOCATION')

export const selectedCreepInLocation = createAction('CHANGE_SELECTED_CREEP_IN_LOCATION')

export const fetchLocation = createAsyncThunk('location/fetchLoc', async (lvl) => {
  const data = axios.get(`${config.serverUrl}/api/location?lvl=${lvl}`).then(
    res => res.data)
  return data;
});

export const fetchCreepsInLocation = createAsyncThunk('location/fetchCreeps', async (namesArr) => {
  const data = axios.post(`${config.serverUrl}/api/creeps/locationCreeps`,namesArr).then(
    res => res.data)
  return data;
});