import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

import { Logger } from '@nestjs/common';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
    private logger = new Logger('TaskController'); //Si pasamos el argumento al Logger nos indicara de donde proviene este log
    constructor(private taskService: TaskService) {}

    @Get()
    getAllTasks(
        @Query() filterDto: GetTaskFilterDto,
        @GetUser() user: User,
    ): Promise<Task[]> {
        this.logger.verbose(
            `User ${
                user.username
            } retrieving all task. Filters: ${JSON.stringify(filterDto)}`,
        );
        return this.taskService.getTask(filterDto, user);
    }
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    ): Promise<Task> {
        return this.taskService.createTask(createTaskDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
        return this.taskService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatus: UpdateTaskStatusDto,
        @GetUser() user: User,
    ): Promise<Task> {
        const { status } = updateTaskStatus;
        return this.taskService.updateTask(id, status, user);
    }
}
