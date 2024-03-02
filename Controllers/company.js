// controllers/companyController.js

const { Company } = require('../Models/company.model'); 
const winston = require('winston');
const { Order } = require('../Models/order.model');
const redis = require('../redis');
// const { client } = require('../index')

// console.log(client)
// Connect to Redis
// client.on('connect', () => {
//   console.log('Connected to Redis');
// });

// // Error handling for Redis connection
// client.on('error', (err) => {
//   console.error('Redis error:', err);
// });

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

exports.createCompany = async (req, res) => {
  try {
    // console.log(req.body)
    const company = new Company(req.body);
    await company.save();
    res.status(201).send(company);
  } catch (error) {
    logger.error(error.message);
    res.status(400).send({ error: 'Error creating company' });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    // console.log(companies)
    res.status(200).send(companies);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: 'Error fetching companies' });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).send({ error: 'Company not found' });
    }
    res.status(200).send(company);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: 'Error fetching company' });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!company) {
      return res.status(404).send({ error: 'Company not found' });
    }
    res.status(200).send({message:"Company is updated",company});
  } catch (error) {
    logger.error(error.message);
    res.status(400).send({ error: 'Error updating company' });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).send({ error: 'Company not found' });
    }
    res.status(200).send(company);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: 'Error deleting company' });
  }
};

exports.statsOfDay = async (req, res) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Generate a unique key for storing the aggregation result in Redis
    const redisKey = `stats:${req.params.symbol}:day-stats`;

    // Check if the result is already cached in Redis
    await redis.get(redisKey, async (err, cachedResult) => {
      if (err) {
        throw new Error('Error fetching data from Redis');
      }

      if (cachedResult) {
        // If data is cached, return it
        res.json(JSON.parse(cachedResult));
      } else {
        // If data is not cached, fetch it from MongoDB and cache it
        const orders = await Order.aggregate([
          {
            $match: {
              company_symbol: req.params.symbol,
              time: {
                $gte: today,
                $lt: tomorrow
              }
            }
          },
          {
            $group: {
              _id: null,
              maxPrice: { $max: "$price" },
              minPrice: { $min: "$price" },
              totalOrders: { $sum: 1 }
            }
          }
        ]);

        // Cache the result in Redis with an expiration time of 1 hour (3600 seconds)
        await redis.setex(redisKey, 3600, JSON.stringify(orders));

        // Return the result to the client
        res.status(200).json({ message: "Statistics for Day", data: orders });
      }
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: 'Error fetching stats' });
  }
};

exports.statsOfMonth = async (req, res) => {
  try {
    const today = new Date();
    today.setDate(1);
    today.setUTCHours(0, 0, 0, 0);

    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    // Generate a unique key for storing the aggregation result in Redis
    const redisKey = `stats:${req.params.symbol}:month-stats}`;

    // Check if the result is already cached in Redis
    await redis.get(redisKey, async (err, cachedResult) => {
      if (err) {
        throw new Error('Error fetching data from Redis');
      }

      if (cachedResult) {
        // If data is cached, return it
        res.status(200).json({ message: "Statistics for Month", data: JSON.parse(cachedResult) });
      } else {
        // If data is not cached, fetch it from MongoDB and cache it
        const orders = await Order.aggregate([
          {
            $match: {
              company_symbol: req.params.symbol,
              time: {
                $gte: today,
                $lt: nextMonth,
              },
            },
          },
          {
            $group: {
              _id: null,
              maxPrice: { $max: '$price' },
              minPrice: { $min: '$price' },
              totalOrders: { $sum: 1 },
            },
          },
        ]);

        // Cache the result in Redis with an expiration time of 1 hour (3600 seconds)
        await redis.setex(redisKey, 3600, JSON.stringify(orders));

        if (orders.length === 0) {
          return res.status(404).json({ message: "No orders found for the month" });
        }

        // Return the result to the client
        res.status(200).json({ message: "Statistics for Month", data: orders });
      }
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: 'Error fetching stats' });
  }
};
