import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import config from '../../config/default.json'

export const fetchHero = createAsyncThunk('hero/fetchHero', async (login) => {
  const data = axios.get(`${config.serverUrl}/api/heroes/${login}`).then(
    res => res.data)
  return data;
});

