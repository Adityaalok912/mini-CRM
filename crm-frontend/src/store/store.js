import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import leadsReducer from '../features/leads/leadsSlice';
import customersReducer from '../features/customers/customersSlice';
import tasksReducer from '../features/tasks/tasksSlice';
import activityReducer from '../features/activity/activitySlice';
import userReducer from "../features/user/userSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
    customers: customersReducer,
    tasks: tasksReducer,
    activity: activityReducer,
    users: userReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
