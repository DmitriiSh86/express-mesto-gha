const express = require('express');
const mongoose = require('mongoose');

const {
  createUser, login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

const app = express();
const router = require('./routes');

app.use(express.json());

router.post('/signin', login);
router.post('/signup', createUser);
app.use(auth);
app.use(router);

app.listen(3000);
