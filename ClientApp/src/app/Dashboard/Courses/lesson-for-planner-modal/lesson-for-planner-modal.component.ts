import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { ArabicRegex, FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PostStatus, PostType, sweetAlert, validators } from 'src/Helpers/constants';
import { Course, Lesson, Section } from 'src/models.model';
import { LessonsService } from 'src/Services/lessons.service';
import { selectCourseByID } from 'src/State/CourseState/course.reducer';
import { AddLesson, LoadLessons, UpdateLesson } from 'src/State/LessonsState/Lessons.actions';
import { selectAllLessons } from 'src/State/LessonsState/Lessons.reducer';
import { Select_Sections_ByCourseId } from 'src/State/SectionsState/sections.reducer';

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
  errorState = new BootstrapErrorStateMatcher();
  selectedSections: Section[] = [];
  courseId: number = 0;
  selectedTranslation: Lesson[] = [];
  AllLessons$ = this.store.select(selectAllLessons);
  AllLessons: Lesson[] = [];
  currentCoruse: Course = new Course();
  @Input() Action: string = "";
  @Input() UpdateObject: Lesson = new Lesson();
  @Input() ModalId: string = "LessonModal";
  @Input() CourseId: number = 0;
  @ViewChild("LessonModal") LessonModal!: BootstrapMoalComponent;
  constructor(private fb: FormBuilder, private LessonService: LessonsService,
    public ClientSideService: ClientSideValidationService,
    private store: Store, private Notifications: NotificationsService
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
      }
    }
    if ("CourseId" in changes)
    {
      this.courseId = this.CourseId;
    }
    this.GetCourseById();
    this.selectSectionsByCourseId();
  }

  ngOnInit(): void
  {
    this.LessonActionType = this.Action;
    this.courseId = this.CourseId;
    this.inputForm = this.fb.group({
      [FormControlNames.LessonForm.name]: [null, [validators.required]],
      [FormControlNames.LessonForm.description]: [null, [validators.required, validators.SEO_DESCRIPTION_MIN_LENGTH, validators.SEO_DESCRIPTION_MAX_LENGTH]],
      [FormControlNames.LessonForm.title]: [null, [validators.required, validators.SEO_TITLE_MIN_LENGTH, validators.SEO_TITLE_MAX_LENGTH]],
      [FormControlNames.LessonForm.isArabic]: [{ value: false, disabled: true }],
      [FormControlNames.LessonForm.otherSlug]: [null, [validators.required]]
    });
    if (this.SelectedSectionId === 0)
    {
      this.inputForm.disable();
    }
    this.store.dispatch(LoadLessons());
    this.AllLessons$.subscribe(lessons => { this.AllLessons = lessons; this.SelectTranslation(); });
  }
  Toggle()
  {
    this.LessonModal.Toggle();
    this.inputForm.reset();
    this.GetCourseById();
    this.SelectTranslation();
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
    if (slug.length > 0)
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
      this.SelectedSection = this.selectedSections.filter(section => section.id === Number(this.SelectedSectionId))[0];
      this.inputForm.enable();
      this.inputForm.get(FormControlNames.LessonForm.isArabic)?.disable();
    }
    else
    {
      this.inputForm.disable();
    }
    this.SelectTranslation();
  }
  getLesson(): Lesson
  {
    let lesson = new Lesson();
    lesson.name = this.inputForm.get(FormControlNames.LessonForm.name)?.value;
    lesson.nameSlugFragment = this.ClientSideService.GenerateSlug(lesson.name);
    lesson.description = this.inputForm.get(FormControlNames.LessonForm.description)?.value;
    lesson.title = this.inputForm.get(FormControlNames.LessonForm.title)?.value;
    lesson.slug = this.ClientSideService.GenerateSlug(lesson.title);
    lesson.sectionId = this.SelectedSectionId;
    lesson.courseId = this.courseId;
    lesson.isArabic = Boolean(this.inputForm.get(FormControlNames.LessonForm.isArabic)?.value);
    if (this.inputForm.get(FormControlNames.courseForm.otherSlug)?.value == "0")
    {
      lesson.otherSlug = null;
    } else
    {
      lesson.otherSlug = this.inputForm.get(FormControlNames.courseForm.otherSlug)?.value;
    }
    if (this.LessonActionType === PostType.Add)
    {
      let selectedLessonsBySection = this.AllLessons.filter(x =>
        x.sectionId === Number(this.SelectedSectionId)
        && x?.courseId === Number(this.SelectedSection?.courseId)
      ).sort((a, b) => a.orderWithinSection - b.orderWithinSection);
      if (selectedLessonsBySection.length > 0)
      {
        lesson.orderWithinSection = selectedLessonsBySection[selectedLessonsBySection.length - 1].orderWithinSection + 1;
      } else
        lesson.orderWithinSection = 1;
    }
    return lesson;
  }
  SelectTranslation()
  {
    this.selectedTranslation = this.AllLessons.filter(x => x.isArabic !==
      Boolean(this.inputForm.get(FormControlNames.LessonForm.isArabic)?.value));
  }
  GetCourseById()
  {
    this.store.select(selectCourseByID(this.CourseId)).subscribe(
      r =>
      {
        if (r)
        {
          this.currentCoruse = r;
          this.inputForm.get(FormControlNames.LessonForm.isArabic)?.setValue(r.isArabic);
          this.SelectTranslation();
        }
      }
    );
  }
  selectSectionsByCourseId()
  {
    this.store.select(Select_Sections_ByCourseId(Number(this.CourseId))).subscribe(
      r =>
      {
        if (r)
        {
          let sections = r as Section[];
          this.selectedSections = sections;
        }
      }
    );
  }
  isTheSameCourseLang(formControlName: string)
  {
    let isArabic = ArabicRegex.test(this.inputForm.get(FormControlNames.LessonForm.title)?.value)
      || ArabicRegex.test(this.inputForm.get(FormControlNames.LessonForm.name)?.value)
      || ArabicRegex.test(this.inputForm.get(FormControlNames.LessonForm.description)?.value);
    if (!isArabic && this.currentCoruse.isArabic)
    {
      this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK,
        `<h4>You are adding lesson in an <span class='text-danger'>Arabic </span>course. You have to add it in<span class="text-success"> Arabic</span></h4>`);
      this.inputForm.get(formControlName)?.setValue((<any>this.lesson)[formControlName]);
    } else if (isArabic && !this.currentCoruse.isArabic)
    {
      this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK,
        `<h4>You are adding lesson in an <span class='text-danger'>English </span>course. You have to add it in<span class="text-success"> English</span></h4>`);
      this.inputForm.get(formControlName)?.setValue((<any>this.lesson)[formControlName]);
    }
  }
}
