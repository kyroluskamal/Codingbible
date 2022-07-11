import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { SpinnerService } from 'src/CommonServices/spinner.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { ArabicRegex, BaseUrl, FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PostStatus, PostType, sweetAlert, validators } from 'src/Helpers/constants';
import { CustomErrorStateMatcher } from 'src/Helpers/custom-error-state-matcher';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { SelectedTextData } from 'src/Interfaces/interfaces';
import { Attachments, Course, Lesson, LessonAttachments, Section } from 'src/models.model';
import { LessonsService } from 'src/Services/lessons.service';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { SelectAttachment } from 'src/State/Attachments/Attachments.actions';
import { LoadCourses } from 'src/State/CourseState/course.actions';
import { selectAllCourses, selectCourseByID } from 'src/State/CourseState/course.reducer';
import { selectPinned } from 'src/State/DesignState/design.reducer';
import { AddLesson, ChangeStatus, GetLessonById, RemoveLesson, SetValidationErrors, UpdateLesson } from 'src/State/LessonsState/Lessons.actions';
import { selectAllLessons, selectLessonBySlug, selectLessonsByID, select_Lessons_ValidationErrors } from 'src/State/LessonsState/Lessons.reducer';
import { GetSectionsByCourseId, LoadSections } from 'src/State/SectionsState/sections.actions';
import { selectAllSections } from 'src/State/SectionsState/sections.reducer';

@Component({
  selector: 'app-lesson-handler',
  templateUrl: './lesson-handler.component.html',
  styleUrls: ['./lesson-handler.component.css']
})
export class LessonHandlerComponent implements OnInit, AfterViewInit
{
  ValidationErrors$ = this.store.select(select_Lessons_ValidationErrors);
  PostType = PostType;
  PostStatus = PostStatus;
  FormControlNames = FormControlNames;
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  FormFieldsNames = FormFieldsNames;
  InputFieldTypes = InputFieldTypes;
  DashboardRoutes = DashboardRoutes;
  errorState = new BootstrapErrorStateMatcher();
  SelectedCourseId: number = 0;
  SelectedSectionId: number = 0;
  Courses$ = this.store.select(selectAllCourses);
  Sections$ = this.store.select(selectAllSections);
  AllSections: Section[] = [];
  SectionsOfSelectedCourse: Section[] = [];
  selectValidationError = this.store.select(select_Lessons_ValidationErrors);
  lessonsAttachments: number[] = [];
  @Input() inputForm: FormGroup = new FormGroup({});
  Today = Date.now();
  lesson: Lesson = new Lesson();
  BaseUrl = BaseUrl;
  SectionActionType: string = '';
  SectionToAddOrUpdate: Section = new Section();
  viewWidth: number = window.innerWidth;
  viewHeight: number = window.innerHeight;
  ActionType: string = "";
  selectedTranslation: Lesson[] = [];
  @ViewChild("view", { read: ElementRef }) view: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  @ViewChild("StickyNotesHandler", { read: ElementRef }) StickyNotesHandler: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  @ViewChild("StickyNotesContainer", { read: ElementRef }) StickyNotesContainer: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  @ViewChild("StickyNotes", { read: ElementRef }) StickyNotes: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  @ViewChild("html", { read: ElementRef }) html: ElementRef<HTMLTextAreaElement> = {} as ElementRef<HTMLTextAreaElement>;
  mousex: number = 0;
  mousey: number = 0;
  validators = Validators;
  CustoErrorStateMatcher = new CustomErrorStateMatcher();
  selectedText: SelectedTextData = {
    Range: new Range(),
    text: "",
    start: -1,
    end: -1,
    anchorNode: null,
    focusNode: null,
    mouseX: this.mousex,
    mouseY: this.mousey
  };
  stickyNodeIsOpened: boolean = false;
  lessons: Lesson[] = [];
  pinned$ = this.store.select(selectPinned);
  lessons$ = this.store.select(selectAllLessons);
  LessonById = new Observable<Lesson | undefined>();
  lessonTitle: string = '';
  sideBarWidth: number = 0;
  IsUpdated: boolean = false;
  modal_fullscreen = "modal-fullscreen";
  VedioID: string = "";
  currentCourse: Course = new Course();

