const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Company Schema
const companySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  symbol: {
    type: String,
    required: true,
    unique: true
  }
});

const Company = mongoose.model('Company', companySchema);

module.exports = { Company };