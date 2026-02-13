const express = require('express');
const app = express();

require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.static('./src/public'));

app.get('/', (req, res) => {
  res.render('index');
});

//app.use('/api', require('./routes/api'));

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});