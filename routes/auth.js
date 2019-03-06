const router = require('express').Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.createUser);
router.post('/login', userController.authUser);
router.get('/users', userController.getUsers);
router.get('/user/:id', userController.getUser);

module.exports = router;