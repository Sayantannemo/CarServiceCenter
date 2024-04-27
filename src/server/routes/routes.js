// backend/routes/routes.js

const express = require('express');
const router = express.Router();

// Import route files
const customersRouter = require('./customers');
const maintenancePersonnelRouter = require('./maintenancePersonnel');
const adminRouter = require('./admin');

// Mount route files on their respective base paths
router.use('/customers', customersRouter);
router.use('/maintenance-personnel', maintenancePersonnelRouter);
router.use('/admin', adminRouter);

module.exports = router;