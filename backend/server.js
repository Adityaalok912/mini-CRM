// const express =  require('express');
// const dotenv = require('dotenv').config();
// const port = process.env.PORT || 5000;
// const app = express();
// const colors = require('colors');
// const connectDB = require('./config/db');
// const path = require('path');
// const {errorHandler} = require('./middleware/errorMiddleware')

import express from 'express';
import 'dotenv/config';
import colors from 'colors';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import  errorHandler  from './middleware/errorMiddleware.js';

//

import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import customerRoutes from './routes/customerRoutes.js';

// Get the directory name for serving static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 5000;
const app = express();

connectDB()
//middelware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//
// API Routes
// Your API routes should be defined here, for example:
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/customers', customerRoutes);

//

//serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  );
} else {
  app.get('/', (req, res) => res.send('Please set to production'));
}

//

app.use(errorHandler)

app.listen(port, ()=> console.log(`server started on port ${port}`));