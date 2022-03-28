import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PostReducers, PostStateForHome } from 'src/State/app.state';
import { localStorageSync } from 'ngrx-store-localstorage';
import { TokenInterceptor } from 'src/Interceptors/token.interceptor';
import { NotFoundComponent } from './CommonComponents/not-found/not-found.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HomeComponent } from './HomeWebsite/home/home.component';
import { SharedComponentsModule } from 'src/SharedModules/SharedComponents.module';
import { PostEffectForHome } from 'src/State/PostState/post-effects-ForHome';
import { NgrxUniversalRehydrateBrowserModule } from '@trellisorg/ngrx-universal-rehydrate';

export const enum MergeStrategy
{
  OVERWRITE = 'overwrite',
  MERGE_OVER = 'mergeOver',
  MERGE_UNDER = 'mergeUnder',
}
export function localStorageSyncReducer(reducer: ActionReducer<PostStateForHome>): ActionReducer<any>
{
  return localStorageSync({
    keys: [
      { auth: ['user', 'roles'] },
    ],
    rehydrate: true,
    removeOnUndefined: true
  })(reducer);
}

export const metaReducers: Array<MetaReducer<PostStateForHome, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [
    AppComponent, NotFoundComponent, HomeComponent
  ],
  imports: [
    AppRoutingModule, HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    // TransferHttpCacheModule,
    BrowserTransferStateModule,
    SharedComponentsModule,
    StoreModule.forRoot(PostReducers, { metaReducers }),
    EffectsModule.forRoot([PostEffectForHome]),
    StoreDevtoolsModule.instrument({ logOnly: true }),
    NgrxUniversalRehydrateBrowserModule.forRoot({ stores: ['post', 'auth'] }),
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
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
