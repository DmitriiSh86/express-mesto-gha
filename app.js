const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();
const router = require('./routes');

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64b38b4e5079b672bed62892',
  };
  next();
});
app.use(router);

app.listen(3000);
