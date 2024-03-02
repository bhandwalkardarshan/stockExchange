const express = require('express');
const { connection } = require('./Config/db')
const cors = require('cors');
const winston = require('winston');
const redis = require('redis');
const companyRoutes = require('./Routes/company.routes'); 
const orderRoutes =  require("./Routes/order.routes");
const app = express();
app.use(express.json())
require('dotenv').config()

const REDIS_PORT = process.env.PORT || 6379;

// const client = redis.createClient(REDIS_PORT);
// Export the Redis client
// module.exports = { client };


app.use(express.json());

// Configure CORS to dynamically set the allowed origin
app.use(cors());

// Use the company routes
app.use('/api/companies', companyRoutes);
app.use('/api/orders', orderRoutes);


const port = process.env.PORT || 3031;
app.listen(port, async () => {
    try{
        await connection
        console.log('Connected to MongoDB');
      }
    catch(err) {
        console.error('Error connecting to MongoDB:', err.message);
    };
    
    console.log(`Server running at http://localhost:${port}`);
});
