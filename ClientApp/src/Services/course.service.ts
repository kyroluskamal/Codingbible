import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoursesController } from 'src/Helpers/apiconstants';
import { Course, HttpResponsesObject } from 'src/models.model';
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
  ChangeStatus(course: Course): Observable<HttpResponsesObject>
  {
    return this.HttpClient.put<HttpResponsesObject>(CoursesController.ChangStatus, course);
  }
}
