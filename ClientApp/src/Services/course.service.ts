import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from 'src/models.model';
import { ApiCallService } from './api-call.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService extends ApiCallService<Course>
{
  constructor(private HttpClient: HttpClient)
  {
    super(HttpClient);
  }
}
