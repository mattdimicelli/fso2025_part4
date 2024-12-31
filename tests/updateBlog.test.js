const app = require('../app');
const supertest = require('supertest');
const { test, beforeEach, after } = require('node:test');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const { strictEqual } = require('assert')
const assert = require('assert');


beforeEach(async () => {
  await Blog.deleteMany({});
})
test('can update the number of likes', async () => {
  const blog = new Blog({
    title: "New blog",
    author: "Matt Di Micelli",
    url: "http://something.com",
    likes: 7,
  });
  await blog.save();
  const updates = { likes: 8 };
  const updatedBlog = await supertest(app).patch(`/api/blogs/${blog.id}`).send(updates);
  strictEqual(updatedBlog.body.likes, 8);
});

test('if the number of likes is not a positive integer, will get 400 status code with an error msg', async() => {
  const blog = new Blog({
    title: "New blog",
    author: "Matt Di Micelli",
    url: "http://something.com",
    likes: 7,
  });
  await blog.save();
  const updates = { likes: 'nice!' };
  const response = await supertest(app).patch(`/api/blogs/${blog.id}`).send(updates).expect(400);
  assert.strictEqual(response.body.error !== undefined, true);
});

after(async () => {
  await mongoose.connection.close();
});