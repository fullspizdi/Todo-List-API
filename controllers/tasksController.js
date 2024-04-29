const Task = require('../models/task');

const tasksController = {
  getAllTasks: async (req, res) => {
    try {
      const tasks = await Task.find({});
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error: error });
    }
  },

  createTask: async (req, res) => {
    try {
      const task = new Task({
        description: req.body.description,
        completed: req.body.completed
      });
      const savedTask = await task.save();
      res.status(201).json(savedTask);
    } catch (error) {
      res.status(400).json({ message: 'Error creating task', error: error });
    }
  },

  getTaskById: async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task', error: error });
    }
  },

  updateTask: async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ message: 'Error updating task', error: error });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task', error: error });
    }
  }
};

module.exports = tasksController;
