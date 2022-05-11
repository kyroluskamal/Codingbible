import { Injectable } from '@angular/core';
import { CourseCategory } from 'src/models.model';
import { ApiCallService } from './api-call.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CoursesController } from 'src/Helpers/apiconstants';

@Injectable({
  providedIn: 'root'
})
export class CourseCategoryService extends ApiCallService<CourseCategory>
{
  constructor(private HttpClient: HttpClient)
  {
    super(HttpClient);
  }

  GetCategoryBySlug(slug: string): Observable<CourseCategory>
  {
    return this.HttpClient.get<CourseCategory>(`${CoursesController.GetCategoryBySlug}/${slug}`);
  }
  IsCatSlug_NOT_Unique(slug: string): Observable<boolean>
  {
    return this.HttpClient.get<boolean>(`${CoursesController.IsCatSlug_NOT_Unique}/${slug}`);
  }
}
