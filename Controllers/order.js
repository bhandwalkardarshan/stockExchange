const {Order} = require('../Models/order.model');
const winston = require('winston');

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Controller method for creating a new order
exports.createOrder = async (req, res) => {
  try {
    // const { company_symbol, price, time } = req.body;
    const newOrder = new Order(req.body)
    await newOrder.save()
    res.status(201).send(newOrder);
  } catch (error) {
    logger.error(error.message);
    res.status(400).send({ error: 'Error creating company' });
  }
};

// Controller method for getting all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: 'Error fetching company' });
  }
};

// Controller method for getting a specific order by ID
exports.getOrderById = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (error) {
        logger.error(error.message);
        res.status(400).send({ error: 'Error fetching company' });
    }
  };
  

// Controller method for deleting an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: 'Error deleting order' });
  }
};
