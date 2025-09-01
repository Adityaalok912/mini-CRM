import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/customers";

// Async thunks for customer operations
export const getCustomers = createAsyncThunk(
  "customers/getAll",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      // const token = thunkAPI.getState().auth.user.accesstoken;
      // const config = {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // };
      // const response = await axios.get(API_URL, config);

      const { auth } = thunkAPI.getState();
      const response = await axios.get(`http://localhost:5000/api/customers`, {
        params: { page },
        headers: {
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      });
      // const data = await response.json();

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

export const getCustomerById = createAsyncThunk(
  "customers/getById",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accesstoken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_URL}/${id}`, config);
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

export const createCustomer = createAsyncThunk(
  "customers/create",
  async (customerData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accesstoken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(API_URL, customerData, config);
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

export const updateCustomer = createAsyncThunk(
  "customers/update",
  async ({ id, customerData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accesstoken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${API_URL}/${id}`,
        customerData,
        config
      );
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

export const addNoteToCustomer = createAsyncThunk(
  "customers/addNote",
  async ({ id, note }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accesstoken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${API_URL}/${id}/notes`,
        { body: note },
        config
      );
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

export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accesstoken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/${id}`, config);
      return id; // Return the ID of the deleted customer
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

// Get customer count
export const getCustomersCount = createAsyncThunk(
  "customers/getCount",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accesstoken;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_URL}/count`, config);
      return res.data.totalCustomers;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  count: 0,
  customers: [],
  currentCustomer: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    resetCustomersStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
    resetCurrentCustomer: (state) => {
      state.currentCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getCustomers
      .addCase(getCustomers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers = action.payload.customers;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // getCustomerById
      .addCase(getCustomerById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCustomerById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentCustomer = action.payload;
      })
      .addCase(getCustomerById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // createCustomer
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.push(action.payload);
      })
      // updateCustomer
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (
          state.currentCustomer &&
          state.currentCustomer._id === action.payload._id
        ) {
          state.currentCustomer = action.payload;
        }
      })
      // addNoteToCustomer
      .addCase(addNoteToCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (
          state.currentCustomer &&
          state.currentCustomer._id === action.payload._id
        ) {
          state.currentCustomer = action.payload;
        }
      })
      // deleteCustomer
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(
          (c) => c._id !== action.payload
        );
      })
      .addCase(getCustomersCount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCustomersCount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.count = action.payload;
      })
      .addCase(getCustomersCount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetCustomersStatus, resetCurrentCustomer } =
  customersSlice.actions;
export default customersSlice.reducer;
