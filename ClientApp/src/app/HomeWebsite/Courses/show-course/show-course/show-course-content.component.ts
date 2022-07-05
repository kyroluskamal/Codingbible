import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, exhaustMap, forkJoin, map, Observable, Subscription, switchMap, take, tap } from 'rxjs';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { Course } from 'src/models.model';
import { GetCourseBy_Slug } from 'src/State/CourseState/course.actions';
import { selectCourseBySlug } from 'src/State/CourseState/course.reducer';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-show-course',
  templateUrl: './show-course-content.component.html',
  styleUrls: ['./show-course-content.component.css']
})
export class ShowCourseContentComponent implements OnInit, OnDestroy
{
  CurrentCourse: Course | undefined = undefined;
  isArabic$ = this.store.select(selectLang);
  isArabicSubscription: Subscription = new Subscription();
  params$ = this.activatedRoute.params;
  courseBySlug$: Observable<[Course | undefined]> = new Observable<[Course | undefined]>();
  slug: string = "";
  HomeRoutes = HomeRoutes;
  isArabic: boolean = false;
  constructor(private store: Store,
    private router: Router,
    private breadcrumb: BreadcrumbService,
    private activatedRoute: ActivatedRoute) { }
  ngOnDestroy(): void
  {
    this.isArabicSubscription.unsubscribe();
  }

  ngOnInit(): void
  {
    this.courseBySlug$ = this.params$.pipe(
      tap(params =>
      {
        this.slug = decodeURIComponent(params['slug']);
      }),
      switchMap(_ => combineLatest([this.store.select(selectCourseBySlug(this.slug))])),
      tap(courseBySlug =>
      {
        if (courseBySlug[0])
        {
          this.CurrentCourse = courseBySlug[0];
        }
        if (courseBySlug[0] == undefined)
        {
          this.store.dispatch(GetCourseBy_Slug({ slug: this.slug }));
        }
      })
    );
    this.isArabicSubscription = this.isArabic$.pipe(
      tap(isArabic => this.isArabic = isArabic),
      switchMap(_ => combineLatest([this.courseBySlug$.pipe(map(course =>
      {
        if (course[0])
        {
          this.CurrentCourse = course[0];
        }
        this.breadcrumb.set("@courseSlug", this.CurrentCourse?.name!);
        return course[0] ? course[0] : null;
      }))])),
    ).subscribe(r =>
    {
      if (r[0])
      {
        if (this.isArabic !== r[0]?.isArabic)
        {
          if (this.isArabic)
          {
            console.log(this.CurrentCourse?.name);
            this.router.navigate(['', 'ar', HomeRoutes.Courses.Home, decodeURIComponent(r[0]?.otherSlug!)]);
          }
          else
          {
            console.log(this.CurrentCourse?.name);
            this.router.navigate(['', HomeRoutes.Courses.Home, decodeURIComponent(r[0]?.otherSlug!)]);
          }
          this.breadcrumb.set("@courseSlug", this.CurrentCourse?.name!);
        }
      }
    });
  }

}
