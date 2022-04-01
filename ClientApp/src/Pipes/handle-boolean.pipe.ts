import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Boolean'
})
export class HandleBooleanPipe implements PipeTransform
{

  transform(value: boolean, trueReplacement: string, falseReplacement: string): unknown
  {
    if (value)
      return trueReplacement;
    else return falseReplacement;
  }

}
