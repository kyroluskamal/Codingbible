import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MediaController } from 'src/Helpers/apiconstants';
import { Attachments, HttpResponsesObject } from 'src/models.model';

@Injectable({
  providedIn: 'root'
})
export class MediaService
{

  constructor(private httpClient: HttpClient) { }

  SendImages(files: File[]): Observable<Attachments[]>
  {
    console.log(files);
    const formData = new FormData();
    for (let file of files)
    {
      formData.append('files', file);
    }
    return this.httpClient.post<Attachments[]>(MediaController.Upload, formData);
  }
  GetAll(): Observable<Attachments[]>
  {
    return this.httpClient.get<Attachments[]>(MediaController.GetAll);
  }
  Delete(id: number): Observable<HttpResponsesObject>
  {
    return this.httpClient.delete<HttpResponsesObject>(`${MediaController.Delete}/${id}`);
  }
  UpdateAttactment(attachments: Attachments): Observable<HttpResponsesObject>
  {
    return this.httpClient.put<HttpResponsesObject>(`${MediaController.Update}`, attachments);
  }
  BindImageToPost(postId: number, attachId: number): Observable<HttpResponsesObject>
  {
    return this.httpClient.post<HttpResponsesObject>(`${MediaController.BindAttachmentToPost}/${postId}/${attachId}`, null);
  }
  DeleteFromPost(postId: number, attachId: number): Observable<HttpResponsesObject>
  {
    return this.httpClient.delete<HttpResponsesObject>(`${MediaController.DeleteFromPost}/${postId}/${attachId}`);
  }
}
