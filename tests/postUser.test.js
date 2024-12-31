const { test, after, beforeEach } = require('node:test');
const assert = require('assert');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const mongoose = require('mongoose');

beforeEach(async () => {
  await User.deleteMany({});
});
test.skip('post request to /api/users with username, pw, and name will result in 201 and user returned', async () => {
  const user = {
    name: 'Matt Di Micelli',
    password: 'ooglyboogly',
    username: 'mdimicelli',
  };
  await supertest(app)
    .post('/api/users')
    .send(JSON.stringify(user))
    .set('Content-Type', 'application/json')
    .expect(201)
    .expect('Content-Type', /application\/json/)
    .expect((res) => {
      console.log(res.body);
      assert.strictEqual(res.body.name, 'Matt Di Micelli')  ;
      assert.strictEqual(res.body.username, 'mdimicelli');
      assert.ok(res.body.hash);
    });
});

after(async () => {
  await mongoose.connection.close();
});