import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs';
import { PostStatus } from 'src/Helpers/constants';
import { HomeRoutes } from 'src/Helpers/router-constants';
import { Course, Lesson, Section } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { selectLang } from 'src/State/LangState/lang.reducer';
import { LoadLessons } from 'src/State/LessonsState/Lessons.actions';
import { selectAllLessons, selectLessonBy_SectionId } from 'src/State/LessonsState/Lessons.reducer';
import { selectAllSections, Select_Sections_ByCourseId } from 'src/State/SectionsState/sections.reducer';

@Component({
  selector: 'section-child-home',
  templateUrl: './section-child-home.component.html',
  styleUrls: ['./section-child-home.component.css']
})
export class SectionChildHomeComponent implements OnInit, OnChanges
{
  @Input() Section: Section | null = null;
  @Input() courseId: number = 0;
  @Input() CurrentCourse: Course | undefined = undefined;
  isArabic$ = this.store.select(selectLang);
  HomeRoutes = HomeRoutes;
  AllSections$ = this.store.select(Select_Sections_ByCourseId(this.courseId)).pipe(
    tap(r =>
    {
      this.tree.setData(r);
      this.AllSections = this.tree.finalFlatenArray();
      this.getChildren();
    })
  );
  AllLessons$ = this.store.select(selectAllLessons).pipe(
    map(r => r.filter(x => x.status == PostStatus.Published && x.sectionId == this.Section?.id)
      .sort((a, b) => a.orderWithinSection - b.orderWithinSection))
  );
  AllSections: Section[] = [];
  selectedLessons: Lesson[] = [];
  children: Section[] = [];
  constructor(private store: Store,
    private tree: TreeDataStructureService<Section>,
    private router: Router,
    private activateRoute: ActivatedRoute) { }
  ngOnChanges(changes: SimpleChanges): void
  {

  }

  ngOnInit(): void
  {
  }
  getChildren()
  {
    this.children = this.AllSections.filter(section => section.parentKey == Number(this.Section?.id))
      .sort((a, b) => a.order - b.order);
    return this.children;
  }
  SetLessonFragment(lesson: Lesson)
  {
    this.router.navigate([], { relativeTo: this.activateRoute, fragment: lesson.nameSlugFragment });
  }
}
