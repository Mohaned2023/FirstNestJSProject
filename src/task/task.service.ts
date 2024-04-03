import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import {taskStatus } from './task-status.enum';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTaskFilterDto } from './dtos/get-task-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/uset.entity';


@Injectable()
export class TaskService {
    private readonly logger = new Logger('TaskService') ;
    constructor (
        @InjectRepository(Task) private taskRepository: Repository<Task> ,
    ) {}


    async getTasks(filterDto: GetTaskFilterDto, user:User ) : Promise<Task[]> {
        const {status, search } = filterDto ;
        const query = this.taskRepository.createQueryBuilder('task') ;

        query.where('task.userId = :userId', {userId : user.id })

        if (status)
            query.andWhere('task.status = :status', {status} ) ;
        if (search) 
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` } );
        try {
            const tasks = await query.getMany() ;
            return tasks ;
        } catch(error) {
            this.logger.error(`Failed to get tasks for user "${user.username}", Filters: ${JSON.stringify(filterDto)}`, error.stack) ;
            throw new InternalServerErrorException() ;
        }
    }

    async getTaskById(id:number, user:User) : Promise<Task> {
        const found: Task = await this.taskRepository.findOne({ where: {id, userId: user.id} })

        if ( !found ) 
            throw new NotFoundException(`The Task With id '${id}' is Not Found..!`) ;
        return found ;
    }

    async createTask(createTask: CreateTaskDto, user:User) : Promise<Task> {
        const {title, description} = createTask ; 

        const task = new Task() ;
        task.title = title ;
        task.description = description ;
        task.status = taskStatus.OPEN ;
        task.user = user ;
        try {
            await task.save() ;
        } catch(error) {
            this.logger.error(`Failed to create a task for user "${user.username}", Data: ${JSON.stringify(createTask)}`, error.stack) ;
            throw new InternalServerErrorException() ;
        }

        delete task.user ;

        return task ;
    }


    async deleteTask(id:number, user:User ) : Promise<void> {
        const result = await this.taskRepository.delete({id, userId: user.id }) ;
        if (result.affected === 0 ) 
            throw new NotFoundException(`The Task With id '${id}' is Not Found..!`) ;
        return; 
    }


    async updataTask(id:number, status: taskStatus, user:User): Promise<Task> {
        const task : Task = await this.getTaskById(id,user) ;
        task.status = status ;
        await task.save() ;
        return task ;
    }
}
