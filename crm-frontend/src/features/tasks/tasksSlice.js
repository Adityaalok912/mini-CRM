import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../utils/api";

const API_URL = "/api/tasks";

// Async thunks for task operations
export const getTasks = createAsyncThunk(
  "tasks/getAll",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accesstoken;
      const config = {
        params: { page },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.get(API_URL, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
//
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accesstoken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await api.delete(`${API_URL}/${id}`, config);
      return id;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
//
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();
      const response = await api.patch(
        `http://localhost:5000/api/tasks/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/create",
  async (taskData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accesstoken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.post(API_URL, taskData, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, taskData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accesstoken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.patch(`${API_URL}/${id}`, taskData, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getOpenTasksCount = createAsyncThunk(
  "tasks/getOpenCount",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accesstoken;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get(`/api/tasks/open-count`, config);
      return res.data.openTasks;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getOverdueTasks = createAsyncThunk(
  "tasks/getOverdue",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accesstoken;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get("/api/tasks/overdue", config);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);


const initialState = {
  openCount: 0,
  tasks: [],
  overdue: [],
  status: "idle",
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    resetTasksStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload.tasks;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.tasks.findIndex(
          (task) => task._id === updatedTask._id
        );
        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getOpenTasksCount.fulfilled, (state, action) => {
        state.openCount = action.payload;
      })
      .addCase(getOverdueTasks.fulfilled, (state, action) => {
      state.overdue = action.payload;
    });
  },
});

export const { resetTasksStatus } = tasksSlice.actions;
export default tasksSlice.reducer;
