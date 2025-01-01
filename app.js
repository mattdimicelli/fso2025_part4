const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { mongoDbUri } = require('./utilities/config');
const loginRouter = require('./controllers/login');

mongoose.connect(mongoDbUri);

app.use(cors());
app.use(express.json());
app.use(blogRouter);
app.use(userRouter);
app.use(loginRouter);


module.exports = app;