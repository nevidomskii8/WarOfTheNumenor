import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import config from '../../config/default.json'

export const fetchHero = createAsyncThunk('hero/fetchHero', async (login) => {
  const data = axios.get(`${config.serverUrl}/api/heroes/${login}`).then(
    res => res.data)
  return data;
});

export const saveHeroData = createAsyncThunk('hero/saveHero', async (hero) => {
  const data = axios.put(`${config.serverUrl}/api/heroes/${hero._id}`,hero).then(
    res => res.data)
  return data;
});

