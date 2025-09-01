import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/activity';

// Async thunk to get the latest activity logs
export const getLatestActivity = createAsyncThunk('activity/getLatest', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.accesstoken;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const initialState = {
  activities: [],
  status: 'idle',
  error: null,
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    resetActivityStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLatestActivity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getLatestActivity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.activities = action.payload;
      })
      .addCase(getLatestActivity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetActivityStatus } = activitySlice.actions;
export default activitySlice.reducer;
