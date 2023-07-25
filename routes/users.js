const router = require('express').Router();
const {
  getUsers, getUser, updateProfile, updateAvatar, getMe,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);
router.get('/me', getMe);

module.exports = router;
