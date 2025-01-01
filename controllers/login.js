const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const passwordCorrect = user == null
    ? false
    : await bcrypt.compare(password, user.hash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userDataForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userDataForToken, process.env.SECRET);

  res
    .status(200)
    .send({ token, username: user.username, name: user.name });
})

module.exports = loginRouter;