import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Subscription, switchMap, take, tap } from 'rxjs';
import { LoadCourseCategorys } from 'src/State/CourseCategoryState/CourseCategory.actions';
import { selectAllCourseCategorys } from 'src/State/CourseCategoryState/CourseCategory.reducer';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-course-categories-home',
  templateUrl: './course-categories-home.component.html',
  styleUrls: ['./course-categories-home.component.css']
})
export class CourseCategoriesHomeComponent implements OnInit, OnDestroy
{
  AllCategoriesSubscription: Subscription = new Subscription();
  Loading: boolean = true;
  AllCategories$ = this.store.select(selectLang).pipe(
    map(isArabic => isArabic),
    switchMap(r => combineLatest([this.store.select(selectAllCourseCategorys)]).pipe(
      tap(courseCategorys =>
      {
        if (courseCategorys[0].length == 0)
        {
          this.store.dispatch(LoadCourseCategorys());
        }
      }),
      map(res =>
      {
        return {
          cats: res[0].filter(courseCategory =>
          {
            return courseCategory.isArabic == r
              && (courseCategory.slug !== 'uncategorized' && courseCategory.slug.localeCompare('غير-مصنف', "ar", { ignorePunctuation: true, sensitivity: 'base' }) !== 0);
          }), isArabic: r
        };
      }),
      take(2)
    )),
  );
  constructor(private store: Store, private BreadCrumb: BreadcrumbService) { }
  ngOnDestroy(): void
  {
    this.AllCategoriesSubscription.unsubscribe();
  }

  ngOnInit(): void
  {
    this.AllCategoriesSubscription = this.AllCategories$.subscribe(res =>
    {
      this.Loading = false;
      if (res.isArabic)
      {
        this.BreadCrumb.set('@courseCategories', 'الاقسام');
      } else
      {
        this.BreadCrumb.set('@courseCategories', 'Categories');
      }
    });
  }

}
