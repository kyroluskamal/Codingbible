import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'bypassStyle',
  standalone: true
})
export class BypassStylePipe implements PipeTransform
{
  constructor(private sanitized: DomSanitizer) { }
  transform(value: any)
  {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }

}
