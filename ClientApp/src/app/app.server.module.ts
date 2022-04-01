import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { NgrxUniversalRehydrateServerModule } from '@trellisorg/ngrx-universal-rehydrate/server';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    FlexLayoutServerModule,
    NgrxUniversalRehydrateServerModule.forServer()
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule { }