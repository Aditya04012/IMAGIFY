const express =require('express');
const mongoose=require('mongoose');
const morgan = require('morgan');
const AppError=require('./utils/AppError')
const userRouter=require('./Routes/userRoutes');
const cors = require('cors');
require('dotenv').config();
const app=express();

console.log(process.env.NODE_ENV)
app.use(cors());
app.use(express.json());


app.use('/api/v1/user', userRouter);



app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message,
    stack: err.stack,
    err: err,
  });
});

module.exports=app;

