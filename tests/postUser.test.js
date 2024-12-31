const { test, after, beforeEach } = require('node:test');
const assert = require('assert');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const mongoose = require('mongoose');

beforeEach(async () => {
  await User.deleteMany({});
});
test('post request to /api/users with username, pw, and name will result in 201 and user returned', async () => {
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
      assert.strictEqual(res.body.name, 'Matt Di Micelli')  ;
      assert.strictEqual(res.body.username, 'mdimicelli');
      assert.ok(res.body.id);
    });
});

test('usernames less than three chars will result in 400 and an error msg and no user is created', async () => {
  const user = {
    name: 'Matt Di Micelli',
    password: 'ooglyboogly',
    username: 'md',
  };
  await supertest(app)
  .post('/api/users')
  .send(JSON.stringify(user))
  .set('Content-Type', 'application/json')
  .expect(400)
  .expect((res) => {
    assert.strictEqual(res.body.error, 'User validation failed: username: Path `username` (`md`) is shorter than the minimum allowed length (3).');
  })
  const users = await User.find({});
  assert.strictEqual(users.length, 0);
});

test('passwords less than three chars will result in 400 and an error msg, and no user is created', async () => {
  const user = {
    name: 'Matt Di Micelli',
    password: 'oo',
    username: 'mdimicelli',
  };
  await supertest(app)
  .post('/api/users')
  .send(JSON.stringify(user))
  .set('Content-Type', 'application/json')
  .expect(400)
  .expect((res) => {
    assert.strictEqual(res.body.error, 'pw length must be 3 or more');
  })
  const users = await User.find({});
  assert.strictEqual(users.length, 0);
});



after(async () => {
  await mongoose.connection.close();
});