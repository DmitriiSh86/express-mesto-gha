const Card = require('../models/cards');

module.exports.getUsers = (req, res) => {
  Card.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  Card.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  Card.create({ name, about, avatar })
    .then((film) => res.send({ data: film }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
