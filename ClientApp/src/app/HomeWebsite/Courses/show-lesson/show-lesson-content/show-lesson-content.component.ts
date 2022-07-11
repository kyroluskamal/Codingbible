import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription, switchMap, tap } from 'rxjs';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { Course, Lesson } from 'src/models.model';
import { GetCourseById } from 'src/State/CourseState/course.actions';
import { selectCourseByID } from 'src/State/CourseState/course.reducer';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { GetLessonBySlug } from 'src/State/LessonsState/Lessons.actions';
import { selectLessonBySlug } from 'src/State/LessonsState/Lessons.reducer';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-show-lesson-content',
  templateUrl: './show-lesson-content.component.html',
  styleUrls: ['./show-lesson-content.component.css']
})
export class ShowLessonContentComponent implements OnInit
{

  params$ = this.activatedRoute.params;
  LessonBySlug$: Observable<{ course: Course | undefined, lesson: Lesson | undefined; }> = new Observable<{ course: Course | undefined, lesson: Lesson | undefined; }>();
  slug: string = '';
  isArabic$ = this.store.select(selectLang);
  isArabicSubscription: Subscription = new Subscription();
  currentLesson: Lesson = new Lesson();
  isArabic: boolean = false;
  currentCourse: Course = new Course();
  constructor(private store: Store,
    private breadcrumb: BreadcrumbService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void
  {
    this.LessonBySlug$ = this.params$.pipe(
      tap(params =>
      {
        this.slug = decodeURIComponent(params['slug']);
      }),
      switchMap(params => combineLatest([this.store.select(selectLessonBySlug(this.slug))])),
      tap(res =>
      {
        if (res[0])
        {
          this.currentLesson = res[0];
        }
        if (res[0] == undefined)
        {
          this.store.dispatch(GetLessonBySlug({ slug: this.slug }));
        }
      }),
      switchMap(lesson => combineLatest([this.store.select(selectCourseByID(lesson[0]?.courseId!))]).pipe(
        tap(x =>
        {
          if (x[0])
          {
            this.currentCourse = x[0];
          } else if (this.currentLesson)
          {
            this.store.dispatch(GetCourseById({ id: lesson[0]?.courseId! }));
          }
        }),
        map(x =>
        {
          return { course: x[0], lesson: lesson[0] };
        }),
      )),
      map(x => x)
    );
    this.isArabicSubscription = this.isArabic$.pipe(
      tap(isArabic => this.isArabic = isArabic),
      switchMap(_ => combineLatest([this.LessonBySlug$.pipe(map(res =>
      {
        if (res.lesson)
        {
          this.currentLesson = res.lesson;
        } else
        {

        }
        this.breadcrumb.set("@courseSlug", res.course?.name!);
        this.breadcrumb.set("@lessonSlug", this.currentLesson?.name!);
        if (this.currentLesson.isArabic)
          this.breadcrumb.set("@lessonHome", 'الدروس');
        else
          this.breadcrumb.set("@lessonHome", 'Lessons');
        return res.lesson ? res : null;
      }))])),
    ).subscribe(r =>
    {
      if (r[0]?.lesson)
      {
        if (this.isArabic !== r[0]?.lesson?.isArabic)
        {
          if (this.isArabic)
          {
            this.router.navigate(['', 'ar', HomeRoutes.Courses.Home, r[0]?.course?.otherSlug!,
              HomeRoutes.Courses.Lesson, r[0]?.lesson?.otherSlug!]);
          }
          else
          {
            this.router.navigate(['', HomeRoutes.Courses.Home, r[0]?.course?.otherSlug!,
              HomeRoutes.Courses.Lesson, r[0]?.lesson?.otherSlug!]);
          }
        }
      }
    });
  }
}
