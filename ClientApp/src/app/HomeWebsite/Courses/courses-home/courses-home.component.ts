import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, Subscription, switchMap, } from 'rxjs';
import { BaseUrl, PostStatus } from 'src/Helpers/constants';
import { Course } from 'src/models.model';
import { TranslatePipe } from 'src/Pipes/translate.pipe';
import { TitleAndMetaService } from 'src/Services/title-and-meta.service';
import { LoadCourses } from 'src/State/CourseState/course.actions';
import { selectAllCourses } from 'src/State/CourseState/course.reducer';
import { selectLang } from 'src/State/LangState/lang.reducer';

@Component({
  selector: 'app-courses-home',
  templateUrl: './courses-home.component.html',
  styleUrls: ['./courses-home.component.css']
})
export class CoursesHomeComponent implements OnInit, OnDestroy
{
  isArabic$ = this.store.select(selectLang);
  isArabic: boolean = false;
  AllCourses$: Observable<Course[]> = new Observable<Course[]>();
  AllCoursesSubscription: Subscription = new Subscription();
  BaseUrl = BaseUrl;
  loading = true;
  constructor(private store: Store, private translate: TranslatePipe,
    private titleAndMetaService: TitleAndMetaService) { }
  ngOnDestroy(): void
  {
    this.AllCoursesSubscription.unsubscribe();
  }

  ngOnInit(): void
  {
    this.AllCourses$ = this.isArabic$.pipe(
      map(isArabic => { this.isArabic = isArabic; return isArabic; }),
      switchMap(r => combineLatest([this.store.select(selectAllCourses).pipe(map(r => r.filter(c => c.status == PostStatus.Published && c.isArabic == this.isArabic)))])),
      map(r => { if (r[0].length == 0) { this.store.dispatch(LoadCourses()); } return r[0]; })
    );
    this.AllCoursesSubscription = this.AllCourses$.subscribe(r =>
    {
      this.titleAndMetaService.setSEO_Requirements(
        this.isArabic ? 'الدورات التعليمية' : 'Courses',
        this.translate.transform("AllCoursesPageDescription"),
        '',
        "courses",
        this.isArabic
      );
      this.loading = false;
    });
  }

}
