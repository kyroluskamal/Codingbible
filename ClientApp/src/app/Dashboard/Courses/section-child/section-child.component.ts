import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Section } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { selectAllCourseSectionss } from 'src/State/CourseSectionsState/CourseSections.reducer';
import { selectAllLessons } from 'src/State/LessonsState/Lessons.reducer';
import { selectAllSections } from 'src/State/SectionsState/sections.reducer';

@Component({
  selector: 'app-section-child',
  templateUrl: './section-child.component.html',
  styleUrls: ['./section-child.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionChildComponent implements OnInit
{
  @Input() Section: Section | null = null;
  @Input() showSectionName: boolean = true;
  AllSections$ = this.store.select(selectAllSections);
  AllLessions$ = this.store.select(selectAllLessons);

  AllSections: Section[] = [];
  children: Section[] = [];
  constructor(private TreeSection: TreeDataStructureService<Section>,
    private store: Store)
  {

  }

  ngOnInit(): void
  {
    this.AllSections$.subscribe(sections =>
    {
      this.TreeSection.setData(sections);
      this.AllSections = this.TreeSection.finalFlatenArray();
    });
  }
  getChildren()
  {
    return this.TreeSection.getChilrenByParentId(this.Section?.id!);
  }
}
