const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

userRouter.post('/api/users', async (req, res) => {
  //get username, password, and name
  const { username, password, name } = req.body;
  console.log(username, password, name)
  if (password == null) {
    return res.status(400).json({ error: 'must give password'});
  }
  // encrypt password
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  // create User object
  const user = new User({ username, name, hash });
  // save User object
  await user.save();
  //successful: 201 and return saved user
  res.status(201).json(user);
  // unsuccessful:
});

userRouter.get('/api/users', async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
})

module.exports = userRouter;