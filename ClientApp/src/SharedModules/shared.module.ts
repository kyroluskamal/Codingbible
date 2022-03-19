import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BidiModule } from '@angular/cdk/bidi';
import { AnimateOnScrollDirective } from '../Directives/animate-on-scroll.directive';
import { BreadcrumbModule } from 'xng-breadcrumb';
const SharedModules = [
  ReactiveFormsModule, FormsModule,
  HttpClientModule,
  CommonModule, BreadcrumbModule
];

const Directive = [AnimateOnScrollDirective];
@NgModule({
  declarations: [Directive],
  imports: [SharedModules],
  exports: [SharedModules, Directive]
})
export class SharedModule { }
