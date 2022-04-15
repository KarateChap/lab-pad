import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
  name: 'deleteChar'
})
export class deleteCharPipe implements PipeTransform{
    transform(value: any, limit: number){
      if (value.length > limit){
        return value.substr(0, limit) + '';
      }
      return value;
    }
}
