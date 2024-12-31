const { test, describe, after, beforeEach } = require('node:test');
const assert = require('assert');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const mongoose = require('mongoose');
const User = require('../models/user');

const blogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  }
]

beforeEach(async () => {
  await Blog.deleteMany({});
});

describe('posting a blog', () => {
  test('... will increase the blog count by one', async() => {
    for (let i = 0; i < blogs.length; i++) {
      const blog = new Blog(blogs[i]);
      await blog.save();
    }

    const newBlog = {
      title: "New blog",
      author: "Matt Di Micelli",
      url: "http://something.com",
      likes: 7,
    };
    await supertest(app).post('/api/blogs').send(JSON.stringify(newBlog)).set('Content-Type', 'application/json');
    const response = await supertest(app).get('/api/blogs');
    const dbBlogs = response.body;
    assert.strictEqual(7, dbBlogs.length);
  });

  test('... will create a blog with matching data in the DB', async () => {
    const newBlog = {
      title: "New blog",
      author: "Matt Di Micelli",
      url: "http://something.com",
      likes: 7,
    };
    await supertest(app).post('/api/blogs').send(JSON.stringify(newBlog)).set('Content-Type', 'application/json');
    const response = await supertest(app).get('/api/blogs');
    const dbNewBlog = response.body[0];
    assert.strictEqual(dbNewBlog.title, newBlog.title);
    assert.strictEqual(dbNewBlog.author, newBlog.author);
    assert.strictEqual(dbNewBlog.url, newBlog.url);
    assert.strictEqual(dbNewBlog.likes, newBlog.likes);
  });

  test('... will cause any user from the db to be designated as its creator', async () => {
    let user1 = {
      name: 'Matt Di Micelli',
      hash: 'ooglyboogly',
      username: 'mdimicelli',
    };
    let user2 = {
      name: 'Meri',
      hash: 'ooglyboogly',
      username: 'santaella',
    };
    user1 = new User(user1);
    user2 = new User(user2);
    await user1.save();
    await user2.save();

    const newBlog = {
      title: "New blog",
      author: "Matt Di Micelli",
      url: "http://something.com",
      likes: 7,
    };
    await supertest(app)
      .post('/api/blogs')
      .send(JSON.stringify(newBlog))
      .set('Content-Type', 'application/json')
      .expect(201)
      .expect((res) => {
        assert.ok(res.body.user);
    })
  })
});


after(async () => {
  await mongoose.connection.close();
});