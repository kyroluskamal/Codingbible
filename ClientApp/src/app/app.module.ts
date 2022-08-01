import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppReducers, AppState } from 'src/State/app.state';
import { localStorageSync } from 'ngrx-store-localstorage';
import { TokenInterceptor } from 'src/Interceptors/token.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AuthEffects } from 'src/State/AuthState/auth.effects';
import { UrlSerializer } from '@angular/router';
import { LowerCaseUrlSerializer } from 'src/CommonServices/LowerCaseUrlSerializer';
import { PostEffects } from 'src/State/PostState/post-effects';
import { DialogHandlerService } from 'src/CommonServices/dialog-handler.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryEffects } from 'src/State/CategoriesState/Category.effects';
import { CoursesEffects } from 'src/State/CourseState/Course.effects';
import { CourseCategoryEffects } from 'src/State/CourseCategoryState/CourseCategory.effects';
import { SectionsEffects } from 'src/State/SectionsState/sections.effects';
import { LessonsEffects } from 'src/State/LessonsState/Lessons.effects';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';
import { MenuEffectHome } from 'src/State/Menu/menu.effects.home';
import { AttachmentsEffects } from 'src/State/Attachments/Attachments.effects';
export const enum MergeStrategy
{
  OVERWRITE = 'overwrite',
  MERGE_OVER = 'mergeOver',
  MERGE_UNDER = 'mergeUnder',
}
export function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<any>
{
  return localStorageSync({
    keys: [

      { auth: ['user', 'roles', 'isLoggedIn'] },
      { design: ['pinned'] },
      { lang: ['isArabic'] },
    ],
    rehydrate: true,
    removeOnUndefined: true
  })(reducer);
}

export const metaReducers: Array<MetaReducer<AppState, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule, HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    SharedModuleForHomeModule,
    StoreModule.forRoot(AppReducers, { metaReducers }),
    EffectsModule.forRoot([PostEffects, AuthEffects, SectionsEffects,
      LessonsEffects, MenuEffectHome,
      CategoryEffects, AttachmentsEffects,
      CoursesEffects, CourseCategoryEffects]),
    StoreDevtoolsModule.instrument({ logOnly: false }),
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'scfD1z5dp2',
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [DialogHandlerService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
