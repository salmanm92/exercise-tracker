const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const db = require('./db');
const bodyParser = require('body-parser');

app.use(cors())
app.use(express.static('public'))


app.use(bodyParser.urlencoded({ extended: false }))
const userRoutes = require('./routes/userRoutes');

app.use('/api/users',userRoutes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
