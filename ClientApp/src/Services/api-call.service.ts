import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponsesObject } from 'src/models.model';

@Injectable({
  providedIn: 'root'
})
export class ApiCallService<T> {

  constructor(private httpClient: HttpClient) { }

  GetAll(apiUrl: string): Observable<T[]>
  {
    return this.httpClient.get<T[]>(apiUrl);
  }
  GetById(apiUrl: string, id: number): Observable<T>
  {
    return this.httpClient.get<T>(`${apiUrl}/${id}`);
  }
  Add(apiUrl: string, model: T): Observable<T>
  {
    return this.httpClient.post<T>(apiUrl, model);
  }
  Delete(apiUrl: string, id: number): Observable<HttpResponsesObject>
  {
    return this.httpClient.delete<HttpResponsesObject>(`${apiUrl}/${id}`);
  }
  Update(apiUrl: string, model: T): Observable<HttpResponsesObject>
  {
    return this.httpClient.put<HttpResponsesObject>(apiUrl, model);
  }
}
