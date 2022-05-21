import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lesson } from 'src/models.model';
import { ApiCallService } from './api-call.service';

@Injectable({
  providedIn: 'root'
})
export class LessonsService extends ApiCallService<Lesson>
{

  constructor(private HttpClient: HttpClient)
  {
    super(HttpClient);
  }
}
