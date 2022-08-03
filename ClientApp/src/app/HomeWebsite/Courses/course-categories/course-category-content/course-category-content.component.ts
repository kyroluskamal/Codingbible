import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, combineLatest, map, Observable, Subscription, switchMap, take, tap } from 'rxjs';
import { HomeRoutes, NOT_READY } from 'src/Helpers/router-constants';
import { Course, CourseCategory } from 'src/models.model';
import { CoursesPerCategoryService } from 'src/Services/courses-per-category.service';
import { TitleAndMetaService } from 'src/Services/title-and-meta.service';
import { GetCourseCategoryBy_Slug } from 'src/State/CourseCategoryState/CourseCategory.actions';
import { selectCourseCategoryBySlug, select_CourseCategory_HttpResponseError } from 'src/State/CourseCategoryState/CourseCategory.reducer';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-course-category-content',
  templateUrl: './course-category-content.component.html',
  styleUrls: ['./course-category-content.component.css']
})
export class CourseCategoryContentComponent implements OnInit, OnDestroy
{
  isArabic: boolean = false;
  isArabicSubscription: Subscription = new Subscription();
  CoursesInCategory: Course[] = [];
  slug: string = '';
  loading: boolean = true;
  HomeRoutes = HomeRoutes;
  currentCourseCategory: CourseCategory | null = null;
  constructor(private store: Store,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleAndMeta: TitleAndMetaService,
    private breadcrumb: BreadcrumbService,
    private coursePerCategoryService: CoursesPerCategoryService) { }

  ngOnDestroy(): void
  {
    this.isArabicSubscription.unsubscribe();
  }

  ngOnInit(): void
  {
    this.isArabicSubscription = this.store.select(selectLang).pipe(
      tap(isArabic => { this.isArabic = isArabic; }),
      switchMap(res => combineLatest([
        this.activatedRoute.params.pipe(
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
          map(r => r),
        )]).pipe(
          switchMap(res => 
          {
            return combineLatest(
              [this.coursePerCategoryService.GetCoursesInCategoryById(res[0]?.id!).pipe(
                tap(coursesPerCategory =>
                {
                  if (coursesPerCategory.length > 0)
                  {
                    for (let coursePerCat of coursesPerCategory)
                    {
                      this.CoursesInCategory.push(coursePerCat.course!);
                    }
                  } else
                  {
                    this.store.dispatch(GetCourseCategoryBy_Slug({ slug: this.slug }));
                  }
                }),
                catchError(err => { this.CoursesInCategory = []; return res; }),
                map(x => res[0])
              ), this.store.select(select_CourseCategory_HttpResponseError)]).pipe(
                map(x => { return { cat: res[0], error: x[1] }; })
              );
          }),
          map(res => res),
        )),
      map(res => res),
    ).subscribe(
      response =>
      {
        if (response.cat)
        {
          this.currentCourseCategory = response.cat;
          this.titleAndMeta.setSEO_Requirements(
            `${response.cat.title}`,
            response.cat.description, '',
            `${HomeRoutes.Courses.Home}/${HomeRoutes.Courses.Categories}/${response.cat.slug}`, this.isArabic);
          if (this.isArabic)
          {
            this.breadcrumb.set('@courseCategories', 'الاقسام');
          } else
          {
            this.breadcrumb.set('@courseCategories', 'Categories');
          }
          if (this.isArabic !== response.cat?.isArabic)
          {
            if (response.cat.otherSlug)
            {
              if (this.router.url.includes(HomeRoutes.Courses.Home + '/' + HomeRoutes.Courses.Categories))
                if (this.isArabic)
                  this.router.navigate(['', 'ar', HomeRoutes.Courses.Home, HomeRoutes.Courses.Categories, response.cat?.otherSlug]);
                else
                  this.router.navigate(['', HomeRoutes.Courses.Home, HomeRoutes.Courses.Categories, response.cat?.otherSlug]);
            } else
            {
              this.router.navigate(response.cat?.isArabic ? [NOT_READY] : [`/ar/${NOT_READY}`]);
            }
          }
          this.breadcrumb.set('@CourseCatContent', response.cat?.name!);
          this.loading = false;
        } else if (response.error)
        {
          this.titleAndMeta.notFoundTitle(this.isArabic);
          this.loading = false;
        }
      }
    );
  }
}
