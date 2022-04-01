import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'postStatus'
})
export class PostStatusPipe implements PipeTransform
{

  transform(value: number, ...args: unknown[]): unknown
  {
    if (value === 0)
    {
      return "Draft";
    } if (value === 1)
      return "Published";
    return null;
  }

}
