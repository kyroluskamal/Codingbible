import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GategoryHomeComponent } from './gategory-home.component';

describe('GategoryHomeComponent', () => {
  let component: GategoryHomeComponent;
  let fixture: ComponentFixture<GategoryHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GategoryHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GategoryHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