  /**********************************************************************************************************
   *                                                Constructor
   ************************************************************************************/
  constructor(public store: Store, private LessonService: LessonsService,
    @Inject(DOCUMENT) private document: Document, private title: Title,
    private fb: FormBuilder, private router: Router,
    private spinner: SpinnerService,
    private Notifications: NotificationsService,
    private ChangeDetection: ChangeDetectorRef,
    private treeDataStructure: TreeDataStructureService<Section>,
    public ClientSideService: ClientSideValidationService, public ActivatedRouter: ActivatedRoute)
  {
  }
  ngAfterViewInit(): void
  {
    this.store.dispatch(LoadCourses());
    this.document.body.append(this.StickyNotesContainer.nativeElement);
    this.StickyNotesContainer.nativeElement.style.zIndex = "1 !important";
    let matSideNav = this.document.getElementsByTagName('mat-sidenav')[0];
    this.pinned$.subscribe((x) =>
    {
      if (x)
      {
        this.sideBarWidth = (<HTMLElement>matSideNav).offsetWidth;
        this.closeStickyNotes();
      } else
      {
        this.sideBarWidth = 0;
        this.closeStickyNotes();
      }
    });
    this.StickyNotesContainer.nativeElement.style.transform = `translate(${this.viewWidth -
      this.StickyNotesHandler.nativeElement.offsetWidth}px,${this.viewHeight * -1 + this.viewHeight * 0.13}px)`;
    this.Sections$.subscribe((x) =>
    {
      this.AllSections = x;
      let tmep = this.AllSections.filter((y) => y.courseId == this.SelectedCourseId);
      this.treeDataStructure.setData(tmep);
      this.SectionsOfSelectedCourse = this.treeDataStructure.finalFlatenArray();
    });
    this.ChangeDetection.detectChanges();
    this.view.nativeElement.innerHTML = this.lesson.htmlContent ? '' : this.lesson.htmlContent;
  }
  ToggleStickyNotes()
  {
    this.stickyNodeIsOpened = !this.stickyNodeIsOpened;
    this.StickyNotesContainer.nativeElement.style.transition = "all 0.5s ease-in-out";
    if (this.stickyNodeIsOpened)
      this.StickyNotesContainer.nativeElement.style.transform = `translate(${this.viewWidth -
        this.StickyNotesContainer.nativeElement.offsetWidth}px,${this.viewHeight * -1 + this.viewHeight * 0.13}px)`;
    else
      this.StickyNotesContainer.nativeElement.style.transform = `translate(${this.viewWidth -
        this.StickyNotesHandler.nativeElement.offsetWidth}px,${this.viewHeight * -1 + this.viewHeight * 0.13}px)`;
  }

  closeStickyNotes()
  {
    this.stickyNodeIsOpened = false;
    this.StickyNotesContainer.nativeElement.style.transition = "all 0.5s ease-in-out";
    this.StickyNotesContainer.nativeElement.style.transform = `translate(${this.viewWidth -
      this.StickyNotesHandler.nativeElement.offsetWidth}px,${this.viewHeight * -1 + this.viewHeight * 0.13}px)`;
  }

