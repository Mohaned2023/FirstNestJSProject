import {
    Body, Controller, Delete, 
    Get, Logger, Param, ParseIntPipe,
    Patch, Post, Query, UseGuards, UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { TaskService } from './task.service';
import { taskStatus } from './task-status.enum';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTaskFilterDto } from './dtos/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/user.docorator';
import { User } from 'src/auth/uset.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TaskController {
    private readonly logger = new Logger('TaskController')

    constructor(private taskService: TaskService) { }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto, @GetUser() user:User ): Promise<Task[]> {
        this.logger.verbose(`User '${user.username}' retrieving all tasks. Filters : ${JSON.stringify(filterDto)}`)
        return this.taskService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user:User ): Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTask: CreateTaskDto, @GetUser() user:User ): Promise<Task> {
        this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTask)}`)
        return this.taskService.createTask(createTask, user);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user:User): Promise<void> {
        return this.taskService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updataTask(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: taskStatus,
        @GetUser() user:User
    ): Promise<Task> {
        return this.taskService.updataTask(id, status,user);
    }
}
