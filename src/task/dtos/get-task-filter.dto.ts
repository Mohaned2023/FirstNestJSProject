import { taskStatus } from "../task-status.enum";

export class GetTaskFilterDto {
    status: taskStatus ;
    search: string ;
}