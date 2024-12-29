const { PORT} = require('./utilities/config');
const app = require('./app');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})