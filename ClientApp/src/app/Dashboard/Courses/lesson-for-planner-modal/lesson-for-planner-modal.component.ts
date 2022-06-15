import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PostStatus, PostType, validators } from 'src/Helpers/constants';
import { Lesson, Section } from 'src/models.model';
import { LessonsService } from 'src/Services/lessons.service';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { AddLesson, LoadLessons, UpdateLesson } from 'src/State/LessonsState/Lessons.actions';
import { selectAllLessons } from 'src/State/LessonsState/Lessons.reducer';
import { selectAllSections } from 'src/State/SectionsState/sections.reducer';

@Component({
  selector: 'lesson-for-planner-modal',
  templateUrl: './lesson-for-planner-modal.component.html',
  styleUrls: ['./lesson-for-planner-modal.component.css']
})
export class LessonForPlannerModalComponent implements OnInit, OnChanges
{
  FormControlNames = FormControlNames;
  FormFieldsNames = FormFieldsNames;
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  InputFieldTypes = InputFieldTypes;
  LessonActionType: string = "";
  ActionType = PostType;
  inputForm = new FormGroup({});
  lessons: Lesson[] = [];
  lesson: Lesson = new Lesson();
  SelectedSectionId: number = 0;
  SelectedSection: Section = new Section();
  Sections$ = this.store.select(selectAllSections);
  errorState = new BootstrapErrorStateMatcher();
  selectedSections: Section[] = [];
  courseId: number = 0;
  selectedTranslation: Lesson[] = [];
  AllLessons$ = this.store.select(selectAllLessons);
  AllLessons: Lesson[] = [];
  @Input() Action: string = "";
  @Input() UpdateObject: Lesson = new Lesson();
  @Input() ModalId: string = "LessonModal";
  @Input() CourseId: number = 0;
  @ViewChild("LessonModal") LessonModal!: BootstrapMoalComponent;
  constructor(private fb: FormBuilder, private LessonService: LessonsService,
    private TreeDataStructure: TreeDataStructureService<Section>,
    private ClientSideService: ClientSideValidationService,
    private store: Store
  ) { }
  ngOnChanges(changes: SimpleChanges): void
  {
    if ("Action" in changes)
    {
      this.LessonActionType = this.Action;
      if (this.Action == this.ActionType.Add)
      {
        this.SelectedSectionId = 0;
        this.inputForm.reset();
      }
      if (this.Action == this.ActionType.Edit)
      {
        this.SelectedSectionId = this.UpdateObject.sectionId;
        // this.inputForm.reset();
      }
      if ("UpdateObject" in changes)
      {
        this.UpdateObject = changes['UpdateObject'].currentValue;
        this.inputForm.get(FormControlNames.LessonForm.name)?.setValue(this.UpdateObject.name);
        this.inputForm.get(FormControlNames.LessonForm.description)?.setValue(this.UpdateObject.description);
        this.inputForm.get(FormControlNames.LessonForm.title)?.setValue(this.UpdateObject.title);
        if (this.UpdateObject.status === PostStatus.Published)
        {
          this.inputForm.get(FormControlNames.LessonForm.isArabic)?.disable();
        }
      }
    }
    if ("CourseId" in changes)
    {
      this.courseId = this.CourseId;
    }
  }

  ngOnInit(): void
  {
    this.LessonActionType = this.Action;
    this.courseId = this.CourseId;
    this.inputForm = this.fb.group({
      [FormControlNames.LessonForm.name]: [null, [validators.required]],
      [FormControlNames.LessonForm.description]: [null, [validators.required, validators.SEO_DESCRIPTION_MIN_LENGTH, validators.SEO_DESCRIPTION_MAX_LENGTH]],
      [FormControlNames.LessonForm.title]: [null, [validators.required, validators.SEO_TITLE_MIN_LENGTH, validators.SEO_TITLE_MAX_LENGTH]],
      [FormControlNames.LessonForm.isArabic]: [false],
      [FormControlNames.LessonForm.otherSlug]: [null, [validators.required]]
    });
    if (this.SelectedSectionId === 0)
    {
      this.inputForm.disable();
    }
    this.Sections$.subscribe(sections =>
    {
      let temp = sections.filter(section => section.courseId === Number(this.courseId));
      this.TreeDataStructure.setData(temp);
      this.selectedSections = this.TreeDataStructure.finalFlatenArray();
    });
    this.store.dispatch(LoadLessons());
    this.AllLessons$.subscribe(lessons => this.AllLessons = lessons);
  }
  Toggle()
  {
    this.LessonModal.Toggle();
  }
  CheckIfSulgNotUnique(title: string)
  {
    let slug = this.ClientSideService.GenerateSlug(title);
    if (this.LessonActionType === PostType.Add)
    {
      this.isSlugUnique(slug);
    } else if (this.LessonActionType === PostType.Edit && this.ClientSideService.isUpdated(this.lesson, this.inputForm))
    {
      if (this.lesson.slug !== slug)
        this.isSlugUnique(slug);
    }
  }
  isSlugUnique(slug: string)
  {
    this.LessonService.IsLessonSlug_NOT_Unique(slug, this.SelectedSectionId, this.courseId).subscribe(
      r =>
      {
        if (r)
          this.inputForm.get(FormControlNames.LessonForm.title)?.setErrors({ notUnique: r });
        else
        {
          this.inputForm.get(FormControlNames.LessonForm.title)?.setErrors(null);

        }
      }
    );
  }
  AddNewLesson()
  {
    this.store.dispatch(AddLesson(this.getLesson()));
  }
  Update()
  {
    this.store.dispatch(UpdateLesson(this.getLesson()));
  }
  onSectionChange()
  {
    if (this.SelectedSectionId > 0)
    {
      this.SelectedSection = this.selectedSections.filter(section => section.id === this.SelectedSectionId)[0];
      this.inputForm.enable();
    }
    else
    {
      this.inputForm.disable();
    }
  }
  getLesson(): Lesson
  {
    let lesson = new Lesson();
    lesson.name = this.inputForm.get(FormControlNames.LessonForm.name)?.value;
    lesson.description = this.inputForm.get(FormControlNames.LessonForm.description)?.value;
    lesson.title = this.inputForm.get(FormControlNames.LessonForm.title)?.value;
    lesson.slug = this.ClientSideService.GenerateSlug(lesson.title);
    lesson.sectionId = this.SelectedSectionId;
    lesson.courseId = this.courseId;
    if (this.LessonActionType === PostType.Add)
    {
      let selectedLessonsBySection = this.lessons.filter(x => x.sectionId === Number(this.SelectedSectionId)
        && x.courseId === Number(this.SelectedSection.courseId)).sort((a, b) => a.orderWithinSection - b.orderWithinSection);
      if (selectedLessonsBySection.length > 0)
        lesson.orderWithinSection = selectedLessonsBySection[selectedLessonsBySection.length - 1].orderWithinSection + 1;
      else
        lesson.orderWithinSection = 1;
    }
    return lesson;
  }
  SelectTranslation()
  {
    this.selectedTranslation = this.AllLessons.filter(x => x.isArabic !==
      Boolean(this.inputForm.get(FormControlNames.LessonForm.isArabic)?.value));
  }
}
