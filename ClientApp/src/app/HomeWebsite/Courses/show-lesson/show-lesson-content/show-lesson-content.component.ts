import { DOCUMENT } from '@angular/common';
import { AfterViewChecked, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, of, Subscription, switchMap, tap } from 'rxjs';
import { PostStatus } from 'src/Helpers/constants';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { Course, Lesson, Section } from 'src/models.model';
import { TranslatePipe } from 'src/Pipes/translate.pipe';
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
export class ShowLessonContentComponent implements OnInit, OnDestroy, AfterViewChecked
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
  activatedRouteSubscription: Subscription = new Subscription();

  constructor(private store: Store,
    private breadcrumb: BreadcrumbService,
    private router: Router,
    private tree: TreeDataStructureService<Section>,
    private title: Title,
    @Inject(DOCUMENT) private document: Document,
    private activatedRoute: ActivatedRoute) { }
  ngAfterViewChecked(): void
  {
    //Create Table of contents
    let content = this.document.getElementById('content');
    if (content)
    {
      this.activatedRouteSubscription = this.activatedRoute.fragment.subscribe(
        f =>
        {
          if (f)
          {
            this.document.getElementById(f)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      );
      let allHeaders = content?.querySelectorAll('h2, h3, h4, h5, h6');
      let Ul = this.document.createElement('ul');
      Ul.setAttribute('id', 'tocList');
      Ul.setAttribute('class', 'list-unstyled');
      if (allHeaders)
      {
        for (let i = 0; i < allHeaders?.length; i++)
        {
          let header = (<HTMLElement>allHeaders[i]);
          let id = header.innerText.replace(/\s/g, '-').substring(0, 50);
          header.setAttribute('id', `${id}`);
          let li = this.document.createElement('li');
          let a = this.document.createElement('a');
          if (header.tagName === 'H3' || header.tagName === 'H4' || header.tagName === 'H5' || header.tagName === 'H6')
          {
            console.log(header.tagName.split('')[1]);
            a.setAttribute('class', this.isArabic ? `pe-${Number(header.tagName.split('')[1])}` : `ps-${Number(header.tagName.split('')[1])}`);
          }
          a.href = '#' + header.id;
          a.innerText = header.innerText;
          li.appendChild(a);
          Ul.appendChild(li);
        }
      }
      let toc = this.document.getElementById('toc');
      if (toc)
      {
        let Header = this.document.createElement('div');
        Header.setAttribute('class', 'h4 fw-bold  p-3');
        Header.innerText = new TranslatePipe(this.store).transform("Table of Contents");;
        toc.innerHTML = Header.outerHTML + Ul.outerHTML;
      }
      let tocList = this.document.getElementById('tocList');
      if (tocList)
      {
        let allAnchors = tocList.querySelectorAll('a');
        for (let i = 0; i < allAnchors.length; i++)
        {
          let anchor = (<HTMLAnchorElement>allAnchors[i]);
          anchor.addEventListener('click', (e) =>
          {
            e.preventDefault();
            this.router.navigate([], { relativeTo: this.activatedRoute, fragment: anchor.href.split('#')[1] });
            let target = this.document.getElementById(anchor?.getAttribute('href')?.replace('#', '')!);
            if (target)
            {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
          );
        }
      }
    }
  }
  ngOnDestroy(): void
  {
    this.isArabicSubscription.unsubscribe();
    this.activatedRouteSubscription.unsubscribe();
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
            switchMap(params => combineLatest([this.store.select(selectLessonBySlug(this.slug, true))])),
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
          this.title.setTitle(`${r.lesson.title}`);
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
          this.title.setTitle(this.isArabic ? 'Not Found' : 'خطأ 404');
        }
        if (r.error)
        {
          this.title.setTitle(this.isArabic ? 'Not Found' : 'خطأ 404');
          this.loading = false;
        }
      });
  }
  NextOrPrevious(status: number): void
  {
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
  }
};
