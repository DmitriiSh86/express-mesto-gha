const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  const owner = req.user._id;
  Card.create({
    name, link, owner, likes, createdAt,
  })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Произошла ошибка' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(new Error('badId'))
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message === 'badId') {
        return res.status(404).send({ message: 'Произошла ошибка' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Произошла ошибка' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('badId'))
  .then((card) => res.status(200).send({ data: card }))
  .catch((err) => {
    if (err.message === 'badId') {
      return res.status(404).send({ message: 'Произошла ошибка' });
    }
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Произошла ошибка' });
    }
    return res.status(500).send({ message: 'Произошла ошибка' });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('badId'))
  .then((card) => res.status(200).send({ data: card }))
  .catch((err) => {
    if (err.message === 'badId') {
      return res.status(404).send({ message: 'Произошла ошибка' });
    }
    if (err.name === 'CastError') {
      return res.status(400).send({ message: 'Произошла ошибка' });
    }
    return res.status(500).send({ message: 'Произошла ошибка' });
  });
