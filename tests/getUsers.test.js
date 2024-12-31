const app = require('../app');
const supertest = require('supertest');
const { test, describe, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const User = require('../models/user');
const assert = require('assert');

beforeEach(async () => {
  await User.deleteMany({});
})
describe('doing GET request to /api/users', () => {
  test('will return users that have username, name, and id, with 200 status', async () => {
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
})

after(async () => {
  await mongoose.connection.close();
})
