const express = require('express');
const router = express.Router();
const ordersController = require('../Controllers/order');

router.post('/', ordersController.createOrder);
router.get('/', ordersController.getAllOrders);
router.get('/:id', ordersController.getOrderById);
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;
