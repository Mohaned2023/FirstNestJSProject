import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports : [
        TypeOrmModule.forFeature([Task]),
        AuthModule,
    ],
    controllers: [TaskController],
    providers: [TaskService]
})
export class TaskModule {}
