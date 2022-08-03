import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { BrowserTransferStateModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    BrowserTransferStateModule,
    // <-- import TransferHttpCacheModule to transfer HttpCacheService
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule { }
