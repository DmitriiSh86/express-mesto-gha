/* eslint-disable consistent-return */
const Card = require('../models/cards');
const NotFoundError = require('../errors/not-found-error');
const BadRequest = require('../errors/bad-request-error');
const InternalServer = require('../errors/internal-server-error');
const Forbidden = require('../errors/forbidden-error');
const { CREATED_STATUS } = require('../utils/status');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => next(new InternalServer('Произошла ошибка')));
};

module.exports.createCard = (req, res, next) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  const owner = req.user._id;
  Card.create({
    name, link, owner, likes, createdAt,
  })
    .then((card) => res.status(CREATED_STATUS).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданный некорректные данные'));
      }
      return next(new InternalServer('Произошла ошибка'));
    });
};

module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  const cardFound = await Card.findById(cardId).lean();
  if (!cardFound) {
    return next(new NotFoundError('Неверные данные'));
  }
  const cardOwner = cardFound.owner.valueOf();
  if (userId !== cardOwner) {
    return next(new Forbidden('Это не ваша карточка'));
  }
  Card.deleteOne(cardFound)
    .orFail(new NotFoundError('Карточки с таким id нет'))
    .then((card) => res.send({ data: card }))
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

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFoundError('Карточки с таким id нет'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.statusCode === 404) {
      return next(err);
    }
    if (err.name === 'CastError') {
      return next(new BadRequest('Переданный id некорректен'));
    }
    return next(new InternalServer('Произошла ошибка'));
  });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new NotFoundError('Карточки с таким id нет'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.statusCode === 404) {
      return next(err);
    }
    if (err.name === 'CastError') {
      return next(new BadRequest('Переданный id некорректен'));
    }
    return next(new InternalServer('Произошла ошибка'));
  });
