import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoursesController } from 'src/Helpers/apiconstants';
import { CoursesPerCategory } from 'src/models.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesPerCategoryService
{

  constructor(private httpClient: HttpClient) { }
  GetCoursesInCategoryBySlug(slug: string): Observable<CoursesPerCategory[]>
  {
    return this.httpClient.get<CoursesPerCategory[]>(`${CoursesController.GetCoursesInCategoryBySlug}/${slug}`);
  }
  GetCoursesInCategoryById(id: number): Observable<CoursesPerCategory[]>
  {
    return this.httpClient.get<CoursesPerCategory[]>(`${CoursesController.GetCoursesInCategoryById}/${id}`);
  }
}
