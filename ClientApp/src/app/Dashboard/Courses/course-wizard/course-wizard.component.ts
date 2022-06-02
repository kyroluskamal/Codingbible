import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { SpinnerService } from 'src/CommonServices/spinner.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { BaseUrl, CourseDifficultyLevel, FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PostType, sweetAlert, validators } from 'src/Helpers/constants';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { Attachments, Course, CourseCategory, Lesson, Section } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { SelectAttachment } from 'src/State/Attachments/Attachments.actions';
import { LoadCourseCategorys } from 'src/State/CourseCategoryState/CourseCategory.actions';
import { selectAllCourseCategorys } from 'src/State/CourseCategoryState/CourseCategory.reducer';
import { AddCourse, LoadCourses, UpdateCourse } from 'src/State/CourseState/course.actions';
import { selectAllCourses, selectCourseByID } from 'src/State/CourseState/course.reducer';
import { LoadLessons } from 'src/State/LessonsState/Lessons.actions';
import { LoadSections } from 'src/State/SectionsState/sections.actions';
import { selectAllSections } from 'src/State/SectionsState/sections.reducer';
import { SectionModalComponent } from '../section-modal/section-modal.component';

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
  SelectedSectionId: number = 0;
  ActionType = PostType;
  DashboardRoutes = DashboardRoutes;
  Action: string = "";
  VedioID = "";
  allCourses$ = this.store.select(selectAllCourses);
  AllCourseSections: Section[] = [];
  RootSections: Section[] = [];
  CourseId: number = 0;
  allCourses: Course[] = [];
  CourseToAddOrUpdate: Course = new Course();
  CourseForm: FormGroup = new FormGroup({});
  SectionForm: FormGroup = new FormGroup({});
  DifficultyLevels = CourseDifficultyLevel;
  BaseUrl = BaseUrl;
  SectionActionType = "";
  AllSections$ = this.store.select(selectAllSections);
  sectionssForSelectmenu: Section[] = [];
  SectionPostType: string = "";
  FeatureImageUrl: string = "";
  selectedCategories: number[] = [];
  LessonActionType: string = "";
  CourseCats = this.store.select(selectAllCourseCategorys);
  SectionToEdit: Section = new Section();
  LessonToUpdate: Lesson = new Lesson();
  CourseCategorysArranged: CourseCategory[] = [];
  constructor(private fb: FormBuilder, private store: Store, private title: Title,
    private TreeStructure: TreeDataStructureService<CourseCategory>,
    private TreeForSection: TreeDataStructureService<Section>,
    private clientSideSevice: ClientSideValidationService,
    private spinner: SpinnerService, private Notifications: NotificationsService,
    private activatedRouter: ActivatedRoute, private router: Router,
    @Inject(DOCUMENT) private document: Document)
  {
  }

  ngOnInit(): void
  {
    this.store.dispatch(LoadSections());
    this.store.dispatch(LoadCourseCategorys());
    this.store.dispatch(LoadCourses());
    this.store.dispatch(LoadLessons());
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
      [FormControlNames.courseForm.introductoryVideoUrl]: ['', [validators.YoutubeVideo]],
      [FormControlNames.courseForm.categories]: ['', [validators.required]],
    });
    this.activatedRouter.queryParams.subscribe(params =>
    {
      if (!params['action'])
      {
        this.invalidParams("<h4>No Action Is Selected</h4>");
      }
      // if (!params['step'])
      // {
      //   this.router.navigate([], { relativeTo: this.activatedRouter, queryParams: { action: params['action'], step: "1" } });
      // }
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
        if (!params['courseId'])
        {
          this.invalidParams();
        } else
        {
          this.CourseId = params['courseId'];
          if (this.CourseId == 0)
          {
            this.invalidParams("<h4>Invalid Action for course <span class='text-primary'>Id</span></h4>");
          } else
          {
            this.AllSections$.subscribe(res =>
            {
              this.TreeForSection.setData(res);
              this.RootSections = this.TreeForSection.getRawRoots();
              this.AllCourseSections = res.filter(x => x.courseId == Number(params['courseId']));
            });
            this.spinner.fullScreenSpinner();

            this.SelectCourseById(Number(params['courseId']));
            this.ShowCurrentStep(params['step']);
          }

        }

      }
    });
    this.allCourses$.subscribe(courses => this.allCourses = courses);
  }
  /****************************************************************
   *                    Step1:  Course Form handeling
   ****************************************************************/
  //#region Step1: Course addition deletion functions
  SetFeatureImage(attachment: Attachments | null)
  {
    console.log(attachment);
    this.FeatureImageUrl = attachment?.fileUrl!;
    this.CourseForm.get(FormControlNames.courseForm.featureImageUrl)?.setValue(attachment?.fileUrl);
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
      this.router.navigate([], { relativeTo: this.activatedRouter, queryParams: { action: this.Action, step: `step${stepNo + 1}`, courseId: this.CourseId } });
    }
    else if (action === 'back')
    {
      this.ShowCurrentStep(`step${stepNo - 1}`);
      this.router.navigate([], { relativeTo: this.activatedRouter, queryParams: { action: this.Action, step: `step${stepNo - 1}`, courseId: this.CourseId } });
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
            course?.coursesPerCategories?.forEach(cat => { this.selectCategory(cat.courseCategoryId); });
            if (course?.introductoryVideoUrl)
              this.GetVideo(course?.introductoryVideoUrl!);
            this.CourseToAddOrUpdate = course!;
            this.FeatureImageUrl = course?.featureImageUrl!;
            this.CourseForm.patchValue(course!);
            this.CourseForm.get(FormControlNames.courseForm.categories)?.setValue(this.selectedCategories);
            this.CourseForm.markAllAsTouched();
            this.spinner.removeSpinner();
            this.title.setTitle("Edit course : " + this.CourseToAddOrUpdate.name);
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
  //#endregion
  /****************************************************************
   *                    Step 2: Planner 
   ****************************************************************/
  //#region Step 2: Planner
  OpenSectionDialog(sectonModal: SectionModalComponent)
  {
    this.SectionActionType = this.ActionType.Add;
    sectonModal.Toggle();
  }
  //#endregion
  /****************************************************************
   *                   Helper functions
   * ***************************************************************/
  GetVideo(VideoUrl: string)
  {
    this.CourseForm.get(FormControlNames.courseForm.introductoryVideoUrl)?.setValue(VideoUrl);
    this.VedioID = this.clientSideSevice.GetVideo(VideoUrl);
  }
  SelectSectionToEdit(selectorForSection: HTMLSelectElement)
  {
    this.SectionToEdit = this.AllCourseSections.filter(section => section.id === Number(selectorForSection.value))[0];
  }
  invalidParams(message: string = "<h4>Invalid Action for course wizard</h4>")
  {
    this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, message);
    this.router.navigate(['', DashboardRoutes.Home, DashboardRoutes.Courses.Home]);
  }
  changeStepInRoute(step: string)
  {
    let parmas: Params;
    if (this.CourseId > 0)
      parmas = {
        action: this.Action, step: step, courseId: this.CourseId
      };
    else
    {
      parmas = {
        action: this.Action, step: step
      };
    }
    this.router.navigate([], {
      relativeTo: this.activatedRouter, queryParams: parmas
    });
  }
}
