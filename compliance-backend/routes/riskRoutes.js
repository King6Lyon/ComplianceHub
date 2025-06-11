const express = require('express');
const riskController = require('../controllers/riskController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/', riskController.getRiskAssessments);
router.get('/framework/:frameworkId', riskController.getRiskAssessments);
router.get('/:id', riskController.getRiskAssessment);
router.post('/', riskController.createRiskAssessment);
router.patch('/:id', riskController.updateRiskAssessment);
router.delete('/:id', riskController.deleteRiskAssessment);
router.post('/:id/risks', riskController.addRisk);
router.patch('/:id/risks/:riskId', riskController.updateRisk);
router.delete('/:id/risks/:riskId', riskController.deleteRisk);

module.exports = router;