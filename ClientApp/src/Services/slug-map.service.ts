import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoursesController } from 'src/Helpers/apiconstants';
import { SlugMap_Category, SlugMap_CourseCategory, SlugMap_Courses, SlugMap_Lessons, SlugMap_Posts, SlugMap_Sections } from 'src/models.model';

@Injectable({
  providedIn: 'root'
})
export class SlugMapService
{
  constructor(private httpClient: HttpClient) { }

  Get_SlugMap_Posts_By_Slug(slug: string)
  {
    return this.httpClient.get<SlugMap_Posts>(`${CoursesController.Get_SlugMap_Posts_By_Slug}?slug=${slug}`);
  }
  Get_SlugMap_CourseCategories_By_Slug(slug: string)
  {
    return this.httpClient.get<SlugMap_CourseCategory>(`${CoursesController.Get_SlugMap_CourseCategories_By_Slug}?slug=${slug}`);
  }
  Get_SlugMap_Categories_By_Slug(slug: string)
  {
    return this.httpClient.get<SlugMap_Category>(`${CoursesController.Get_SlugMap_Categories_By_Slug}?slug=${slug}`);
  }
  Get_SlugMap_Lessons_By_Slug(slug: string)
  {
    return this.httpClient.get<SlugMap_Lessons>(`${CoursesController.Get_SlugMap_Lessons_By_Slug}?slug=${slug}`);
  }
  Get_SlugMap_Sections_By_Slug(slug: string)
  {
    return this.httpClient.get<SlugMap_Sections>(`${CoursesController.Get_SlugMap_Sections_By_Slug}?slug=${slug}`);
  }
  Get_SlugMap_Courses_By_Slug(slug: string)
  {
    return this.httpClient.get<SlugMap_Courses>(`${CoursesController.Get_SlugMap_Courses_By_Slug}?slug=${slug}`);
  }
  Get_All_SlugMap_Courses()
  {
    return this.httpClient.get<SlugMap_Courses[]>(`${CoursesController.Get_All_SlugMap_Courses}`);
  }
  Get_All_SlugMap_Sections()
  {
    return this.httpClient.get<SlugMap_Sections[]>(`${CoursesController.Get_All_SlugMap_Sections}`);
  }
  Get_All_SlugMap_Lessons()
  {
    return this.httpClient.get<SlugMap_Lessons[]>(`${CoursesController.Get_All_SlugMap_Lessons}`);
  }
  Get_All_SlugMap_Categories()
  {
    return this.httpClient.get<SlugMap_Category[]>(`${CoursesController.Get_All_SlugMap_Categories}`);
  }
  Get_All_SlugMap_CourseCategories()
  {
    return this.httpClient.get<SlugMap_CourseCategory[]>(`${CoursesController.Get_All_SlugMap_CourseCategories}`);
  }
  Get_All_SlugMap_Posts()
  {
    return this.httpClient.get<SlugMap_Posts[]>(`${CoursesController.Get_All_SlugMap_Posts}`);
  }
}
