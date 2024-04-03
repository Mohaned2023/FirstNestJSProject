import { 
    BaseEntity, Column,
    Entity, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";
import { taskStatus } from "./task-status.enum";
import { User } from "src/auth/uset.entity";

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    title: string ;

    @Column() 
    description: string ;

    @Column() 
    status: taskStatus;

    @ManyToOne( type => User, user => user.tasks, {eager: false } )
    user: User

    @Column()
    userId: number ;
}