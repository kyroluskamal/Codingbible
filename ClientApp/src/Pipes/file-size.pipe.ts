import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform
{

  transform(value: number, volume: string = "kb"): unknown
  {
    let size_kb = value / 1024;
    let size_mb = size_kb / 1024;
    let size_gb = size_mb / 1024;
    if (volume !== "kb")
    {
      if (volume === "mb")
      {
        return size_mb.toFixed(2) + ' MB';
      } else
        return size_gb.toFixed(2) + ' GB';
    }
    return size_kb.toFixed(2) + ' KB';

  }

}
