import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseTextToListComponent } from './course-text-to-list.component';

describe('CourseTextToListComponent', () => {
  let component: CourseTextToListComponent;
  let fixture: ComponentFixture<CourseTextToListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CourseTextToListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseTextToListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
