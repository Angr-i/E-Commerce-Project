const Router = require('express');
const router = new Router();
const BasketController = require('../controllers/basketController');
const checkAuth = require('../middleware/authMiddleaware');

router.post('/', checkAuth, BasketController.create);
router.get('/', checkAuth, BasketController.getAll);
router.delete('/delete', checkAuth, BasketController.deleteOne);

module.exports = router;
