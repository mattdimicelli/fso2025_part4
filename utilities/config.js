require('dotenv').config();
const PORT = 3003;
const mongoDbUri = process.env.MONGODB_URI

module.exports = {
  PORT, mongoDbUri,
}