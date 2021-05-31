import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
});
const mockUser = {
    username: 'jhonny',
    id: 'someID',
    password: 'somePassword',
    task: [],
};

describe('TaskService', () => {
    let taskService: TaskService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TaskService,
                { provide: TaskRepository, useFactory: mockTaskRepository },
            ],
        }).compile();
        taskService = module.get(TaskService);
        taskRepository = module.get(TaskRepository);
    });

    describe('getTask', () => {
        it('calls TaskRepository.getTasks and returns the result', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');
            const result = await taskService.getTask(null, mockUser);
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('Calls TaskRepository.findOne and return the result', async () => {
            const mockTask = {
                title: 'Test tile',
                description: 'Test desc',
                id: 'someId',
                status: TaskStatus.OPEN,
            };
            taskRepository.findOne.mockResolvedValue(mockTask);
            const result = await taskService.getTaskById('someID', mockUser);
            expect(result).toEqual(mockTask);
        });
        it('Calls TaskRepository.findOne and handles an error', async () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(
                taskService.getTaskById('someId', mockUser),
            ).rejects.toThrow();
        });
    });
});
