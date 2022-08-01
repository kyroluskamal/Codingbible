import { NgModule } from '@angular/core';
import { HomeWebsiteRoutingModule } from './home-website-routing.module';
import { LowerCaseUrlSerializer } from 'src/CommonServices/LowerCaseUrlSerializer';
import { UrlSerializer } from '@angular/router';
import { SharedModuleForHomeModule } from 'src/SharedModules/shared-module-for-home.module';

@NgModule({
  declarations: [

  ],
  imports: [SharedModuleForHomeModule,
    HomeWebsiteRoutingModule,
  ],
  providers: [
    { provide: UrlSerializer, useClass: LowerCaseUrlSerializer }
  ]
})
export class HomeWebsiteModule { }
