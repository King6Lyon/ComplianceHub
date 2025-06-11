const express = require('express');
const evidenceController = require('../controllers/evidenceController');
const authController = require('../controllers/authController');
const { uploadEvidenceFiles } = require('../config/multer');

const router = express.Router();

router.use(authController.protect);

router.get('/', evidenceController.getAllEvidence);
router.get('/framework/:frameworkId', evidenceController.getAllEvidence);
router.get('/control/:controlId', evidenceController.getAllEvidence);
router.get('/:id', evidenceController.getEvidence);
router.post('/', evidenceController.createEvidence);
router.patch('/:id', evidenceController.updateEvidence);
router.delete('/:id', evidenceController.deleteEvidence);
router.post('/:id/files', uploadEvidenceFiles, evidenceController.uploadEvidenceFiles);
router.delete('/:id/files/:fileId', evidenceController.deleteEvidenceFile);

module.exports = router;