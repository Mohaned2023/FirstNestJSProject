import { BadRequestException, PipeTransform } from "@nestjs/common";
import { taskStatus } from "../task-status.enum";


export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses: string[] = [
        taskStatus.OPEN,
        taskStatus.IN_PROSSES,
        taskStatus.DONE
    ]

    transform(value: string ) {
        if (!value) 
            throw new BadRequestException('No body in the requsret..!') ;
        value = value.toUpperCase() ;
        
        if (!this.isStatusValid(value))
            throw new BadRequestException(`'${value}' is an invalid status..!`) ;
        return value ;
    }

    private isStatusValid(status:string ) : boolean {
        const index:number = this.allowedStatuses.indexOf( status ) ;
        return index !== -1 ;
    }
}