const taskController = require('../../controllers/taskController');
const Task = require('../../models/Tasks');
const httpMocks = require('node-mocks-http');
jest.mock('../../models/Tasks');

describe('Task Controller- Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('getAllTasks should return list of all tasks', async () => {
        const fakeTasks = [{ title: 'Task 1' }, { title: 'Taks 2' }];
        Task.find.mockReturnValue({
            sort: jest.fn().mockResolvedValue(fakeTasks)
        });
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        res.json = jest.fn();
        await taskController.getAllTasks(req, res);
        expect(Task.find).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(fakeTasks);
    });
    test('getTaskById should return task by ID', async () => {
        const fakeTask = { title: 'Single Task' };
        Task.findById.mockResolvedValue(fakeTask);
        const req = httpMocks.createRequest({ params: { id: '123' } });
        const res = httpMocks.createResponse(fakeTask);
        res.json = jest.fn();
        await taskController.getTaskById(req, res);
        expect(Task.findById).toHaveBeenCalledWith('123');
        expect(res.json).toHaveBeenCalledWith(fakeTask);
    });
    test('createTask should save and return new task', async () => {
        const body = { title: 'New Task' };
        const savedTask = { _id: '123abc', ...body };
        const req = httpMocks.createRequest({ body });
        const res = httpMocks.createResponse();
        res.status = jest.fn(() => res);
        res.json = jest.fn();
        const mockSave = jest.fn().mockResolvedValue(savedTask);
        Task.mockImplementation(() => ({
            ...savedTask,
            save: mockSave
        }));
        await taskController.createTask(req, res);
        expect(mockSave).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining(savedTask));
    });
    test('updateTask should update and return updated task', async () => {
        const updatedTask = { title: 'Updated Task' };
        Task.findByIdAndUpdate.mockResolvedValue(updatedTask);
        const req = httpMocks.createRequest({
            params: { id: 'abc' },
            body: updatedTask
        });
        const res = httpMocks.createResponse();
        res.json = jest.fn();
        await taskController.updateTask(req, res);
        expect(Task.findByIdAndUpdate).toHaveBeenCalledWith('abc', updatedTask, { new: true });
        expect(res.json).toHaveBeenCalledWith(updatedTask);
    });
    test('deleteTask should delete a task', async () => {
        Task.findByIdAndDelete.mockResolvedValue({});
        const req = httpMocks.createRequest({ params: { id: 'xyz' } });
        const res = httpMocks.createResponse();
        res.json = jest.fn();
        await taskController.deleteTask(req, res);
        expect(Task.findByIdAndDelete).toHaveBeenCalledWith('xyz');
        expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted' });
    });
});