  ngOnInit(): void
  {
    this.lessons$.subscribe(x => this.lessons = x);
    if (this.router.url.includes(DashboardRoutes.Courses.Lessons.AddLesson))
    {
      this.ActionType = PostType.Add;
    }
    if (this.router.url.includes(DashboardRoutes.Courses.Lessons.EditLesson))
    {
      this.ActionType = PostType.Edit;
    }

    this.inputForm = this.fb.group({
      [FormControlNames.LessonForm.name]: [null, [validators.required]],
      [FormControlNames.LessonForm.description]: [null, [validators.required, validators.SEO_DESCRIPTION_MIN_LENGTH, validators.SEO_DESCRIPTION_MAX_LENGTH]],
      [FormControlNames.LessonForm.title]: [null, [validators.required, validators.SEO_TITLE_MIN_LENGTH, validators.SEO_TITLE_MAX_LENGTH]],
      [FormControlNames.LessonForm.vedioUrl]: [null, [validators.YoutubeVideo]],
      [FormControlNames.LessonForm.htmlContent]: [null],
      [FormControlNames.LessonForm.featureImageUrl]: [null, [validators.required]],
      [FormControlNames.LessonForm.isArabic]: [{ value: false, disabled: true }],
      [FormControlNames.LessonForm.otherSlug]: [null, [validators.required]],
    });
    window.addEventListener('resize', () =>
    {
      this.viewWidth = window.innerWidth;
      this.viewHeight = window.innerHeight;
      this.stickyNodeIsOpened = false;
      this.StickyNotesContainer.nativeElement.style.transform = `translate(${this.viewWidth -
        this.StickyNotesHandler.nativeElement.offsetWidth}px,${this.viewHeight * -1 + this.viewHeight * 0.13}px)`;
    });
    this.store.dispatch(SetValidationErrors({ validationErrors: [] }));
    this.document.addEventListener("mousemove", (e) =>
    {
      this.mousex = e.pageX;
      this.mousey = e.pageY;
    });

    this.ActivatedRouter.queryParams.subscribe(x =>
    {
      if (this.router.url.includes(DashboardRoutes.Courses.Lessons.EditLesson) && !x['id'])
      {
        this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, "<h4>Invalid url parameters</h4>");
        this.router.navigate(['', DashboardRoutes.Home, DashboardRoutes.Courses.Home, DashboardRoutes.Courses.Lessons.Home]);
        return;
      }
      if (this.router.url.includes(DashboardRoutes.Courses.Lessons.EditLesson) && x['id'])
      {
        this.store.dispatch(GetLessonById({ id: Number(x['id']) }));
        this.LessonById = this.store.select(selectLessonsByID(Number(x['id'])));
        this.LessonById.subscribe(r =>
        {
          if (r)
          {
            let lesson = r as Lesson;
            this.onCourseChange(lesson.courseId.toString());
            this.onSectionChange(lesson.sectionId.toString());
            this.SelectedCourseId = lesson.courseId;
            this.SelectedSectionId = lesson.sectionId;
            this.lesson = Object.assign({}, r);
            this.inputForm.patchValue(this.lesson);
            this.title.setTitle(`Edit lesson - ${this.lesson.title}`);
            this.lesson.featureImageUrl = this.lesson.featureImageUrl.includes("http") ? this.lesson.featureImageUrl : `${this.BaseUrl}${this.lesson.featureImageUrl}`;
            this.inputForm.get(FormControlNames.LessonForm.featureImageUrl)?.setValue(this.lesson.featureImageUrl);

            this.inputForm.get(FormControlNames.LessonForm.otherSlug)?.setValue(this.lesson.otherSlug === null ? 0 : this.lesson.otherSlug);

            this.inputForm.get(FormControlNames.LessonForm.htmlContent)?.setValue(this.lesson.htmlContent === null ? '' : this.lesson.htmlContent);
            for (let i = 0; i < lesson?.attachments.length!; i++)
            {
              this.lessonsAttachments.push(lesson?.attachments[i]?.attachmentId!);
            }
            this.VedioID = this.ClientSideService.GetVideo(this.lesson.vedioUrl);
          }
          this.inputForm.get(FormControlNames.LessonForm.featureImageUrl)?.clearValidators();
          this.inputForm.markAllAsTouched();
        });
      }
    });
    if (this.ActionType === PostType.Add)
    { this.title.setTitle("Add new lesson"); }
    if (this.SelectedCourseId === 0 || this.SelectedSectionId === 0)
    {
      this.inputForm.disable();
    }
  }
  UpdateView(html: HTMLTextAreaElement, view: HTMLDivElement)
  {
    view.innerHTML = html.value;
    this.inputForm.get(FormControlNames.LessonForm.htmlContent)?.setValue(view.innerHTML);
  }

  UpdateHtml(html: HTMLTextAreaElement, view: HTMLDivElement)
  {
    this.inputForm.get(FormControlNames.LessonForm.htmlContent)?.setValue(view.innerHTML);
    this.lesson.title = String(this.inputForm.get(FormControlNames.LessonForm.title)?.value);
    this.lesson.description = String(this.inputForm.get(FormControlNames.LessonForm.description)?.value);
    this.lesson.htmlContent = this.view.nativeElement.innerHTML;
    html.value = view.innerHTML;
  }

  CreateSlug(title: HTMLInputElement, slug: HTMLInputElement)
  {
    this.lesson.title = String(this.inputForm.get(FormControlNames.LessonForm.title)?.value);
    this.lesson.description = String(this.inputForm.get(FormControlNames.LessonForm.description)?.value);
    this.lesson.htmlContent = this.view.nativeElement.innerHTML;
    this.lesson.slug = this.ClientSideService.GenerateSlug(this.lesson.title);
    slug.value = this.ClientSideService.GenerateSlug(this.lesson.title);
    this.inputForm.get(FormControlNames.LessonForm.title)?.setValue(this.lesson.slug);
  }
  GetSelectedText()
  {
    var range: Range | undefined = new Range();
    var selection: Selection | null = null;
    if (window.getSelection && window.getSelection()?.rangeCount! > 0)
    {
      range = window.getSelection()?.getRangeAt(0);
      selection = window.getSelection();
    }
    else if (this.document.getSelection() && this.document.getSelection()?.rangeCount! > 0)
    {
      range = this.document.getSelection()?.getRangeAt(0);
      selection = this.document.getSelection();
    }
    this.selectedText = this.ClientSideService.GetSelectedText();
  }
  UpdateClicked()
  {
    this.lessonsAttachments = [];
    let allImages = this.view.nativeElement.querySelectorAll("img[data-atachId]");
    for (let i = 0; i < allImages.length; i++)
    {
      let img = <HTMLImageElement>allImages[i];
      let atachId = img.getAttribute("data-atachId");
      this.lessonsAttachments.push(Number(atachId));
    }
    this.ClientSideService.FillObjectFromForm(this.lesson, this.inputForm);
    this.lesson.htmlContent = this.view.nativeElement.innerHTML;
    this.lesson.slug = this.ClientSideService.GenerateSlug(this.lesson.title);
    this.lesson.nameSlugFragment = this.ClientSideService.GenerateSlug(this.lesson.name);
    this.lesson.tempAttach = this.lessonsAttachments;
    console.log(this.lesson);
    this.store.dispatch(UpdateLesson(this.lesson));
  }
  DraftOrPublish(view: HTMLDivElement, draftOrPublish: string)
  {
    this.lessonsAttachments = [];
    let allImages = this.view.nativeElement.querySelectorAll("img[data-atachId]");
    for (let i = 0; i < allImages.length; i++)
    {
      let img = <HTMLImageElement>allImages[i];
      let atachId = img.getAttribute("data-atachId");
      this.lessonsAttachments.push(Number(atachId));
    }
    this.ClientSideService.FillObjectFromForm(this.lesson, this.inputForm);
    this.inputForm.get(FormControlNames.LessonForm.htmlContent)?.setValue(view.innerHTML);
    this.lesson.slug = this.ClientSideService.GenerateSlug(this.lesson.title);
    this.lesson.nameSlugFragment = this.ClientSideService.GenerateSlug(this.lesson.name);
    this.lesson.courseId = Number(this.SelectedCourseId);
    this.lesson.sectionId = Number(this.SelectedSectionId);
    this.lesson.tempAttach = this.lessonsAttachments;
    if (this.lesson.otherSlug == "0")
    {
      this.lesson.otherSlug = null;
    }
    if (draftOrPublish === "Draft")
    {
      this.lesson.status = PostStatus.Draft;
    }
    else
    {
      this.lesson.status = PostStatus.Published;
    }
    let selectedLessonsBySection = this.lessons.filter(x => x.sectionId === Number(this.SelectedSectionId)
      && x.courseId === Number(this.SelectedCourseId)).sort((a, b) => a.orderWithinSection - b.orderWithinSection);
    if (selectedLessonsBySection.length > 0)
      this.lesson.orderWithinSection = selectedLessonsBySection[selectedLessonsBySection.length - 1].orderWithinSection + 1;
    else
      this.lesson.orderWithinSection = 1;
    this.store.dispatch(AddLesson(this.lesson));
  }
  CheckIfSulgNotUnique(title: string)
  {
    let slug = this.ClientSideService.GenerateSlug(title);
    if (this.ActionType === PostType.Add)
    {
      this.isSlugUnique(slug);
    } else if (this.ActionType === PostType.Edit && this.ClientSideService.isUpdated(this.lesson, this.inputForm))
    {
      if (this.lesson.slug !== slug)
        this.isSlugUnique(slug);
    }
  }
  DeleteClicked()
  {
    this.store.dispatch(RemoveLesson({ id: this.lesson?.id!, url: DashboardRoutes.Courses.Lessons.EditLesson, otherSlug: this.lesson?.otherSlug! }));
  }
  isSlugUnique(slug: string)
  {
    this.LessonService.IsLessonSlug_NOT_Unique(slug, this.SelectedSectionId, this.SelectedCourseId).subscribe(
      r =>
      {
        if (r)
          this.inputForm.get(FormControlNames.LessonForm.title)?.setErrors({ notUnique: true });
        else
          this.inputForm.get(FormControlNames.LessonForm.title)?.setErrors(null);
      }
    );
  }
  changeStatus(status: number)
  {
    this.lesson.status = status;
    this.store.dispatch(ChangeStatus(this.lesson));
  }
  SetFeatureImage(event: Attachments | null)
  {
    if (event)
    {
      let editedUrl = event.fileUrl.includes("http") ? event.fileUrl : `${this.BaseUrl}${event.fileUrl}`;
      this.lesson.featureImageUrl = editedUrl;
      this.inputForm.get(FormControlNames.LessonForm.featureImageUrl)?.setValue(event.fileUrl);
    }
  }
  removeFeatureImage()
  {
    this.store.dispatch(SelectAttachment({ selectedFile: null }));
    this.lesson.featureImageUrl = "";
    this.inputForm.get(FormControlNames.LessonForm.featureImageUrl)?.setValue("");
  }
  GetVideo(videoUrl: string)
  {
    this.VedioID = this.ClientSideService.GetVideo(videoUrl);
  }
  onCourseChange(CourseId: string)
  {
    let courseId = Number(CourseId);
    if (courseId > 0)
    {
      this.lesson.courseId = courseId;
      this.store.dispatch(GetSectionsByCourseId({ courseId: courseId }));
      let temp = this.AllSections.filter(Section => Section.courseId == this.SelectedCourseId);
      this.treeDataStructure.setData(temp);
      this.SectionsOfSelectedCourse = this.treeDataStructure.finalFlatenArray();
      this.SelectedSectionId = 0;
      this.inputForm.disable();
      this.SelectCourseById(courseId);
    }

  }
  onSectionChange(SectionId: string)
  {
    let sectionId = Number(SectionId);
    if (sectionId > 0)
    {
      this.inputForm.enable();
      this.lesson.sectionId = sectionId;
      let temp = this.AllSections.filter(Section => Section.courseId == this.SelectedCourseId);
      this.treeDataStructure.setData(temp);
      this.SectionsOfSelectedCourse = this.treeDataStructure.finalFlatenArray();
      this.SectionToAddOrUpdate = this.SectionsOfSelectedCourse.filter(s => s.id === sectionId)[0];
    } else
    {
      this.inputForm.disable();
    }
    this.inputForm.get(FormControlNames.LessonForm.isArabic)?.disable();
    this.SelectTranslation();
  }
  SelectTranslation()
  {
    this.selectedTranslation = this.lessons.filter(x => x.isArabic !==
      Boolean(this.inputForm.get(FormControlNames.LessonForm.isArabic)?.value));
  }
  SelectCourseById(Id: number)
  {
    this.store.select(selectCourseByID(Id)).subscribe(
      {
        next: course =>
        {
          if (course)
          {
            this.currentCourse = course;
            this.inputForm.get(FormControlNames.LessonForm.isArabic)?.setValue(course.isArabic);
            this.SelectTranslation();
            this.inputForm.get(FormControlNames.LessonForm.otherSlug)?.markAsTouched();
            this.spinner.removeSpinner();
          }
          this.ClientSideService.inputRedirection(<boolean>course?.isArabic);
          this.inputForm.markAllAsTouched();
        },
        error: err =>
        {
          this.spinner.removeSpinner();
          this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, "Error");
        }
      }
    );
  }
  isTheSameCourseLang(formControlName: string)
  {
    let isArabic = ArabicRegex.test(this.inputForm.get(FormControlNames.LessonForm.title)?.value)
      || ArabicRegex.test(this.inputForm.get(FormControlNames.LessonForm.name)?.value)
      || ArabicRegex.test(this.inputForm.get(FormControlNames.LessonForm.description)?.value);
    if (!isArabic && this.currentCourse.isArabic)
    {
      this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK,
        `<h4>You are adding lesson in an <span class='text-danger'>Arabic </span>course. You have to add it  in<span class="text-success"> Arabic</span></h4>`);
      this.inputForm.get(formControlName)?.setValue((<any>this.lesson)[formControlName]);
    } else if (isArabic && !this.currentCourse.isArabic)
    {
      this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK,
        `<h4>You are adding lesson in an <span class='text-danger'>English </span>course. You have to add it in<span class="text-success"> English</span></h4>`);
      this.inputForm.get(formControlName)?.setValue((<any>this.lesson)[formControlName]);
    }
  }
  GoToTranslatedLesson()
  {
    this.store.select(selectLessonBySlug(this.lesson.otherSlug!)).subscribe(lesson =>
    {
      if (lesson)
      {
        this.router.navigate(['', DashboardRoutes.Home, DashboardRoutes.Courses.Home,
          DashboardRoutes.Courses.Lessons.Home, DashboardRoutes.Courses.Lessons.EditLesson],
          { queryParams: { id: lesson.id } });
      }
    });
  }
}
