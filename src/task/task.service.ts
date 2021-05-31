import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) {}

    getTask(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    //********************REFACTORING *************************/
    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({
            id,
            user,
        });
        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return found;
    }

    async deleteTask(id: string, user: User): Promise<void> {
        const { affected } = await this.taskRepository.delete({ id, user });
        if (affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async updateTask(
        id: string,
        status: TaskStatus,
        user: User,
    ): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await this.taskRepository.save(task);
        return task;
    }

    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }
}
