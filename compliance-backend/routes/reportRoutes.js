const express = require('express');
const reportController = require('../controllers/reportController');
const authController = require('../controllers/authController');
const { uploadReportFile } = require('../config/multer');

const router = express.Router();

router.use(authController.protect);

router.get('/', reportController.getAllReports);
router.get('/framework/:frameworkId', reportController.getAllReports);
router.get('/:id', reportController.getReport);
router.post('/framework/:frameworkId/generate', reportController.generateReport);
router.get('/:id/download', reportController.downloadReport);
router.delete('/:id', reportController.deleteReport);

module.exports = router;