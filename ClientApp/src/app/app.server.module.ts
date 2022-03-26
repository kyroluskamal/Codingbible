import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { NgrxUniversalRehydrateServerModule } from '@trellisorg/ngrx-universal-rehydrate/server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    // ServerTransferStateModule,
    FlexLayoutServerModule,
    // NgrxUniversalRehydrateServerModule.forServer(),

  ],
  bootstrap: [AppComponent],
})
export class AppServerModule { }
