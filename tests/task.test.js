```javascript
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Assuming the Express app is exported from server.js
const Task = require('../models/task');

describe('Task API', () => {
  beforeAll(async () => {
    const url = process.env.MONGODB_URI;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Task.deleteMany({});
  });

  describe('GET /tasks', () => {
    it('should fetch all tasks', async () => {
      const task1 = new Task({ description: 'Task 1', completed: false });
      const task2 = new Task({ description: 'Task 2', completed: true });
      await task1.save();
      await task2.save();

      const res = await request(app).get('/tasks');
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
      expect(res.body[0].description).toEqual('Task 1');
      expect(res.body[1].description).toEqual('Task 2');
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({
          description: 'Buy milk',
          completed: false
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.description).toEqual('Buy milk');
      expect(res.body.completed).toEqual(false);
    });

    it('should not create a task with invalid data', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({
          description: ''
        });
      expect(res.statusCode).toEqual(400);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should fetch a single task', async () => {
      const task = new Task({ description: 'Read a book', completed: false });
      await task.save();

      const res = await request(app).get(`/tasks/${task._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.description).toEqual('Read a book');
    });

    it('should return 404 if task not found', async () => {
      const res = await request(app).get(`/tasks/1234567890ab`);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task', async () => {
      const task = new Task({ description: 'Write code', completed: false });
      await task.save();

      const res = await request(app)
        .put(`/tasks/${task._id}`)
        .send({
          description: 'Write more code',
          completed: true
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.description).toEqual('Write more code');
      expect(res.body.completed).toEqual(true);
    });

    it('should return 404 if task to update not found', async () => {
      const res = await request(app)
        .put(`/tasks/1234567890ab`)
        .send({
          description: 'Non-existent task',
          completed: true
        });
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const task = new Task({ description: 'Delete me', completed: false });
      await task.save();

      const res = await request(app).delete(`/tasks/${task._id}`);
      expect(res.statusCode).toEqual(204);
    });

    it('should return 404 if task to delete not found', async () => {
      const res = await request(app).delete(`/tasks/1234567890ab`);
      expect(res.statusCode).toEqual(404);
    });
  });
});
```
