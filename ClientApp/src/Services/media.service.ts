import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MediaController } from 'src/Helpers/apiconstants';

@Injectable({
  providedIn: 'root'
})
export class MediaService
{

  constructor(private httpClient: HttpClient) { }

  SendImages(files: File[])
  {
    const formData = new FormData();
    for (let file of files)
    {
      formData.append('files', file);
    }
    return this.httpClient.post(MediaController.Upload, formData);
  }
}
