import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeWebsiteRoutingModule } from './home-website-routing.module';
import { LoginComponent } from './AuthComonents/login/login.component';
import { RegisterComponent } from './AuthComonents/register/register.component';
import { ForgetPasswordComponent } from './AuthComonents/forget-password/forget-password.component';
import { ResetPasswordComponent } from './AuthComonents/reset-password/reset-password.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { EmailConfirmationComponent } from './AuthComonents/email-confirmation/email-confirmation.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthEffects } from 'src/State/AuthState/auth.effects';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { AppReducers, AppState } from 'src/State/app.state';
import { localStorageSync } from 'ngrx-store-localstorage';
import { DialogHandlerService } from 'src/CommonServices/dialog-handler.service';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
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
  declarations: [],
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
