const express = require('express');
const { getAllUsers, getOneUserById } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware.protect, authMiddleware.isAdmin, getAllUsers);
router.get('/user/:id', getOneUserById);
module.exports = router;    