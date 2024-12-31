const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { mongoDbUri } = require('./utilities/config');

mongoose.connect(mongoDbUri);

app.use(cors());
app.use(express.json());
app.use(blogRouter);
app.use(userRouter);


module.exports = app;