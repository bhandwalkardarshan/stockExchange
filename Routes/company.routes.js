// routes/companyRoutes.js

const express = require('express');
const router = express.Router();
const companyController = require('../Controllers/company'); 

router.post('/', companyController.createCompany);
router.get('/', companyController.getCompanies);
router.get('/:id', companyController.getCompany);
router.put('/:id', companyController.updateCompany);
router.delete('/:id', companyController.deleteCompany);

router.get('/:symbol/day-stats', companyController.statsOfDay);
router.get('/:symbol/month-stats', companyController.statsOfMonth);


module.exports = router;
