const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

// Get all tasks
router.get('/', tasksController.getAllTasks);

// Create a new task
router.post('/', tasksController.createTask);

// Get a single task by ID
router.get('/:id', tasksController.getTaskById);

// Update a task by ID
router.put('/:id', tasksController.updateTask);

// Delete a task by ID
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
