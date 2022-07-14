import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, Subscription, switchMap, tap, combineLatest, catchError, withLatestFrom } from 'rxjs';
import { PostStatus } from 'src/Helpers/constants';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { Course, Section } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { GetCourseBy_Slug } from 'src/State/CourseState/course.actions';
import { selectCourseBySlug, select_Course_HttpResponseError } from 'src/State/CourseState/course.reducer';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { GetLessonByCourseId } from 'src/State/LessonsState/Lessons.actions';
import { LoadSections } from 'src/State/SectionsState/sections.actions';
import { selectAllSections, Select_Sections_ByCourseId } from 'src/State/SectionsState/sections.reducer';
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
  courseBySlug$: Observable<{ course: Course | undefined; }> = new Observable<{ course: Course | undefined; }>();
  CourseSections$: Observable<Section[]> = new Observable<Section[]>();
  slug: string = "";
  HomeRoutes = HomeRoutes;
  isArabic: boolean = false;
  AllSections: Section[] = [];
  RootSections: Section[] = [];
  loading: boolean = true;

  @ViewChild("playlistContainer") playlistContainer: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  constructor(private store: Store,
    private router: Router,
    private title: Title,
    private breadcrumb: BreadcrumbService,
    private tree: TreeDataStructureService<Section>,
    private activatedRoute: ActivatedRoute) { }

  ngOnDestroy(): void
  {
    this.isArabicSubscription.unsubscribe();
  }

  ngOnInit(): void
  {
    this.isArabicSubscription = this.isArabic$.pipe(
      tap(isArabic => this.isArabic = isArabic),
      switchMap(_ => combineLatest([
        this.activatedRoute.params.pipe(
          tap(params =>
          {
            this.slug = decodeURIComponent(params['slug'].split('#')[0]);
          }),
          switchMap(_ => combineLatest([this.store.select(selectCourseBySlug(this.slug))])),
          tap(courseBySlug =>
          {
            if (courseBySlug[0] == undefined)
            {
              this.store.dispatch(GetCourseBy_Slug({ slug: this.slug }));
            }
          }),
          map(res => res[0]),
        )
      ])),
      switchMap(r => combineLatest([this.store.select(Select_Sections_ByCourseId(r[0]?.id!)).pipe(
        tap(
          sections =>
          {
            this.AllSections = sections.filter(section => section.status == PostStatus.Published);
          }
        )),
      this.store.select(select_Course_HttpResponseError)
      ]).pipe(
        map(res => ({ course: r[0], sections: res[0], error: res[1] }))
      )),
    ).subscribe(r =>
    {
      this.CurrentCourse = r.course;
      if (r.course)
      {
        this.title.setTitle(r.course.title);
        this.breadcrumb.set("@courseSlug", this.CurrentCourse?.name!);
        if (this.isArabic !== r.course?.isArabic)
        {
          if (this.isArabic)
          {
            this.router.navigate(['', 'ar', HomeRoutes.Courses.Home, r?.course?.otherSlug!]);
          }
          else
          {
            this.router.navigate(['', HomeRoutes.Courses.Home, r?.course?.otherSlug!]);
          }
        }
        this.tree.setData(r.sections);
        this.AllSections = this.tree.finalFlatenArray();
        this.RootSections = this.tree.getRawRoots();
        this.loading = false;
      } else if (r.error)
      {
        this.title.setTitle(this.isArabic ? 'Not Found' : 'خطأ 404');

        this.loading = false;
      }
    });
  }


}
