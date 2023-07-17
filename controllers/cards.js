const Card = require('../models/cards');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/error');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  const owner = req.user._id;
  Card.create({
    name, link, owner, likes, createdAt,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некоректные данные' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(new Error('badId'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'badId') {
        return res.status(NOT_FOUND).send({ message: 'Карточки с таким id нет' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданный id некорректен' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('badId'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.message === 'badId') {
      return res.status(NOT_FOUND).send({ message: 'Карточки с таким id нет' });
    }
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданный id некорректен' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('badId'))
  .then((card) => res.send({ data: card }))
  .catch((err) => {
    if (err.message === 'badId') {
      return res.status(NOT_FOUND).send({ message: 'Карточки с таким id нет' });
    }
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданный id некорректен' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
  });
