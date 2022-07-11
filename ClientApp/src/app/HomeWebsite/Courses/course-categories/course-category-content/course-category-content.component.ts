import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription, switchMap, take, tap } from 'rxjs';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { Course, CourseCategory } from 'src/models.model';
import { CoursesPerCategoryService } from 'src/Services/courses-per-category.service';
import { GetCourseCategoryBy_Slug } from 'src/State/CourseCategoryState/CourseCategory.actions';
import { selectCourseCategoryBySlug } from 'src/State/CourseCategoryState/CourseCategory.reducer';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-course-category-content',
  templateUrl: './course-category-content.component.html',
  styleUrls: ['./course-category-content.component.css']
})
export class CourseCategoryContentComponent implements OnInit, OnDestroy
{
  isArabic$ = this.store.select(selectLang);
  isArabicSubscription: Subscription = new Subscription();
  CourseCategoryBySlugSubscription: Subscription = new Subscription();
  CourseCategoryBySlug: Observable<{ courses: Course[], category: CourseCategory | undefined; }> = new Observable();
  params$ = this.activatedRoute.params;
  slug: string = '';
  currentCourseCategory: CourseCategory = new CourseCategory();
  constructor(private store: Store,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breadcrumb: BreadcrumbService,
    private coursePerCategoryService: CoursesPerCategoryService) { }

  ngOnDestroy(): void
  {
    this.isArabicSubscription.unsubscribe();
    this.CourseCategoryBySlugSubscription.unsubscribe();
  }

  ngOnInit(): void
  {
    this.CourseCategoryBySlug = this.params$.pipe(
      tap(params =>
      {
        this.slug = decodeURIComponent(params['slug']);
      }),
      switchMap(params => combineLatest([this.store.select(selectCourseCategoryBySlug(this.slug))]).pipe(
        tap(res =>
        {
          if (res[0])
          {
            this.currentCourseCategory = res[0];
          }
          if (res[0] == undefined)
          {
            this.store.dispatch(GetCourseCategoryBy_Slug({ slug: this.slug }));
          }
        }),
        map(r => r[0]),
      )),
      switchMap(res => 
      {
        if (res)
          return combineLatest([this.coursePerCategoryService.GetCoursesInCategoryById(res?.id!)]).pipe(
            map(c =>
            {
              return {
                coursesPerCategory: c[0],
                category: res
              };
            }),
          );
        else
          return new Observable<any>();
      }
      ),
      map(x =>
      {
        let courses: Course[] = [];
        for (let coursePerCat of x?.coursesPerCategory)
        {
          courses.push(coursePerCat.course!);
        }
        return { courses: courses, category: x.category };
      }),
    );
    // this.CourseCategoryBySlugSubscription = this.CourseCategoryBySlug.subscribe();
    this.isArabic$.pipe(
      map(isArabic => isArabic),
      switchMap(res => combineLatest([this.CourseCategoryBySlug]).pipe(
        map(x =>
        {
          return {
            cat: x[0].category,
            isArabic: res
          };
        })
      ))
    ).subscribe(
      response =>
      {
        if (response.cat)
        {
          if (response.isArabic !== response.cat?.isArabic)
          {
            if (this.router.url.includes(HomeRoutes.Courses.Home + '/' + HomeRoutes.Courses.Categories))
              if (response.isArabic)
              {
                this.router.navigate(['', 'ar', HomeRoutes.Courses.Home, HomeRoutes.Courses.Categories, response.cat?.otherSlug]);
                this.breadcrumb.set('@courseCategories', 'الاقسام');
              }
              else
              {
                this.router.navigate(['', HomeRoutes.Courses.Home, HomeRoutes.Courses.Categories, response.cat?.otherSlug]);
                this.breadcrumb.set('@courseCategories', 'Categories');
              }

          }
          this.breadcrumb.set('@CourseCatContent', response.cat?.name!);
        }
      }
    );
  }
}
