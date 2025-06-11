const express = require('express');
const frameworkController = require('../controllers/frameworkController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', frameworkController.getAllFrameworks);
router.get('/:id', frameworkController.getFramework);
router.get('/:id/progress', authController.protect, frameworkController.getFrameworkProgress);

router.use(authController.protect, authController.restrictTo('admin'));

router.post('/', frameworkController.createFramework);
router.patch('/:id', frameworkController.updateFramework);
router.delete('/:id', frameworkController.deleteFramework);

module.exports = router;