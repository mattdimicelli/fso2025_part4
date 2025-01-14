const app = require('../app');
const supertest = require('supertest');
const { test, describe, beforeEach, after } = require('node:test');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const blogsFile = require('../controllers/blogs');

beforeEach(async () => {
  await Blog.deleteMany({});
})
describe('a delete request to /api/blogs/:id', () => {
  test('will return a 204 status code if the id supplied is valid, a valid token is supplied and the blog belongs to the user making the request, and the resource is deleted', async () => {
    let userToLogIn = {
      username: 'mdimicelli',
      name: 'Matt Di Micelli',
      hash: hash,
    }
    userToLogIn = new User(userToLogIn);
    await userToLogIn.save();

    const newBlog = new Blog({
      title: "New blog",
      author: "Matt Di Micelli",
      url: "http://something.com",
      likes: 7,
      user: userToLogIn,
    });
    await newBlog.save();

    const userPw = 'thisisthepassword';
    const saltRounds = 10;
    const hash = await bcrypt.hash(userPw, saltRounds);



    const token = jwt.sign({ username: 'mdimicelli', id: userToLogIn.id }, process.env.SECRET);

    await supertest(app).delete(`/api/blogs/${newBlog.id}`).set('Authorization', `Bearer ${token}`).expect(204);

  });
  test.skip('will return a 400 status code if the id supplied is invalid', async () => {
    await supertest(app).delete('/api/blogs/invalidid').expect(400);
  })
});

after(async () => {
  await mongoose.connection.close();
});