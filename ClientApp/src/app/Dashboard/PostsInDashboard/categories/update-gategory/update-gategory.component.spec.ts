import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGategoryComponent } from './update-gategory.component';

describe('UpdateGategoryComponent', () => {
  let component: UpdateGategoryComponent;
  let fixture: ComponentFixture<UpdateGategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateGategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateGategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
