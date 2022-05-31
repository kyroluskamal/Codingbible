import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoursesController } from 'src/Helpers/apiconstants';
import { HttpResponsesObject, Lesson } from 'src/models.model';
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
  GetLessonsByCourseId(CourseId: number): Observable<Lesson[]>
  {
    return this.HttpClient.get<Lesson[]>(`${CoursesController.GetLessonsByCourseId}/${CourseId}`);
  }
  ChangeStatus(Lesson: Lesson): Observable<HttpResponsesObject>
  {
    return this.HttpClient.put<HttpResponsesObject>(CoursesController.ChangLessonStatus, Lesson);
  }
  IsLessonSlug_NOT_Unique(slug: string)
  {
    return this.HttpClient.get<HttpResponsesObject>(`${CoursesController.IsLessonSlug_NOT_Unique}/${slug}`);
  }
}
