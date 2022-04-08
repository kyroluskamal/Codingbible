import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { Store, StoreModule } from '@ngrx/store';
import { metaReducers } from 'src/app/app.module';
import { AppReducers } from 'src/State/app.state';

import { AddEditCategoriesComponent } from './add-edit-categories.component';

describe('AddEditCategoriesComponent', () =>
{
  let emailInput: HTMLInputElement | null;
  let passwordInput: HTMLInputElement | null;
  let loginBtn: HTMLButtonElement | null;
  let spectator: SpectatorRouting<AddEditCategoriesComponent>;
  const createComponent = createRoutingFactory({
    component: AddEditCategoriesComponent,
    imports: [StoreModule.forRoot(AppReducers, { metaReducers }), ReactiveFormsModule,
      HttpClientModule, BrowserModule, FormsModule,
      MatFormFieldModule, MatInputModule, MatButtonModule
    ],

    providers: [FormBuilder, Store, HttpClient],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    stubsEnabled: false,
    shallow: false
  });

  beforeEach(async () =>
  {
    spectator = createComponent({
      detectChanges: false,
    });
    spectator.component.ngOnInit();
    spectator.detectComponentChanges();

  });

  describe("Client Side Validation", () =>
  {
    describe("form testing", () =>
    {

    });
  });
});
