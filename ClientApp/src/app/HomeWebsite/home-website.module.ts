import { NgModule } from '@angular/core';
import { HomeWebsiteRoutingModule } from './home-website-routing.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LowerCaseUrlSerializer } from 'src/CommonServices/LowerCaseUrlSerializer';
import { UrlSerializer } from '@angular/router';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';
// export function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<any>
// {
//   return localStorageSync({
//     keys: [
//       { auth: ['user', 'roles'] },
//       { design: ['pinned'] },
//     ],
//     rehydrate: true,
//     removeOnUndefined: true
//   })(reducer);
// }

// export const metaReducers: Array<MetaReducer<AppState, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [

  ],
  imports: [SharedModuleForHomeModule,
    // StoreModule.forFeature("HomeWebsiteModule", AppReducers, { metaReducers }),

    // EffectsModule.forFeature([AuthEffects]),
    // NgrxUniversalRehydrateBrowserModule.forFeature(['auth', 'design']),

    HomeWebsiteRoutingModule, TooltipModule.forRoot(), MatProgressSpinnerModule
  ],
  providers: [
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer }
  ]
})
export class HomeWebsiteModule { }
