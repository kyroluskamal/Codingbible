import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
const SharedModules = [
  ReactiveFormsModule, FormsModule,
  HttpClientModule,
  CommonModule
];

@NgModule({
  imports: [SharedModules],
  exports: [SharedModules]
})
export class SharedModule { }
