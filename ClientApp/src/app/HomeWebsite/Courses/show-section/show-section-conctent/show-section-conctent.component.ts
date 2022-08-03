import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, switchMap, tap } from 'rxjs';
import { HomeRoutes, NOT_READY } from 'src/Helpers/router-constants';
import { Course, Section } from 'src/models.model';
import { TitleAndMetaService } from 'src/Services/title-and-meta.service';
import { GetCourseBy_Slug } from 'src/State/CourseState/course.actions';
import { selectCourseBySlug, select_Course_HttpResponseError } from 'src/State/CourseState/course.reducer';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { selectSectionBySlug, Select_Sections_ByCourseId } from 'src/State/SectionsState/sections.reducer';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-show-section-conctent',
  templateUrl: './show-section-conctent.component.html',
  styleUrls: ['./show-section-conctent.component.css'],
})
export class ShowSectionConctentComponent implements OnInit
{


  loading: boolean = true;
  isArabic = false;
  courseSlug: string = '';
  sectionSlug: string = '';
  currentCourse: Course | undefined = undefined;
  currentSection: Section | undefined = undefined;
  AllSections: Section[] = [];
  HomeRoutes = HomeRoutes;
  constructor(private store: Store,
    private breadcrumb: BreadcrumbService,
    private activatedRoute: ActivatedRoute,
    private titleAndMetaService: TitleAndMetaService,
    private router: Router) { }

  ngOnInit(): void
  {
    this.store.select(selectLang).pipe(
      tap(isArabic => this.isArabic = isArabic),
      //get course by slug
      switchMap(_ => this.activatedRoute.pathFromRoot[3].params.pipe(
        tap(x => this.courseSlug = decodeURIComponent(x['slug'])),
        switchMap(_ => this.store.select(selectCourseBySlug(this.courseSlug)).pipe(
          tap(x =>
          {
            if (!x)
            {
              this.store.dispatch(GetCourseBy_Slug({ slug: this.courseSlug }));
            }
          }),
        )),
      ))
    ).pipe(
      switchMap(course =>
        this.activatedRoute.params.pipe(
          tap(params => this.sectionSlug = decodeURIComponent(params['slug'].split('#')[0])),
          switchMap(_ => combineLatest([this.store.select(selectSectionBySlug(this.sectionSlug, true)),
          this.store.select(select_Course_HttpResponseError), this.store.select(Select_Sections_ByCourseId(course?.id!, true)).pipe(
            tap(x =>
            {
              if (x)
              {
                this.AllSections = x;
              }
            })
          )])),
        ).pipe(
          map(x => { return { course: course, section: x[0], error: x[1] }; }),
        )
      )
    ).subscribe(
      r =>
      {
        this.currentCourse = r.course;
        this.currentSection = r.section;
        if (this.isArabic)
          this.breadcrumb.set('@sectionHome', "الفصول");
        else
          this.breadcrumb.set('@sectionHome', "Sections");
        if (r.course && r.section)
        {
          this.titleAndMetaService.setSEO_Requirements(
            `${r.section.title} | ${r.course.name}`,
            r.section.description,
            r.section.featureImageUrl,
            HomeRoutes.Courses.Home + "/" + r.course.slug + '/section/' + r.section.slug, this.isArabic);
          this.breadcrumb.set("@courseSlug", r.course?.name!);
          this.breadcrumb.set("@sectionSlug", r.section?.name!);
          if (this.isArabic !== r.section?.isArabic && this.isArabic !== r.course?.isArabic)
          {
            if (r.section.otherSlug)
            {
              if (this.isArabic)
              {
                this.router.navigate(['', 'ar', HomeRoutes.Courses.Home, r.course?.otherSlug!,
                  HomeRoutes.Courses.Section, r.section?.otherSlug!]);
              }
              else
              {
                this.router.navigate(['', HomeRoutes.Courses.Home, r?.course?.otherSlug!,
                  HomeRoutes.Courses.Section, r.section?.otherSlug!]);
              }
            }
            else
            {
              this.router.navigate(r.section?.isArabic ? [NOT_READY] : [`/ar/${NOT_READY}`]);
            }
          }
          this.loading = false;
        } else if (r.course && !r.section)
        {
          this.titleAndMetaService.notFoundTitle(this.isArabic);
          this.breadcrumb.set("@courseSlug", r.course?.name!);
          this.loading = false;
        }
        if (r.error)
        {
          this.titleAndMetaService.notFoundTitle(this.isArabic);
          this.loading = false;
        }
      }
    );


  }

}
