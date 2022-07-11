import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription, switchMap, tap } from 'rxjs';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { Course, Section } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { GetCourseBy_Slug } from 'src/State/CourseState/course.actions';
import { selectCourseBySlug } from 'src/State/CourseState/course.reducer';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { GetLessonByCourseId, GetLessonsByCourseId } from 'src/State/LessonsState/Lessons.actions';
import { LoadSections } from 'src/State/SectionsState/sections.actions';
import { selectAllSections } from 'src/State/SectionsState/sections.reducer';
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
  CourseSections$: Observable<Section[]> = new Observable<Section[]>();
  slug: string = "";
  HomeRoutes = HomeRoutes;
  isArabic: boolean = false;
  AllSections: Section[] = [];
  RootSections: Section[] = [];
  @ViewChild("playlistContainer") playlistContainer: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  constructor(private store: Store,
    private router: Router,
    private breadcrumb: BreadcrumbService,
    private tree: TreeDataStructureService<Section>,
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
        this.slug = decodeURIComponent(params['slug'].split('#')[0]);
      }),
      switchMap(_ => combineLatest([this.store.select(selectCourseBySlug(this.slug))])),
      tap(courseBySlug =>
      {
        if (courseBySlug[0])
        {
          this.CurrentCourse = courseBySlug[0];
          this.store.dispatch(GetLessonByCourseId({ courseId: this.CurrentCourse.id! }));
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
      switchMap(r => combineLatest([this.store.select(selectAllSections).pipe(map(
        sections =>
        {
          this.AllSections = sections.filter(section => section.courseId == r[0]?.id);
          return { course: r[0], sections: this.AllSections };
        }
      ),
        tap(sections =>
        {
          if (sections.sections.length < 2)
            this.store.dispatch(LoadSections());
        }),
      )]))
    ).subscribe(r =>
    {
      if (r[0].course)
      {
        if (this.isArabic !== r[0]?.course?.isArabic)
        {
          if (this.isArabic)
          {
            this.router.navigate(['', 'ar', HomeRoutes.Courses.Home, r[0]?.course?.otherSlug!]);
          }
          else
          {
            this.router.navigate(['', HomeRoutes.Courses.Home, r[0]?.course?.otherSlug!]);
          }
          this.breadcrumb.set("@courseSlug", this.CurrentCourse?.name!);
        }
        this.tree.setData(r[0].sections);
        this.AllSections = this.tree.finalFlatenArray();
        this.RootSections = this.tree.getRawRoots();
      }
    });

  }


}
