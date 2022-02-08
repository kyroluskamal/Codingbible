import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HomeWebsiteModule } from '../HomeWebsite/home-website.module';
import { DashboardModule } from '../Dashboard/dashboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from '../SharedModules/shared.module';
import { MaterialModule } from '../SharedModules/material.module';
import { CommonComponentsModule } from '../CommonComponents/common-components.module';
import { CookieService } from 'ngx-cookie-service';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HomeWebsiteModule, SharedModule,
    DashboardModule, MaterialModule,
    AppRoutingModule, DashboardModule, CommonComponentsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    //BrowserModule,
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
    BrowserAnimationsModule,
    FontAwesomeModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
