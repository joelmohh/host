const express = require('express');
const app = express();

require('dotenv').config();

//const mongoose = require('mongoose');
//mongoose.connect(process.env.MONGO_URI)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.static('./src/public'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', require('./src/routes/auth.api.js'));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});