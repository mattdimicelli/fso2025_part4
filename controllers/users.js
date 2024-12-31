const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

userRouter.post('/api/users', async (req, res) => {
  //get username, password, and name
  const { username, password, name } = req.body;
  if (password == null) {
    return res.status(400).json({ error: 'must give password' });
  }
  if (password.length < 3) {
    return res.status(400).json({ error: 'pw length must be 3 or more' });
  }
  // encrypt password
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    // create User object
    const user = new User({ username, name, hash });
    // save User object
    await user.save();
    //successful: 201 and return saved user
    res.status(201).json(user);
  } catch(e) {
    // console.log(e)
    res.status(400).json({ error: e.message });
  }
});

userRouter.get('/api/users', async (req, res) => {
  const users = await User.find({}).populate('blogs');
  res.status(200).json(users);
})

module.exports = userRouter;