import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoursesController } from 'src/Helpers/apiconstants';
import { HttpResponsesObject, Section } from 'src/models.model';
import { ApiCallService } from './api-call.service';

@Injectable({
  providedIn: 'root'
})
export class SectionsService extends ApiCallService<Section>
{

  constructor(private HttpClient: HttpClient)
  {
    super(HttpClient);
  }
  ChangeStatus(section: Section): Observable<HttpResponsesObject>
  {
    return this.HttpClient.put<HttpResponsesObject>(CoursesController.ChangSectionStatus, section);
  }
  GetSectionsByCourseId(courseId: number): Observable<Section[]>
  {
    return this.HttpClient.get<Section[]>(`${CoursesController.GetSectionsByCourseId}/${courseId}`);
  }
}
