const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/users');

mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
  useNewUrlParser: true,
});

const app = express();

app.use('/users', require('./routes/users'));

app.use(express.json());

app.use(router);

app.listen(3000);
