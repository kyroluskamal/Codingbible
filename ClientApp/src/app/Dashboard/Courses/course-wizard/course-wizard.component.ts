import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { SpinnerService } from 'src/CommonServices/spinner.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { ArabicRegex, BaseUrl, CourseDifficultyLevel, FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PostStatus, PostType, sweetAlert, validators } from 'src/Helpers/constants';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { Attachments, Course, CourseCategory, Lesson, Section } from 'src/models.model';
import { SlugMapService } from 'src/Services/slug-map.service';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { SelectAttachment } from 'src/State/Attachments/Attachments.actions';
import { LoadCourseCategorys } from 'src/State/CourseCategoryState/CourseCategory.actions';
import { selectAllCourseCategorys } from 'src/State/CourseCategoryState/CourseCategory.reducer';
import { AddCourse, LoadCourses, UpdateCourse } from 'src/State/CourseState/course.actions';
import { selectAllCourses, selectCourseByID, selectCourseBySlug } from 'src/State/CourseState/course.reducer';
import { LoadLessons, UpdateLesson_Order } from 'src/State/LessonsState/Lessons.actions';
import { selectAllLessons } from 'src/State/LessonsState/Lessons.reducer';
import { LoadSections, UpdateSectionOrder } from 'src/State/SectionsState/sections.actions';
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
  selectedLessonOrder = new FormControl(1);
  allCourses$ = this.store.select(selectAllCourses);
  AllCourseSections: Section[] = [];
  RootSections: Section[] = [];
  CourseId: number = 0;
  allCourses: Course[] = [];
  SelectedLesson: Lesson = new Lesson();
  SelectedLessonId: number = 0;
  CourseToAddOrUpdate: Course = new Course();
  CourseForm: FormGroup = new FormGroup({});
  SectionForm: FormGroup = new FormGroup({});
  DifficultyLevels = CourseDifficultyLevel;
  BaseUrl = BaseUrl;
  SectionActionType = "";
  PreviousLesson: Lesson | null = null;
  NextLesson: Lesson | null = null;
  NewPreviousLesson: Lesson | null = null;
  NewNextLesson: Lesson | null = null;
  AllSections$ = this.store.select(selectAllSections);
  AllLessons$ = this.store.select(selectAllLessons);
  AllLessons: Lesson[] = [];
  sectionssForSelectmenu: Section[] = [];
  SectionPostType: string = "";
  FeatureImageUrl: string = "";
  selectedCategories: number[] = [];
  selectedLessonsBySectionId: Lesson[] = [];
  LessonActionType: string = "";
  LessonOrderChanged: boolean = false;
  SelectedSectionsId_ForFindingLessons: number = 0;
  CourseCats = this.store.select(selectAllCourseCategorys);
  SectionToEdit: Section = new Section();
  LessonToUpdate: Lesson = new Lesson();
  CourseCategorysArranged: CourseCategory[] = [];
  AllCourseCategories: CourseCategory[] = [];
  SelectedSectionsId_For_SectionOrder: number = 0;
  selectedSectionOrder: FormControl = new FormControl(1);
  SectionSplings: Section[] = [];
  SectionOrderChanged: boolean = false;
  PreviousSection: Section | null = null;
  NextSection: Section | null = null;
  NewPreviousSection: Section | null = null;
  NewNextSection: Section | null = null;
  SeclectedSectionForOrderChange: Section | null = null;
  selectedTranslation: Course[] = [];
  constructor(private fb: FormBuilder, private store: Store, private title: Title,
    private TreeStructure: TreeDataStructureService<CourseCategory>,
    private TreeForSection: TreeDataStructureService<Section>,
    public clientSideSevice: ClientSideValidationService,
    private spinner: SpinnerService, private Notifications: NotificationsService,
    private activatedRouter: ActivatedRoute, private router: Router,
    @Inject(DOCUMENT) private document: Document)
  {
  }

  ngOnInit(): void
  {
    this.selectedLessonOrder.disable();
    this.store.dispatch(LoadSections());
    this.store.dispatch(LoadCourseCategorys());
    this.store.dispatch(LoadCourses());
    this.store.dispatch(LoadLessons());
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
      [FormControlNames.courseForm.isArabic]: [{ value: false, disabled: true }],
      [FormControlNames.courseForm.otherSlug]: [null, [validators.required]],
    });
    this.CourseCats.subscribe(cats =>
    {
      this.AllCourseCategories = cats;
      this.setCourseCategoriesByLang();
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
              this.TreeForSection.setData(res.filter(x => x.courseId == Number(params['courseId'])));
              this.RootSections = this.TreeForSection.getRawRoots().sort((a, b) => a.order - b.order);
              this.AllCourseSections = this.TreeForSection.finalFlatenArray();
              this.AllLessons$.subscribe(lessons => this.AllLessons = lessons);
            });
            this.spinner.fullScreenSpinner();
            this.SelectCourseById(Number(params['courseId']));
            this.ShowCurrentStep(params['step']);
          }
        }
      }
    });
    this.allCourses$.subscribe(courses =>
    {
      this.allCourses = courses; this.SelectTranslation();
    });
    this.setCourseCategoriesByLang();
  }
  /****************************************************************
   *                    Step1:  Course Form handeling
   ****************************************************************/
  //#region Step1: Course addition deletion functions
  SetFeatureImage(attachment: Attachments | null)
  {
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
    this.CourseToAddOrUpdate.slug = this.clientSideSevice.GenerateSlug(this.CourseToAddOrUpdate.title);
    let isUnique = this.clientSideSevice.isNotUnique(this.allCourses, 'slug', this.CourseToAddOrUpdate.slug);
    if (isUnique)
    {
      this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, "Title is not unique");
      return;
    }

    if (this.CourseForm.get(FormControlNames.courseForm.otherSlug)?.value == "0")
    {
      this.CourseToAddOrUpdate.otherSlug = null;
    }
    // this.store.dispatch(AddCourse(this.CourseToAddOrUpdate));
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
    if (this.CourseForm.get(FormControlNames.courseForm.otherSlug)?.value == "0")
    {
      updatedCourse.otherSlug = null;
    }
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
            this.CourseForm.get(FormControlNames.courseForm.isArabic)?.setValue(course.isArabic);
            this.SelectTranslation();
            this.setCourseCategoriesByLang();
            this.selectedCategories = [];
            course?.coursesPerCategories?.forEach(cat => { this.selectCategory(cat.courseCategoryId); });
            if (course?.introductoryVideoUrl)
              this.GetVideo(course?.introductoryVideoUrl!);
            this.CourseToAddOrUpdate = course!;
            this.FeatureImageUrl = course?.featureImageUrl!;
            this.CourseForm.patchValue(course!);
            if (course?.otherSlug == null)
            {
              this.CourseForm.get(FormControlNames.courseForm.otherSlug)?.setValue("0");
            }
            this.CourseForm.get(FormControlNames.courseForm.categories)?.setValue(this.selectedCategories);
            this.CourseForm.get(FormControlNames.courseForm.otherSlug)?.markAsTouched();
            this.setCourseCategoriesByLang();
            this.spinner.removeSpinner();
            this.title.setTitle("Edit course : " + this.CourseToAddOrUpdate.name);
          }
          this.clientSideSevice.inputRedirection(this.CourseToAddOrUpdate.isArabic);
          this.CourseForm.markAllAsTouched();
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
  SelectLessonBySection()
  {
    if (this.SelectedSectionsId_ForFindingLessons > 0)
    {
      this.selectedLessonsBySectionId = this.AllLessons.filter(lesson =>
        lesson.sectionId === Number(this.SelectedSectionsId_ForFindingLessons)
      );
      this.selectedLessonsBySectionId.sort((a, b) => a.orderWithinSection - b.orderWithinSection);
    }
    else
    {
      this.selectedLessonsBySectionId = [];
    }
  }
  SelectLesson()
  {
    if (this.SelectedLessonId > 0)
    {
      this.SelectedLesson = this.selectedLessonsBySectionId.filter(lesson => lesson.id === Number(this.SelectedLessonId))[0];
      this.selectedLessonOrder.enable();
      this.selectedLessonOrder.setValue(this.SelectedLesson.orderWithinSection);
    } else
    {
      this.selectedLessonOrder.disable();
    }
    let currentLessonIndex = this.selectedLessonsBySectionId.indexOf(this.SelectedLesson);
    this.PreviousLesson = currentLessonIndex > 0 ? this.selectedLessonsBySectionId[currentLessonIndex - 1] : null;
    this.NextLesson = currentLessonIndex < this.selectedLessonsBySectionId.length - 1 ? this.selectedLessonsBySectionId[currentLessonIndex + 1] : null;
  }
  GetNewLessonPostion()
  {
    let newIndex = this.selectedLessonsBySectionId.findIndex(x => x.orderWithinSection === Number(this.selectedLessonOrder.value));
    this.NewPreviousLesson = newIndex > 0 ? this.selectedLessonsBySectionId[newIndex - 1] : null;
    this.NewNextLesson = newIndex < this.selectedLessonsBySectionId.length - 1 ? this.selectedLessonsBySectionId[newIndex + 1] : null;
  }
  UpdateLessonOrder()
  {
    let currentLessonIndex = this.selectedLessonsBySectionId.indexOf(this.SelectedLesson);
    this.selectedLessonsBySectionId.splice(currentLessonIndex, 1);
    this.selectedLessonsBySectionId.splice(Number(this.selectedLessonOrder.value) - 1, 0, this.SelectedLesson);
    let cloneArray: Lesson[] = [];
    cloneArray = JSON.parse(JSON.stringify(this.selectedLessonsBySectionId));
    cloneArray.forEach((lesson, index) =>
    {
      lesson.orderWithinSection = index + 1;
    }
    );
    this.store.dispatch(UpdateLesson_Order({ Lessons: cloneArray }));
  }
  SelectSectionForOrderChange()
  {
    this.SeclectedSectionForOrderChange = this.AllCourseSections.filter(section => section.id === Number(this.SelectedSectionsId_For_SectionOrder))[0];
    if (this.SeclectedSectionForOrderChange)
    {
      this.SectionSplings = this.AllCourseSections.filter(section => section.parentKey === this.SeclectedSectionForOrderChange?.parentKey)
        .sort((a, b) => a.order - b.order);
      this.selectedSectionOrder.enable();
      this.selectedSectionOrder.setValue(this.SeclectedSectionForOrderChange.order);
      let currentIndex = this.SectionSplings.findIndex(x => x.id === Number(this.SelectedSectionsId_For_SectionOrder));
      this.PreviousSection = currentIndex > 0 ? this.SectionSplings[currentIndex - 1] : null;
      this.NextSection = currentIndex < this.SectionSplings.length - 1 ? this.SectionSplings[currentIndex + 1] : null;
    }
    else
    {
      this.selectedSectionOrder.disable();
    }
    this.SectionOrderChanged = false;
  }
  GetNewSectionPostion()
  {
    let newIndex = this.SectionSplings.findIndex(x => x.order === Number(this.selectedSectionOrder.value));
    this.NewPreviousSection = newIndex > 0 ? this.SectionSplings[newIndex - 1] : null;
    this.NewNextSection = newIndex < this.SectionSplings.length - 1 ? this.SectionSplings[newIndex + 1] : null;
    console.log(this.NewPreviousSection, this.NewNextSection);
  }
  UpdateSectionOrder()
  {
    let currentSectionIndex = this.SectionSplings.indexOf(this.SeclectedSectionForOrderChange!);
    this.SectionSplings.splice(currentSectionIndex, 1);
    this.SectionSplings.splice(Number(this.selectedSectionOrder.value) - 1, 0, this.SeclectedSectionForOrderChange!);
    let cloneArray: Section[] = [];
    cloneArray = JSON.parse(JSON.stringify(this.SectionSplings));
    cloneArray.forEach((sec, index) =>
    {
      sec.order = index + 1;
    });
    this.store.dispatch(UpdateSectionOrder({ payload: cloneArray }));
  }
  SelectTranslation()
  {
    this.selectedTranslation = this.allCourses.filter(x => x.isArabic
      !== Boolean(this.CourseForm.get(FormControlNames.courseForm.isArabic)?.value));
  }

  setIsArabic(formControlName: string)
  {
    let isArabic = ArabicRegex.test(this.CourseForm.get(formControlName)?.value);
    this.clientSideSevice.setIsArabic(isArabic, this.CourseToAddOrUpdate.isArabic,
      this.CourseToAddOrUpdate,
      this.CourseForm, this.Action, "course");
    this.SelectTranslation();
    this.setCourseCategoriesByLang();
    this.clientSideSevice.inputRedirection(this.CourseForm.get(FormControlNames.courseForm.isArabic)?.value);
  }
  setCourseCategoriesByLang()
  {

    if (Boolean(this.CourseForm.get(FormControlNames.courseForm.isArabic)?.value))
    {
      this.TreeStructure.setData(this.AllCourseCategories.filter(x => x.isArabic));
      this.CourseCategorysArranged = this.TreeStructure.finalFlatenArray();
    } else
    {
      this.TreeStructure.setData(this.AllCourseCategories.filter(x => !x.isArabic));
      this.CourseCategorysArranged = this.TreeStructure.finalFlatenArray();
    }
  }
  FormReset()
  {
    this.CourseForm.reset();
    this.CourseForm.get(FormControlNames.courseForm.isArabic)?.setValue(false);
    this.CourseForm.get(FormControlNames.courseForm.status)?.setValue(0);
    this.CourseForm.get(FormControlNames.courseForm.difficultyLevel)?.setValue(0);
    this.CourseForm.get(FormControlNames.courseForm.categories)?.setValue('');
    this.selectedCategories = [];
    this.SetFeatureImage(null);
    this.FeatureImageUrl = "";
    this.VedioID = "";
    this.setCourseCategoriesByLang();
  }
  GoToTranslatedCourse()
  {
    this.store.select(selectCourseBySlug(this.CourseToAddOrUpdate.otherSlug!)).subscribe(course =>
    {
      if (course)
      {
        this.router.navigate([], { relativeTo: this.activatedRouter, queryParams: { action: this.Action, step: `step1`, courseId: course?.id } });
        this.SelectCourseById(course?.id!);
      }
    });
  }

}

