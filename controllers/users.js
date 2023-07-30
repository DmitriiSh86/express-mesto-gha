const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require('../errors/not-found-error');
const BadRequest = require('../errors/bad-request-error');
const InternalServer = require('../errors/internal-server-error');
const Unauthorized = require('../errors/unauthorized-error');
const Conflict = require('../errors/conflict-error');
const { CREATED_STATUS } = require('../utils/status');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => next(new InternalServer('Произошла ошибка')));
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new NotFoundError('Пользоваетеля с таким id нет'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        return next(err);
      }
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданный id некорректен'));
      }
      return next(new InternalServer('Произошла ошибка'));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED_STATUS).send({
      user: {
        _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некоректные данные'));
      }
      if (err.code === 11000) {
        return next(new Conflict('Пользователь с текущим email уже занят'));
      }
      return next(new InternalServer());
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некоректные данные'));
      }
      return next(new InternalServer());
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некоректные данные'));
      }
      return next(new InternalServer());
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const payload = { _id: user._id };
      const token = jwt.sign(payload, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token);
      return res.send({ user: payload });
    })
    .catch(() => next(new Unauthorized('Неверные данные')));
};

module.exports.getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(new NotFoundError('Пользоваетеля с таким id нет'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        return next(err);
      }
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданный id некорректен'));
      }
      return next(new InternalServer());
    });
};
