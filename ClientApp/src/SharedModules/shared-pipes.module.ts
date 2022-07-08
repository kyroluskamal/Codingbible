import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from 'src/Pipes/safe-url.pipe';
import { TranslatePipe } from 'src/Pipes/translate.pipe';

const Pipes = [SafeUrlPipe, TranslatePipe];

@NgModule({
  declarations: [Pipes],
  imports: [
    CommonModule
  ],
  exports: [Pipes]
})
export class SharedPipesModule { }
