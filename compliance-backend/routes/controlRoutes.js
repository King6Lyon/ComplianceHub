const express = require('express');
const controlController = require('../controllers/controlController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/framework/:frameworkId', controlController.getAllControls);
router.get('/:id', controlController.getControl);
router.get('/framework/:frameworkId/categories', controlController.getControlCategories);

router.use(authController.protect, authController.restrictTo('admin'));

router.post('/', controlController.createControl);
router.patch('/:id', controlController.updateControl);
router.delete('/:id', controlController.deleteControl);

module.exports = router;