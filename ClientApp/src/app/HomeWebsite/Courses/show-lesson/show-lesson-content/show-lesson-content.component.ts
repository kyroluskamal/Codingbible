import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Subscription, switchMap, tap } from 'rxjs';
import { PostStatus } from 'src/Helpers/constants';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { Course, Lesson, Section } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { GetCourseBy_Slug } from 'src/State/CourseState/course.actions';
import { selectCourseBySlug, select_Course_HttpResponseError } from 'src/State/CourseState/course.reducer';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { selectLessonBySlug } from 'src/State/LessonsState/Lessons.reducer';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-show-lesson-content',
  templateUrl: './show-lesson-content.component.html',
  styleUrls: ['./show-lesson-content.component.css']
})
export class ShowLessonContentComponent implements OnInit, OnDestroy
{

  slug: string = '';
  HomeRoutes = HomeRoutes;
  isArabicSubscription: Subscription = new Subscription();
  currentLesson: Lesson | null = null;
  isArabic: boolean = false;
  currentCourse: Course | undefined = undefined;
  loading: boolean = true;
  courseSlug: string = '';
  SectionTree: Section[] = [];
  ArrangedLessons: Lesson[] = [];
  currentLessonIndex = 0;

  constructor(private store: Store,
    private breadcrumb: BreadcrumbService,
    private router: Router,
    private tree: TreeDataStructureService<Section>,
    private activatedRoute: ActivatedRoute) { }
  ngOnDestroy(): void
  {
    this.isArabicSubscription.unsubscribe();
  }

  ngOnInit(): void
  {
    this.isArabicSubscription = this.store.select(selectLang).pipe(
      tap(isArabic => this.isArabic = isArabic),
      switchMap(_ => combineLatest([
        //get course by slug
        this.activatedRoute.pathFromRoot[3].params.pipe(
          tap(x => this.courseSlug = decodeURIComponent(x['slug'])),
          switchMap(_ => combineLatest([this.store.select(selectCourseBySlug(this.courseSlug))]).pipe(
            tap(x =>
            {
              if (!x[0])
              {
                this.store.dispatch(GetCourseBy_Slug({ slug: this.courseSlug }));
              }
            }),
            map(x => x[0]),
          ))
        )])),
      map(x => x[0]),
    ).pipe(
      switchMap(course =>
        combineLatest([
          //get lesson by slug if coourse is found
          this.activatedRoute.params.pipe(
            tap(params =>
            {
              this.slug = decodeURIComponent(params['slug']);
            }),
            switchMap(params => combineLatest([this.store.select(selectLessonBySlug(this.slug))])),
          ),
          this.store.select(select_Course_HttpResponseError)
        ]).pipe(
          map(x => { return { course: course, lesson: x[0][0], error: x[1] }; }),
        )
      ),
    ).subscribe(
      r =>
      {
        this.ArrangedLessons = [];
        this.currentLesson = r.lesson!;
        this.currentCourse = r.course;
        if (this.isArabic)
          this.breadcrumb.set("@lessonHome", 'الدروس');
        else
          this.breadcrumb.set("@lessonHome", 'Lessons');
        if (r.lesson && r.course)
        {
          this.tree.setData(r.course.sections);

          this.breadcrumb.set("@courseSlug", r.course?.name!);
          this.breadcrumb.set("@lessonSlug", r.lesson?.name!);

          if (this.isArabic !== r.lesson?.isArabic && this.isArabic !== r.course?.isArabic)
          {
            if (this.isArabic)
            {
              this.router.navigate(['', 'ar', HomeRoutes.Courses.Home, r.course?.otherSlug!,
                HomeRoutes.Courses.Lesson, r.lesson?.otherSlug!]);
            }
            else
            {
              this.router.navigate(['', HomeRoutes.Courses.Home, r?.course?.otherSlug!,
                HomeRoutes.Courses.Lesson, r.lesson?.otherSlug!]);
            }
          }
          this.loading = false;
          this.SectionTree = this.tree.finalFlatenArray().sort((a, b) => a.order - b.order);
          let sectionsThatHasLessons = this.SectionTree.filter(x => x.isLeafSection === true);
          for (let s of sectionsThatHasLessons)
          {

            this.ArrangedLessons.push(...r.course.lessons.filter(x => x.sectionId === s.id
              && x.status === PostStatus.Published && x.isArabic === this.isArabic)
              .sort((a, b) => a.orderWithinSection - b.orderWithinSection));
            this.ArrangedLessons.reduce;
          }
          this.currentLessonIndex = this.ArrangedLessons.findIndex(x => x.id === r.lesson?.id);
        }
        else if (r.course && !r.lesson)
        {
          this.breadcrumb.set("@courseSlug", r.course?.name!);
          this.loading = false;
        }
        if (r.error) { this.loading = false; }
      });
  }
  NextOrPrevious(status: number): void
  {
    console.log(this.currentLessonIndex);
    console.log(this.ArrangedLessons);
    if (this.currentLesson)
    {
      let nextIndex = this.currentLessonIndex + status;
      if (nextIndex >= 0 && nextIndex < this.ArrangedLessons.length)
      {
        let nextLesson = this.ArrangedLessons[nextIndex];
        if (this.isArabic)
        {
          this.router.navigate(['', 'ar', HomeRoutes.Courses.Home, this.currentCourse?.otherSlug!,
            HomeRoutes.Courses.Lesson, nextLesson?.otherSlug!]);
        }
        else
        {
          this.router.navigate(['', HomeRoutes.Courses.Home, this.currentCourse?.otherSlug!,
            HomeRoutes.Courses.Lesson, nextLesson?.otherSlug!]);
        }
        this.currentLessonIndex = nextIndex;
      }
    }
    console.log(this.currentLessonIndex);
  }
}
