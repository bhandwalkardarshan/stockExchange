const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Order Schema
const orderSchema = new Schema({
    company_symbol: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    time: {
      type: Date,
      required: true,
      default: Date.now()
    }
  });
  
const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };