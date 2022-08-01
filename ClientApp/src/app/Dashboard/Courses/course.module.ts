import { NgModule } from '@angular/core';
import { CourseRoutingModule } from './course-routing.module';
import { ShowAllCoursesComponent } from './show-all-courses/show-all-courses.component';
import { CourseWizardComponent } from './course-wizard/course-wizard.component';
import { SharedModuleForCoursesModule } from './shared-module-for-courses/shared-module-for-courses.module';
import { ShowAllSectionsComponent } from './show-all-sections/show-all-sections.component';
import { SafeUrlPipe } from 'src/Pipes/safe-url.pipe';
import { AppReducers } from 'src/State/app.state';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CoursesEffects } from 'src/State/CourseState/Course.effects';
import { LessonsEffects } from 'src/State/LessonsState/Lessons.effects';
import { SectionsEffects } from 'src/State/SectionsState/sections.effects';
import { CourseCategoryEffects } from 'src/State/CourseCategoryState/CourseCategory.effects';
import { MenuEffects } from 'src/State/Menu/menu.effects';
import { AuthEffects } from 'src/State/AuthState/auth.effects';
import { PostEffects } from 'src/State/PostState/post-effects';
import { CategoryEffects } from 'src/State/CategoriesState/Category.effects';
import { ImageUrlForScreen } from 'src/Pipes/ImageUrlForScreen.pipe';

@NgModule({
  declarations: [
    ShowAllCoursesComponent,
    CourseWizardComponent,
    ShowAllSectionsComponent,
  ],
  imports: [ImageUrlForScreen,
    // StoreModule.forFeature("AppState", AppReducers),
    // EffectsModule.forFeature([CoursesEffects, LessonsEffects, SectionsEffects, CourseCategoryEffects,
    //   MenuEffects, AuthEffects, PostEffects, CategoryEffects]),
    CourseRoutingModule, SharedModuleForCoursesModule, SafeUrlPipe
  ]
})
export class CourseModule { }
