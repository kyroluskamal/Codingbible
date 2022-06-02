import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PostStatus } from 'src/Helpers/constants';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { Lesson, Section } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { selectAllLessons } from 'src/State/LessonsState/Lessons.reducer';
import { AdditionIsComplete } from 'src/State/SectionsState/sections.actions';
import { selectAllSections, Select_AdditionState } from 'src/State/SectionsState/sections.reducer';

@Component({
  selector: 'app-section-child',
  templateUrl: './section-child.component.html',
  styleUrls: ['./section-child.component.css'],
})
export class SectionChildComponent implements OnInit
{
  @Input() Section: Section | null = null;
  @Input() showSectionName: boolean = true;
  AllSections$ = this.store.select(selectAllSections);
  AllLessions$ = this.store.select(selectAllLessons);
  AllLessons$ = this.store.select(selectAllLessons);
  AllSections: Section[] = [];
  selectedLessons: Lesson[] = [];
  children: Section[] = [];
  PostStatus = PostStatus;
  constructor(private TreeSection: TreeDataStructureService<Section>,
    private router: Router,
    private store: Store)
  {

  }

  ngOnInit(): void
  {
    this.AllSections$.subscribe(sections =>
    {
      this.TreeSection.setData(sections);
      this.AllSections = this.TreeSection.finalFlatenArray();
      this.getChildren();
    });
    this.store.select(Select_AdditionState).subscribe(state =>
    {
      if (state)
      {
        this.getChildren();
        this.store.dispatch(AdditionIsComplete({ status: false }));
      }
    });
    this.AllLessons$.subscribe(lessons =>
    {
      this.selectedLessons = lessons.filter(lesson => lesson.sectionId == this.Section?.id);
    });
  }
  getChildren()
  {
    this.children = this.AllSections.filter(section => section.parentKey == Number(this.Section?.id));
    return this.children;
  }
  openToEdit(LessonId: number)
  {
    this.router.navigate(["", DashboardRoutes.Home, DashboardRoutes.Courses.Home,
      DashboardRoutes.Courses.Lessons.Home, DashboardRoutes.Courses.Lessons.EditLesson],
      { queryParams: { id: LessonId } });
  }
}
