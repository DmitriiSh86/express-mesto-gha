const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { createUser } = require('../controllers/users');

router.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/)?([a-z0-9._~:/?#@!&'()][*+,;=-]+\.)*[a-z0-9._~:/?#@!&'()*+,;=-]+\.[a-z]{2,}\/?([^\s]*)$/),
  }),
}), createUser);

module.exports = router;
