const express = require('express');
const mongoose = require('mongoose');
const cookies = require('cookie-parser');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const { errors } = require('celebrate');

const app = express();
const router = require('./routes');

app.use(cookies());
app.use(express.json());

app.use(router);

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(3000);
