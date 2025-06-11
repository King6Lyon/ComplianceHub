const express = require('express');
const taskController = require('../controllers/taskController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTask);
router.post('/', taskController.createTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/complete', taskController.completeTask);

module.exports = router;