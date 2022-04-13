import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsController } from 'src/Helpers/apiconstants';
import { Category } from 'src/models.model';
import { ApiCallService } from './api-call.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends ApiCallService<Category>
{
  constructor(private HttpClient: HttpClient)
  {
    super(HttpClient);
  }

  GetCategoryBySlug(slug: string): Observable<Category>
  {
    return this.HttpClient.get<Category>(`${PostsController.GetCategoryBySlug}/${slug}`);
  }
  IsCatSlug_NOT_Unique(slug: string): Observable<boolean>
  {
    return this.HttpClient.get<boolean>(`${PostsController.IsCatSlug_NOT_Unique}/${slug}`);
  }
}
