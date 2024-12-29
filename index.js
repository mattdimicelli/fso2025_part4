require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

const Blog = mongoose.model('Blog', blogSchema);

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(express.json());

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
})

app.post('/api/blogs', async (req, res) => {
  const blog = new Blog(req.body);
  const result = await blog.save();
  res.status(201).json(result);
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})