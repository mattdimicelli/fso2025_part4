const app = require('../app');
const supertest = require('supertest');
const { test, describe, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const User = require('../models/user');
const assert = require('assert');
const Blog = require('../models/blog');

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
})
describe('doing GET request to /api/users', () => {
  test('... will return users that have username, name, id with 200 status', async () => {
    const user1 = new User({
      username: 'mdimicelli',
      hash: 'something',
      name: 'Matt Di Micelli'
    });
    const user2 = new User({
      username: 'mrd2689a',
      hash: 'somethingelse',
      name: 'Ryan'
    })
    await user1.save();
    await user2.save();
    await supertest(app)
      .get('/api/users')
      .expect('Content-Type', /application\/json/)
      .expect((res) => {
        res.body.forEach((user) => {
          assert.ok(user.username);
          assert.ok(user.id);
          assert.ok(user.name);
        })
    })
  })
  test('... will show the blogs for users that have blogs', async () => {
    let user = {
      name: 'Matt Di Micelli',
      hash: 'ooglyboogly',
      username: 'mdimicelli',
    };
    user = new User(user);
    await user.save();
    let blog1 = {
      title: "New blog",
      author: "Matt Di Micelli",
      url: "http://something.com",
      likes: 7,
    };
    let blog2 = {
      title: "New blog2",
      author: "Matt Di Micelli2",
      url: "http://something.com2",
      likes: 72,
    };
    blog1 = new Blog(blog1);
    blog2 = new Blog(blog2);
    await blog1.save();
    await blog2.save();

    user.blogs = [ blog1.id, blog2.id ];
    await user.save();

    blog1.user = user.id;
    await blog1.save();

    blog2.user = user.id;
    await blog2.save();

    await supertest(app)
    .get('/api/users')
    .expect('Content-Type', /application\/json/)
    .expect((res) => {
      assert.strictEqual(res.body[0].blogs.some(blog => blog.title === 'New blog' && blog.author === 'Matt Di Micelli' && blog.url === 'http://something.com' && blog.likes === 7), true);
      assert.strictEqual(res.body[0].blogs.some(blog => blog.title === 'New blog2' && blog.author === 'Matt Di Micelli2' && blog.url === 'http://something.com2' && blog.likes === 72), true);
    })
  })
})

after(async () => {
  await mongoose.connection.close();
})
