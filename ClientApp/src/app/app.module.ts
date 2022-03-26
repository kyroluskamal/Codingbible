import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeWebsiteModule } from './HomeWebsite/home-website.module';
import { DashboardModule } from './Dashboard/dashboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../SharedModules/shared.module';
import { MaterialModule } from '../SharedModules/material.module';
import { CookieService } from 'ngx-cookie-service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from 'src/State/AuthState/auth.effects';
import { AppReducers, AppState } from 'src/State/app.state';
import { localStorageSync } from 'ngrx-store-localstorage';
import { DatePipe } from '@angular/common';
import { PostEffects } from 'src/State/PostState/post-effects';
import { TokenInterceptor } from 'src/Interceptors/token.interceptor';
import { NotFoundComponent } from './CommonComponents/not-found/not-found.component';
import { NgrxUniversalRehydrateBrowserRootModule } from '@trellisorg/ngrx-universal-rehydrate';
import { TransferHttpCacheModule } from '@nguniversal/common';
export function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<any>
{
  return localStorageSync({
    keys: [
      { auth: ['user', 'roles'] },
      { design: ['pinned'] },
    ],
    rehydrate: true,
    removeOnUndefined: true
  })(reducer);
}

export const metaReducers: Array<MetaReducer<AppState, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [
    AppComponent, NotFoundComponent
  ],
  imports: [
    HomeWebsiteModule, SharedModule,
    DashboardModule, MaterialModule,
    AppRoutingModule, DashboardModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    // TransferHttpCacheModule,

    BrowserAnimationsModule,
    StoreModule.forRoot(AppReducers, { metaReducers }),
    EffectsModule.forRoot([AuthEffects, PostEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    FontAwesomeModule,
    // NgrxUniversalRehydrateModule.forRoot({})

    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'scfD1z5dp2',
    }),

  ],
  providers: [CookieService, DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
