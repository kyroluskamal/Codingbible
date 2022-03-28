import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { MaterialModule } from '../../SharedModules/material.module';
import { SharedModule } from '../../SharedModules/shared.module';
import { PostsDashboardComponent } from './posts-dashboard/posts-dashboard.component';
import { AddPostsComponent } from './add-posts/add-posts.component';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { PostHandlerComponent } from './post-handler/post-handler.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { CodingBibleEditorComponent } from '../CodingBible_editor/editor/editor.component';
import { EffectsModule } from '@ngrx/effects';
import { PostEffects } from 'src/State/PostState/post-effects';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { AppReducers, AppState } from 'src/State/app.state';
import { localStorageSync } from 'ngrx-store-localstorage';
import { NgrxUniversalRehydrateBrowserModule } from '@trellisorg/ngrx-universal-rehydrate';
import { AuthEffects } from 'src/State/AuthState/auth.effects';

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
const components = [
  DashboardHomeComponent, PostsDashboardComponent, AddPostsComponent, CodingBibleEditorComponent
];
@NgModule({
  declarations: [components, PostHandlerComponent, EditPostComponent],
  imports: [
    StoreModule.forFeature("DashboardModule", AppReducers, { metaReducers }),
    CommonModule, MaterialModule, SharedModule,
    DashboardRoutingModule, EditorModule,
    EffectsModule.forFeature([PostEffects, AuthEffects]),
    NgrxUniversalRehydrateBrowserModule.forFeature(['auth', 'design']),

  ],
  exports: [components]
  ,
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class DashboardModule { }
