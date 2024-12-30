const app = require('../app');
const supertest = require('supertest');
const { test, describe, after, beforeEach, before } = require('node:test');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const assert = require('assert');

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
})
test('the return format is json', async() => {
  await supertest(app).get('/api/blogs').expect('Content-Type', /application\/json/);
});

describe('the number of blogs returned matches the number of blogs in the db', () => {
  test('return three blogs', async () => {
    const threeBlogs = blogs.slice(0, 3);
    for (let i = 0; i < threeBlogs.length; i++) {
      const blog = new Blog(threeBlogs[i]);
      await blog.save();
    }
    const response = await supertest(app).get('/api/blogs');
    assert.strictEqual(response.body.length, 3);
  });
});

describe('each blog has an "id" property', () => {
  let dbBlogs;
  before(async () => {
    for (let i = 0; i < blogs.length; i++) {
      const blog = new Blog(blogs[i]);
      await blog.save();
    }
    const response = await supertest(app).get('/api/blogs');
    dbBlogs = response.body;
  })
  test('... which is non-null', async () => {
    let allBlogsHaveIdProp = true;
    dbBlogs.forEach(blog => {
      if (!blog.hasOwnProperty('id') || blog.id === undefined || blog.id === null) {
        allBlogsHaveIdProp = false;
      }
    });
    assert.strictEqual(true, allBlogsHaveIdProp);
  });
  test('... and unique', () => {
    const ids = dbBlogs.map(blog => blog.id);
    assert.strictEqual(true, new Set(ids).size === dbBlogs.length);
  });
});


after(async () => {
  await mongoose.connection.close();
})

