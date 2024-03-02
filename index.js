const express = require('express');
const { connection } = require('./Config/db')
const cors = require('cors');
const winston = require('winston');
const companyRoutes = require('./Routes/company.routes'); // replace with the actual path to your company routes
const app = express();
app.use(express.json())
require('dotenv').config()

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Middleware for logging errors
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  next(err);
});

app.use(express.json());

// Define a whitelist array of allowed origins
const whitelist = ['https://legendary-malasada-09214f.netlify.app','http://localhost:5173'];

// Configure CORS to dynamically set the allowed origin
app.use(cors());

// Use the company routes
app.use('/api', companyRoutes);

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
