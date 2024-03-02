const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Order Schema
const orderSchema = new Schema({
    company_id: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    time: {
      type: Date,
      required: true
    }
  });
  
const Order = mongoose.model('Order', orderSchema);

module.exports = { Order };