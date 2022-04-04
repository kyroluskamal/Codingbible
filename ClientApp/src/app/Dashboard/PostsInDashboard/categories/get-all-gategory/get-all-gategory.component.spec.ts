import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllGategoryComponent } from './get-all-gategory.component';

describe('GetAllGategoryComponent', () => {
  let component: GetAllGategoryComponent;
  let fixture: ComponentFixture<GetAllGategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetAllGategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetAllGategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
