import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { Store, StoreModule } from '@ngrx/store';
import { metaReducers } from 'src/app/app.module';
import { AppReducers } from 'src/State/app.state';

import { AddGategoryComponent } from './add-gategory.component';

describe('AddGategoryComponent', () =>
{
  let spectator: Spectator<AddGategoryComponent>;
  const createComponent = createComponentFactory({
    component: AddGategoryComponent,
    imports: [StoreModule.forRoot(AppReducers, { metaReducers }), ReactiveFormsModule,
    ],
    providers: [FormBuilder, Store, HttpClient],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    shallow: false
  });
  beforeAll(() =>
  {
    spectator = createComponent({
      detectChanges: false,
    });
    spectator.component.ngOnInit();
    spectator.detectComponentChanges();
  });

  describe("AddingForm testing", () =>
  {
    it("has ");
  });
});
