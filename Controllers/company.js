// controllers/companyController.js

const { Company } = require('../Models/company.model'); // replace with the actual path to your Company model
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
    console.log(companies)
    res.send(companies);
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
    res.send(company);
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
    res.send(company);
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
    res.send(company);
  } catch (error) {
    logger.error(error.message);
    res.status(500).send({ error: 'Error deleting company' });
  }
};
