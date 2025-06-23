const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app');
const Task = require('../../models/Tasks');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterEach(async () => {
    await Task.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe('Task Routes - Integration Tests', () => {
    test('POST/api/tasks -> should create a task', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({ title: 'Test Task' });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('Test Task');
    });
    test('GET /api/tasks -> should return all tasks', async () => {
        await Task.create({ title: 'Sample Task' });
        const res = await request(app).get('/api/tasks');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe('Sample Task');
    });
    test('GET /api/tasks/:id → should return a specific task', async () => {
        const task = await Task.create({ title: 'Specific Task' });

        const res = await request(app).get(`/api/tasks/${task._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Specific Task');
    });

    test('PUT /api/tasks/:id → should update a task', async () => {
        const task = await Task.create({ title: 'Old Title' });

        const res = await request(app)
            .put(`/api/tasks/${task._id}`)
            .send({ title: 'Updated Title' });

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Updated Title');
    });

    test('DELETE /api/tasks/:id → should delete a task', async () => {
        const task = await Task.create({ title: 'To be deleted' });

        const res = await request(app).delete(`/api/tasks/${task._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    });
});