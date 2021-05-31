import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.DONE,
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS
    ]


    transform(value: any) {
        value = value.toUpperCase()
        if(!this.isStatusValida(value)){
            throw new BadRequestException(`"${value}" is a invalid status`)
        }
    }


    private isStatusValida(status:any){
        const idx  = this.allowedStatuses.indexOf(status)
        return idx !== -1
    }

    
}