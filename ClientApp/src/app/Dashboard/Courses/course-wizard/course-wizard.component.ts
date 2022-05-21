import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { SpinnerService } from 'src/CommonServices/spinner.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { BaseUrl, CourseDifficultyLevel, FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PostType, sweetAlert, validators } from 'src/Helpers/constants';
import { Attachments, Course, CourseCategory } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { SelectAttachment } from 'src/State/Attachments/Attachments.actions';
import { LoadCourseCategorys } from 'src/State/CourseCategoryState/CourseCategory.actions';
import { selectAllCourseCategorys } from 'src/State/CourseCategoryState/CourseCategory.reducer';
import { AddCourse, LoadCourses, UpdateCourse } from 'src/State/CourseState/course.actions';
import { selectAllCourses, selectCourseByID } from 'src/State/CourseState/course.reducer';

@Component({
  selector: 'app-course-wizard',
  templateUrl: './course-wizard.component.html',
  styleUrls: ['./course-wizard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseWizardComponent implements OnInit
{
  FormControlNames = FormControlNames;
  errorState = new BootstrapErrorStateMatcher();
  InputFieldTypes = InputFieldTypes;
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  FormFieldsNames = FormFieldsNames;
  resetSelectedRow: boolean = false;
  isLoading = true;
  ActionType = PostType;
  Action: string = "";
  VedioID = "";
  allCourses$ = this.store.select(selectAllCourses);
  allCourses: Course[] = [];
  CourseToAddOrUpdate: Course = new Course();
  CourseForm: FormGroup = new FormGroup({});
  DifficultyLevels = CourseDifficultyLevel;
  BaseUrl = BaseUrl;
  FeatureImageUrl: string = "";
  selectedCategories: number[] = [];
  CourseCats = this.store.select(selectAllCourseCategorys);
  CourseCategorysArranged: CourseCategory[] = [];
  constructor(private fb: FormBuilder, private store: Store, private title: Title,
    private TreeStructure: TreeDataStructureService<CourseCategory>,
    private clientSideSevice: ClientSideValidationService,
    private spinner: SpinnerService, private Notifications: NotificationsService,
    private activatedRouter: ActivatedRoute, private router: Router,
    @Inject(DOCUMENT) private document: Document)
  {
  }

  ngOnInit(): void
  {
    this.store.dispatch(LoadCourseCategorys());
    this.store.dispatch(LoadCourses());
    this.CourseCats.subscribe(cats =>
    {
      this.isLoading = false;
      this.TreeStructure.setData(cats);
      this.CourseCategorysArranged = this.TreeStructure.finalFlatenArray();
    });
    this.CourseForm = this.fb.group({
      [FormControlNames.courseForm.name]: [null, [validators.required]],
      [FormControlNames.courseForm.title]: [null, [validators.required, validators.SEO_TITLE_MIN_LENGTH, validators.SEO_TITLE_MAX_LENGTH]],
      [FormControlNames.courseForm.description]: ['', [validators.required, validators.SEO_DESCRIPTION_MIN_LENGTH, validators.SEO_DESCRIPTION_MAX_LENGTH]],
      [FormControlNames.courseForm.whatWillYouLearn]: ['', [validators.required]],
      [FormControlNames.courseForm.targetAudience]: ['', [validators.required]],
      [FormControlNames.courseForm.requirementsOrInstructions]: [''],
      [FormControlNames.courseForm.courseFeatures]: [''],
      [FormControlNames.courseForm.difficultyLevel]: [0, [validators.required]],
      [FormControlNames.courseForm.status]: [0, [validators.required]],
      [FormControlNames.courseForm.featureImageUrl]: ['', [validators.required]],
      [FormControlNames.courseForm.introductoryVideoUrl]: ['', [validators.YoububeVideo]],
      [FormControlNames.courseForm.categories]: ['', [validators.required]],
    });
    this.activatedRouter.queryParams.subscribe(params =>
    {
      this.Action = params['action'];
      if (this.Action === PostType.Add)
      {
        this.title.setTitle("Add new course");
        if (this.Action === PostType.Add && (params['step'] || params['courseId']))
        {
          this.router.navigate([], { relativeTo: this.activatedRouter, queryParams: { action: PostType.Add } });
        }
        this.CourseForm.get(FormControlNames.courseForm.status)?.disable();
        this.ShowCurrentStep(`step1`);
      }
      else if (this.Action === PostType.Edit)
      {
        this.spinner.fullScreenSpinner();

        this.SelectCourseById(Number(params['courseId']));
        this.ShowCurrentStep(params['step']);
      }
    });
    this.allCourses$.subscribe(courses => this.allCourses = courses);
  }
  SetFeatureImage(attachment: Attachments | null)
  {
    console.log(attachment);
    this.FeatureImageUrl = attachment?.fileUrl!;
    this.CourseForm.get(FormControlNames.courseForm.featureImageUrl)?.setValue(attachment?.fileUrl);
  }
  GetVideo(VideoUrl: string)
  {
    this.CourseForm.get(FormControlNames.courseForm.introductoryVideoUrl)?.setValue(VideoUrl);
    let vedioId;
    if (VideoUrl.includes('youtu.be'))
    {
      vedioId = VideoUrl.split('youtu.be');
    }
    else if (VideoUrl.includes('list='))
    {
      let link = VideoUrl.split('&list=')[0];
      vedioId = link.split("youtube.com/watch?v=");
    }
    else
      vedioId = VideoUrl.split("youtube.com/watch?v=");
    vedioId = vedioId[vedioId.length - 1];
    this.VedioID = vedioId;
  }
  removeFeatureImage()
  {
    this.store.dispatch(SelectAttachment({ selectedFile: null }));
    this.FeatureImageUrl = "";
    this.CourseForm.get(FormControlNames.courseForm.featureImageUrl)?.setValue("");
  }
  ChangeStep(stepNo: number, currentStep: HTMLDivElement, action: string)
  {
    if (action === PostType.Add)
      this.router.navigate([], { relativeTo: this.activatedRouter, queryParams: { action: this.Action, step: `step${stepNo}` } });
    currentStep.style.zIndex = "-1";
    currentStep.style.visibility = "hidden";
    currentStep.style.opacity = "0";
    currentStep.style.transition = "all 0.5s ease-in-out";
    if (action === 'next')
    {
      this.ShowCurrentStep(`step${stepNo + 1}`);
    }
    else if (action === 'back')
    {
      this.ShowCurrentStep(`step${stepNo - 1}`);
    }
  }
  AddCourse()
  {
    this.clientSideSevice.FillObjectFromForm(this.CourseToAddOrUpdate, this.CourseForm);
    this.CourseToAddOrUpdate.slug = this.CourseToAddOrUpdate.title.toLowerCase().replace(/ ||/g, '-');
    let isUnique = this.clientSideSevice.isNotUnique(this.allCourses, 'slug', this.CourseToAddOrUpdate.slug);
    if (isUnique)
    {
      this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, "Title is not unique");
      return;
    }
    this.store.dispatch(AddCourse(this.CourseToAddOrUpdate));
  }
  ShowCurrentStep(step: string)
  {
    let allSteps = document.getElementsByClassName("step-container");
    let allBtns = document.getElementsByClassName("stepperBtn");
    for (let i = 0; i < allSteps.length; i++)
    {
      (<HTMLDivElement>allSteps[i]).style.zIndex = "-1";
      (<HTMLDivElement>allSteps[i]).style.visibility = "hidden";
      (<HTMLDivElement>allSteps[i]).style.opacity = "0";
      (<HTMLDivElement>allSteps[i]).style.transition = "all 0.5s ease-in-out";
    }
    let currentStep = <HTMLDivElement>this.document.getElementById(step);
    currentStep.style.zIndex = "2";
    currentStep.style.visibility = "visible";
    currentStep.style.opacity = "1";
    currentStep.style.transition = "all 0.5s ease-in-out";

    for (let i = 0; i < allBtns.length; i++)
    {
      (<HTMLButtonElement>allBtns[i]).classList.remove("bg-white");
      (<HTMLDivElement>allBtns[i]).style.transition = "all 0.5s ease-in-out";
      (<HTMLDivElement>allBtns[i]).style.border = "none";

    }
    let currentBtn = <HTMLButtonElement>this.document.getElementById(`${step}btn`);
    currentBtn.classList.add("bg-white");
    currentBtn.style.transition = "all 0.5s ease-in-out";
    currentBtn.style.border = "2px solid #3d5999";
  }
  selectCategory(selectedCatId: number)
  {
    let temp: number[] = [];
    temp = [...this.selectedCategories];
    temp.includes(selectedCatId)
      ? temp.splice(temp.indexOf(selectedCatId), 1)
      : temp.push(selectedCatId);
    this.selectedCategories = temp;
    this.CourseForm.get(FormControlNames.courseForm.categories)?.setValue(this.selectedCategories);
  }
  UpdateCourseInfo()
  {
    debugger;
    let updatedSlug = this.CourseForm.get(FormControlNames.courseForm.title)?.value.replace(" ", '-').replace("|-", "");
    if (this.CourseToAddOrUpdate.slug !== updatedSlug)
    {
      let isNotUnique = this.clientSideSevice.isNotUnique(this.allCourses, 'slug', updatedSlug, this.CourseToAddOrUpdate.id);
      if (isNotUnique)
      {
        this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, "Title is not unique");
        return;
      }
    }
    let updatedCourse = { ...this.CourseToAddOrUpdate };
    this.clientSideSevice.FillObjectFromForm(updatedCourse, this.CourseForm);
    updatedCourse.slug = updatedSlug;
    updatedCourse.categories = this.selectedCategories;
    this.store.dispatch(UpdateCourse(updatedCourse));
    this.CourseForm.get(FormControlNames.courseForm.categories)?.setValue(this.selectedCategories);
    this.SelectCourseById(updatedCourse.id);
  }
  SelectCourseById(Id: number)
  {
    this.store.select(selectCourseByID(Id)).subscribe(
      {
        next: course =>
        {
          if (course)
          {
            this.selectedCategories = [];
            console.log(course);
            course?.coursesPerCategories?.forEach(cat => { this.selectCategory(cat.courseCategoryId); });
            if (course?.introductoryVideoUrl)
              this.GetVideo(course?.introductoryVideoUrl!);
            this.CourseToAddOrUpdate = course!;
            this.FeatureImageUrl = course?.featureImageUrl!;
            this.CourseForm.patchValue(course!);
            this.CourseForm.get(FormControlNames.courseForm.categories)?.setValue(this.selectedCategories);
            this.CourseForm.markAllAsTouched();
            this.spinner.removeSpinner();
            this.title.setTitle("Edit course" + this.CourseToAddOrUpdate.name);
          }

        },
        error: err =>
        {
          this.spinner.removeSpinner();
          this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, "Error");
        }
      }
    );
  }
}