const app = require('../app');
const supertest = require('supertest');
const { test, describe, beforeEach, after } = require('node:test');
const mongoose = require('mongoose');
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
})
describe.skip('a delete request to /api/blogs/:id', () => {
  test('will return a 204 status code if the id supplied is valid and the resource is deleted', async () => {
    const newBlog = new Blog({
      title: "New blog",
      author: "Matt Di Micelli",
      url: "http://something.com",
      likes: 7,
    });
    await newBlog.save();
    await supertest(app).delete(`/api/blogs/${newBlog.id}`).expect(204);
  });
  test('will return a 400 status code if the id supplied is invalid', async () => {
    await supertest(app).delete('/api/blogs/invalidid').expect(400);
  })
});

after(async () => {
  await mongoose.connection.close();
});