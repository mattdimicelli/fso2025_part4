const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogRouter.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find({}).populate('user');
  res.json(blogs);
});

blogRouter.post('/api/blogs', async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id);
    const blog = new Blog({...req.body, user: user.id });
    const result = await blog.save();
    const populatedBlog = await Blog.findById(result.id).populate('user');
    res.status(201).json(populatedBlog);
  } catch(e) {
    if (e.name === 'JsonWebTokenError' && (e.message === 'jwt must be provided' || e.message === 'jwt malformed')) {
      return res.status(401).json({ error: 'token invalid' })
    } else {
      console.log(e);
      return;
    }
  }
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
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const blogId = req.params.id;

  try {
    const theBlog = await Blog.findById(blogId);
    await theBlog.populate('user');
    console.log('the blog', theBlog);
    console.log('decoded token id', decodedToken.id);
    if (theBlog.user.id === decodedToken.id) {
      const deletedItem = await Blog.findByIdAndDelete(blogId);
      if (deletedItem.id === blogId) {
        res.status(204).end();
      } else {
        res.status(400).end();
      }
    }

  } catch(e) {
    res.status(400).end();
  }
});

module.exports = blogRouter;