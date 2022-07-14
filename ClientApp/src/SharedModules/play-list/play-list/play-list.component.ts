import { DOCUMENT } from '@angular/common';
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription, switchMap } from 'rxjs';
import { PostStatus, PostType } from 'src/Helpers/constants';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { Course, Lesson, Section } from 'src/models.model';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { selectLessonByCourseId, selectLessonByFragmentName } from 'src/State/LessonsState/Lessons.reducer';

@Component({
  selector: 'playlist',
  templateUrl: './play-list.component.html',
  styleUrls: ['./play-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PlayListComponent implements OnInit, AfterViewChecked, OnDestroy
{
  @Input() RootSections: Section[] = [];
  @Input() AllSections: Section[] = [];
  @Input() CurrentCourse: Course | undefined = undefined;
  isArabic$ = this.store.select(selectLang);
  currentLesson: Lesson | null = null;
  currentLessonFromFragment: Subscription = new Subscription();
  AllLessons: Lesson[] = [];
  AllLessonsInDom: any;
  currentLessonIndex = 0;
  HomeRoutes = HomeRoutes;
  currenFragment: string | null = null;
  NextPreviousSubscription: Subscription = new Subscription();
  currentLessonFromFragment$: Observable<{ lesson: Lesson | undefined, fragment: string | null; }>
    = new Observable<{ lesson: Lesson | undefined, fragment: string | null; }>();
  @ViewChild("playlistContainer") playlistContainer: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;

  constructor(
    private store: Store,
    private cdf: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) { }
  ngOnDestroy(): void
  {
    this.currentLessonFromFragment.unsubscribe();
    this.NextPreviousSubscription.unsubscribe();
  }
  ngAfterViewChecked(): void
  {
    this.currentLessonFromFragment$ = this.activatedRoute.fragment.pipe(
      switchMap(f => combineLatest([this.store.select(selectLessonByFragmentName(f!)).pipe(
        map(l => ({ lesson: l, fragment: f }))
      )])),
      map(x => x[0])
    );
    this.currentLessonFromFragment = this.currentLessonFromFragment$.subscribe(r =>
    {
      if (r.fragment && r.lesson)
      {
        this.currenFragment = r.fragment;
        this.currentLesson = r.lesson!;
        this.playlistContainer.nativeElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
        this.handleLessonChoose(r.lesson!);
        this.store.select(selectLessonByCourseId(this.currentLesson.courseId)).subscribe(l =>
        {
          this.AllLessonsInDom = this.document.querySelectorAll("[data-lesson-active]");
          for (let i = 0; i < this.AllLessonsInDom.length; i++)
          {
            let attributevalue = (<HTMLElement>this.AllLessonsInDom[i]).getAttribute("data-lesson-active");
            let lesson = l.filter(l => l.nameSlugFragment == attributevalue)[0];
            if (lesson && !this.AllLessons.includes(lesson))
            {
              this.AllLessons.push(lesson);
            }
          }
          this.currentLessonIndex = this.AllLessons.indexOf(this.currentLesson!);
        }
        );
      }
    });
    this.cdf.detectChanges();
  }

  ngOnInit(): void
  {
  }

  handleLessonChoose(lesson: Lesson)
  {
    //get all section ancestors to open all of them
    let sectionTree = this.getAllSectionAncestors(lesson.sectionId);
    //get all lessons in dom
    let AllLessonsInDom = this.document.querySelectorAll('[data-lesson-active]');
    //loop over all lessons to remove the active class if any
    for (let i = 0; i < AllLessonsInDom.length; i++)
    {
      AllLessonsInDom[i].classList.remove('active');
    }
    //set the lesson to active
    let lessonInDom = this.document.querySelector(`[data-lesson-active="${lesson.nameSlugFragment}"]`);
    lessonInDom?.classList.add("active");

    let allSetionsInDom = this.document.querySelectorAll('[data-section-active]');
    for (let i = 0; i < allSetionsInDom.length; i++)
    {
      allSetionsInDom[i].classList.add('collapsed');
      let parent = allSetionsInDom[i].parentElement;
      let ParentSbling = parent?.nextElementSibling;
      if (ParentSbling)
        ParentSbling.classList.remove('show');
    }

    //open all ancestors
    for (let s of sectionTree)
    {
      let sectionInDom = <HTMLButtonElement>this.document.querySelector(`[data-section-active="${s.nameSlugFragment}"]`);
      if (sectionInDom)
      {
        let parent = sectionInDom?.parentElement;
        let sbling = parent?.nextElementSibling;
        if (sbling)
        {
          sectionInDom.classList.remove('collapsed');
          sbling.classList.add("show");
        }
      }
    }
  }
  getAllSectionAncestors(sectionId: number)
  {
    let ancestors: Section[] = [];
    let parent = this.AllSections.find(section => section.id == sectionId);
    if (parent)
    {
      ancestors.push(parent);
      let parentParent = this.AllSections.find(section => section.id == parent?.parentKey);
      if (parentParent)
      {
        ancestors.push(parentParent);
        this.getAllSectionAncestors(parentParent.id);
      }
    }
    return ancestors;
  }
  getChildren(Section: Section): Section[]
  {
    return this.AllSections.filter(section => section.parentKey == Number(Section?.id))
      .sort((a, b) => a.order - b.order);
  }

  NextOrPrevious(status: number)
  {
    if (this.currentLesson)
    {
      let nextIndex = this.currentLessonIndex + status;
      if (nextIndex >= 0 && nextIndex < this.AllLessons.length)
      {
        let nextLesson = this.AllLessons[nextIndex];
        this.router.navigate([], { relativeTo: this.activatedRoute, fragment: nextLesson.nameSlugFragment });
        this.currentLessonIndex = nextIndex;
      }
    }
  }
}
