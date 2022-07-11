import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseCategoriesRoutingModule } from './course-categories-routing.module';
import { CourseCategoriesHomeComponent } from './course-categories-home/course-categories-home.component';
import { CourseCategoryContentComponent } from './course-category-content/course-category-content.component';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';
import { TranslatePipe } from 'src/Pipes/translate.pipe';
import { PageTitleComponent } from 'src/SharedModules/page-title/page-title.component';
import { CourseCategoriesCardComponent } from 'src/SharedModules/course-categories-card/course-categories-card.component';
import { CourseCardComponent } from 'src/SharedModules/course-card/course-card.component';
import { PageTitlePlaceHolderComponent } from 'src/SharedModules/page-title-place-holder/page-title-place-holder.component';
import { CategoryCardPalceholderComponent } from 'src/SharedModules/category-card-palceholder/category-card-palceholder.component';


@NgModule({
  declarations: [
    CourseCategoriesHomeComponent,
    CourseCategoryContentComponent
  ],
  imports: [
    CommonModule, SharedModuleForHomeModule, TranslatePipe, PageTitleComponent, PageTitlePlaceHolderComponent,
    CourseCategoriesRoutingModule, CourseCategoriesCardComponent, CourseCardComponent,
    CategoryCardPalceholderComponent
  ]
})
export class CourseCategoriesModule { }
