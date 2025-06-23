const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../app'); // Import Express app
const Task = require('../../models/Tasks');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Task.deleteMany();
});

describe('API Endpoints - Full Flow', () => {
    test('POST /api/tasks → should create a task', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({ title: 'API Task' });

        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('API Task');
    });

    test('GET /api/tasks → should return tasks', async () => {
        await Task.create({ title: 'API Get Task' });

        const res = await request(app).get('/api/tasks');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].title).toBe('API Get Task');
    });

    test('GET /api/tasks/:id → should return single task', async () => {
        const task = await Task.create({ title: 'Get By ID' });

        const res = await request(app).get(`/api/tasks/${task._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Get By ID');
    });

    test('PUT /api/tasks/:id → should update a task', async () => {
        const task = await Task.create({ title: 'To Update' });

        const res = await request(app)
            .put(`/api/tasks/${task._id}`)
            .send({ title: 'Updated API Task' });

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Updated API Task');
    });

    test('DELETE /api/tasks/:id → should delete task', async () => {
        const task = await Task.create({ title: 'To Delete' });

        const res = await request(app).delete(`/api/tasks/${task._id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Task deleted');
    });
});
