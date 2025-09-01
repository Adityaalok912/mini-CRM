import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../utils/api";

const API_URL = "/api/leads";

const initialState = {
  leads: [],
  stats: [],
  statusCount: {},
  lead: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

export const createLead = createAsyncThunk(
  "leads/createLead",
  async (leadData, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();

      const res = await api.post(`${API_URL}`, leadData, {
        headers: {
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async ({ page, status = "", search = "" }, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();

      const res = await api.get(`${API_URL}`, {
        params: { page, status, search },
        headers: {
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async ({ id, leadData }, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();

      const res = await api.patch(`${API_URL}/${id}`, leadData, {
        headers: {
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      });

      return res.data; // updated lead object
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (leadId, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();

      await api.delete(`${API_URL}/${leadId}`, {
        headers: {
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      });

      return leadId; // return only ID to remove from state
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);



export const fetchLeadById = createAsyncThunk(
  "leads/fetchLeadById",
  async (leadId, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();

      const res = await api.get(`${API_URL}/${leadId}`, {
        headers: {
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      });

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const convertLead = createAsyncThunk(
  "leads/convertLead",
  async (leadId, thunkAPI) => {
    try {
      const { auth } = thunkAPI.getState();

      const res = await api.post(
        `${API_URL}/${leadId}/convert`,
        {}, // body (empty in this case)
        {
          headers: {
            Authorization: `Bearer ${auth.user.accesstoken}`,
          },
        }
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// Fetch stats for last 14 days
export const getLeadStats = createAsyncThunk(
  "leads/getStats",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accesstoken;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await api.get(`${API_URL}/stats`, config);
      return res.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get leads count by status
export const getLeadsStatusCount = createAsyncThunk(
  "leads/getStatusCount",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.accesstoken;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get(`/api/leads/status-count`, config);
      return res.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leads = action.payload.leads;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchLeadById.pending, (state) => {
        state.status = "loading";
        state.lead = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.lead = null;
      })
      .addCase(createLead.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Add the newly created lead to the list
        if (Array.isArray(state.leads)) {
          state.leads.unshift(action.payload);
        } else {
          state.leads = [action.payload];
        }
      })
      .addCase(createLead.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteLead.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.leads = state.leads.filter((lead) => lead._id !== action.payload);
        state.lead = null; // clear detail page data
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateLead.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lead = action.payload;
        const index = state.leads.findIndex(
          (l) => l._id === action.payload._id
        );
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getLeadStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLeadStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload;
      })
      .addCase(getLeadStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getLeadsStatusCount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLeadsStatusCount.fulfilled, (state, action) => {
        state.statusCount = action.payload;
      })
      .addCase(getLeadsStatusCount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default leadsSlice.reducer;
