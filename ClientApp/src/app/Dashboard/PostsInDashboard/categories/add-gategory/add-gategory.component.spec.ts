import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGategoryComponent } from './add-gategory.component';

describe('AddGategoryComponent', () => {
  let component: AddGategoryComponent;
  let fixture: ComponentFixture<AddGategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
