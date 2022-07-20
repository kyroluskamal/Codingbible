import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription, switchMap, tap } from 'rxjs';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { Course } from 'src/models.model';
import { GetCourseBy_Slug } from 'src/State/CourseState/course.actions';
import { selectCourseBySlug, select_Course_HttpResponseError } from 'src/State/CourseState/course.reducer';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-all-sections-home',
  templateUrl: './all-sections-home.component.html',
  styleUrls: ['./all-sections-home.component.css']
})
export class AllSectionsHomeComponent implements OnInit, OnDestroy
{
  isArabic: boolean = false;
  courseSlug: string = '';
  currentCourse: Course | undefined = undefined;
  loading: boolean = true;
  HomeRoutes = HomeRoutes;
  isArabicSubscription: Subscription = new Subscription();

  constructor(private store: Store,
    private breadCrumb: BreadcrumbService,
    private router: Router,
    private title: Title,
    private activatedRoute: ActivatedRoute) { }
  ngOnDestroy(): void
  {
    this.isArabicSubscription.unsubscribe();
  }

  ngOnInit(): void
  {
    this.isArabicSubscription = this.store.select(selectLang).pipe(
      tap(isArabic => this.isArabic = isArabic),
      switchMap(_ =>
        this.activatedRoute.pathFromRoot[3].params.pipe(
          tap(x => this.courseSlug = decodeURIComponent(x['slug'])),
          switchMap(_ => this.store.select(selectCourseBySlug(this.courseSlug)).pipe(
            tap(x =>
            {
              this.currentCourse = x;
              if (!x)
              {
                this.store.dispatch(GetCourseBy_Slug({ slug: this.courseSlug }));
              }
            }),
          ))
        )
      )
    ).pipe(
      switchMap(course => this.store.select(select_Course_HttpResponseError).pipe(
        map(x => { return { course: course, error: x }; }),
      ))
    ).subscribe(x =>
    {
      this.currentCourse = x.course;
      if (this.isArabic)
        this.breadCrumb.set('@sectionHome', "الفصول");
      else
        this.breadCrumb.set('@sectionHome', "Sections");
      if (x.course)
      {
        this.title.setTitle(`${this.currentCourse?.name}`);
        this.breadCrumb.set("@courseSlug", this.currentCourse?.name!);
        if (this.isArabic !== x.course.isArabic)
        {
          if (this.isArabic)
          {
            this.router.navigate(['', 'ar', HomeRoutes.Courses.Home, x.course?.otherSlug!,
              HomeRoutes.Courses.Section]);
          }
          else
          {
            this.router.navigate(['', HomeRoutes.Courses.Home, x?.course?.otherSlug!,
              HomeRoutes.Courses.Section]);
          }
        }
        this.loading = false;
      } else if (x.error)
      {
        this.title.setTitle(this.isArabic ? 'Not Found' : 'خطأ 404');

        this.loading = false;
      }
    });
  }

}
