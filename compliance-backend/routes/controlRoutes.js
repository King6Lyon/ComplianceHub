const express = require('express');
const controlController = require('../controllers/controlController');
const authController = require('../controllers/authController');
const frameworkController = require('../controllers/frameworkController');
const Control = require('../models/Control');

const router = express.Router();

router.use(authController.protect);

router.get('/frameworks/:frameworkId/controls', controlController.getAllControls);

router.get('/getControlsFrameworks',async (req,res)=>{
    try {
        const controls = await Control.find()

        res.status(200).send(controls)
    } catch (error) {
        res.status(500).send('Could not get')
    }
});

router.get('/:id', controlController.getControl);
router.get('/framework/:frameworkId/categories', controlController.getControlCategories);

// Routes protégées (admin uniquement)
router.use(authController.restrictTo('admin'));

router.post('/', controlController.createControl);
router.patch('/:id', controlController.updateControl);
router.delete('/:id', controlController.deleteControl);

module.exports = router;
