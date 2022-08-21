import { NgModule } from '@angular/core';
import { HomeWebsiteRoutingModule } from './home-website-routing.module';
import { LowerCaseUrlSerializer } from 'src/CommonServices/LowerCaseUrlSerializer';
import { UrlSerializer } from '@angular/router';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';
import { EffectsModule } from '@ngrx/effects';
import { PostEffects } from 'src/State/PostState/post-effects';
import { AuthEffects } from 'src/State/AuthState/auth.effects';
import { SectionsEffects } from 'src/State/SectionsState/sections.effects';
import { LessonsEffects } from 'src/State/LessonsState/Lessons.effects';
import { MenuEffectHome } from 'src/State/Menu/menu.effects.home';
import { CoursesEffects } from 'src/State/CourseState/Course.effects';
import { CourseCategoryEffects } from 'src/State/CourseCategoryState/CourseCategory.effects';
import { AttachmentsEffects } from 'src/State/Attachments/Attachments.effects';
import { CategoryEffects } from 'src/State/CategoriesState/Category.effects';
import { StoreModule } from '@ngrx/store';
import { MenuEffects } from 'src/State/Menu/menu.effects';


@NgModule({
  declarations: [

  ],
  imports: [SharedModuleForHomeModule,
    HomeWebsiteRoutingModule,
    StoreModule,

    EffectsModule.forRoot([PostEffects, AuthEffects, SectionsEffects,
      LessonsEffects, MenuEffects,
      CategoryEffects, AttachmentsEffects,
      CoursesEffects, CourseCategoryEffects]),
  ],
  providers: [
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer }
  ]
})
export class HomeWebsiteModule { }
