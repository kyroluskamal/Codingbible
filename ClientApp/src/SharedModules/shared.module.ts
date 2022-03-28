import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'xng-breadcrumb';
const SharedModules = [
  ReactiveFormsModule, FormsModule,
  HttpClientModule,
  CommonModule, BreadcrumbModule
];

@NgModule({
  imports: [SharedModules],
  exports: [SharedModules]
})
export class SharedModule { }
