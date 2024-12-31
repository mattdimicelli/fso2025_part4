const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
blogRouter.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find({}).populate('user');
  res.json(blogs);
});

blogRouter.post('/api/blogs', async (req, res) => {
  const randomUser = await User.findOne({});
  const blog = new Blog({...req.body, user: randomUser.id });
  const result = await blog.save();
  const populatedBlog = await Blog.findById(result.id).populate('user');
  res.status(201).json(populatedBlog);
});

blogRouter.patch('/api/blogs/:id', async (req, res) => {
  const likes = req.body.likes;
  const id = req.params.id;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true });
    res.status(200).json(updatedBlog);
  } catch(e) {
    res.status(400).json({ error: e.message })
  }

});

blogRouter.delete('/api/blogs/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletedItem = await Blog.findByIdAndDelete(id);
    if (deletedItem.id === id) {
      res.status(204).end();
    } else {
      res.status(400).end();
    }
  } catch(e) {
    res.status(400).end();
  }
});

module.exports = blogRouter;