import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import config from '../../config/default.json'

export const fetchCreep = createAsyncThunk('creep/fetchCreep', async (name) => {
  const data = axios.get(`${config.serverUrl}/api/creeps/${name}`).then(
    res => res.data)
  return data;
});