import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { BaseUrl, FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PostStatus, PostType, sweetAlert, validators } from 'src/Helpers/constants';
import { CustomErrorStateMatcher } from 'src/Helpers/custom-error-state-matcher';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { SelectedTextData } from 'src/Interfaces/interfaces';
import { Attachments, Lesson, LessonAttachments, Section } from 'src/models.model';
import { LessonsService } from 'src/Services/lessons.service';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { SelectAttachment } from 'src/State/Attachments/Attachments.actions';
import { LoadCourses } from 'src/State/CourseState/course.actions';
import { selectAllCourses } from 'src/State/CourseState/course.reducer';
import { selectPinned } from 'src/State/DesignState/design.reducer';
import { ChangeStatus, GetLessonById, RemoveLesson, SetValidationErrors, UpdateLesson } from 'src/State/LessonsState/Lessons.actions';
import { selectAllLessons, selectLessonsByID, select_Lessons_ValidationErrors } from 'src/State/LessonsState/Lessons.reducer';
import { GetSectionsByCourseId, LoadSections } from 'src/State/SectionsState/sections.actions';
import { selectAllSections } from 'src/State/SectionsState/sections.reducer';

@Component({
  selector: 'app-lesson-handler',
  templateUrl: './lesson-handler.component.html',
  styleUrls: ['./lesson-handler.component.css']
})
export class LessonHandlerComponent implements OnInit
{
  ValidationErrors$ = this.store.select(select_Lessons_ValidationErrors);
  PostType = PostType;
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
  @ViewChild("view", { read: ElementRef }) view: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  @ViewChild("StickyNotesHandler", { read: ElementRef }) StickyNotesHandler: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  @ViewChild("StickyNotesContainer", { read: ElementRef }) StickyNotesContainer: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  @ViewChild("StickyNotes", { read: ElementRef }) StickyNotes: ElementRef<HTMLDivElement> = {} as ElementRef<HTMLDivElement>;
  @ViewChild("html", { read: ElementRef }) html: ElementRef<HTMLTextAreaElement> = {} as ElementRef<HTMLTextAreaElement>;
  @ViewChild("slug", { read: ElementRef }) slug: ElementRef<HTMLInputElement> = {} as ElementRef<HTMLInputElement>;
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

  /**********************************************************************************************************
   *                                                Constructor
   ************************************************************************************/
  constructor(public store: Store, private LessonService: LessonsService,
    @Inject(DOCUMENT) private document: Document, private title: Title,
    private fb: FormBuilder, private RouterOutlet: Router,
    private Notifications: NotificationsService,
    private treeDataStructure: TreeDataStructureService<Section>,
    public ClientSideService: ClientSideValidationService, public router: ActivatedRoute)
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
    if (this.RouterOutlet.url.includes(DashboardRoutes.Courses.Lessons.AddLesson))
    {
      this.ActionType = PostType.Add;
    }
    if (this.RouterOutlet.url.includes(DashboardRoutes.Courses.Lessons.EditLesson))
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
      [FormControlNames.LessonForm.slug]: [null],
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

    this.router.queryParams.subscribe(x =>
    {
      if (this.RouterOutlet.url.includes(DashboardRoutes.Courses.Lessons.EditLesson) && !x['id'])
      {
        this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK, "<h4>Invalid url parameters</h4>");
        this.RouterOutlet.navigate(['', DashboardRoutes.Home, DashboardRoutes.Courses.Home, DashboardRoutes.Courses.Lessons.Home]);
        return;
      }
      if (x['id'])
      {
        this.store.dispatch(GetLessonById({ id: Number(x['id']) }));
        this.LessonById = this.store.select(selectLessonsByID(Number(x['id'])));
      }
    });
    if (this.ActionType === this.PostType.Edit)
    {
      this.LessonById.subscribe(r =>
      {
        if (r)
        {
          let lesson = r as Lesson;
          this.SelectedCourseId = lesson.courseId;
          this.SelectedSectionId = lesson.sectionId;
          this.lesson = Object.assign({}, r);
          this.inputForm.patchValue(this.lesson);
          this.title.setTitle(`Edit lesson - ${this.lesson.title}`);
          this.lesson.featureImageUrl = this.lesson.featureImageUrl.includes("http") ? this.lesson.featureImageUrl : `${this.BaseUrl}${this.lesson.featureImageUrl}`;
          for (let i = 0; i < lesson?.attachments.length!; i++)
          {
            this.lessonsAttachments.push(lesson?.attachments[i]?.attachmentId!);
          }
        }
        this.inputForm.markAllAsTouched();
      });
    }
    if (this.ActionType === PostType.Add)
      this.title.setTitle("Add new lesson");
  }
  UpdateView(html: HTMLTextAreaElement, view: HTMLDivElement)
  {
    view.innerHTML = html.value;
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
    this.inputForm.get('slug')?.setValue(this.lesson.slug);
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
    this.lesson.title = String(this.inputForm.get(FormControlNames.LessonForm.title)?.value);
    this.lesson.description = String(this.inputForm.get(FormControlNames.LessonForm.description)?.value);
    this.lesson.htmlContent = this.view.nativeElement.innerHTML;
    this.lesson.slug = String(this.slug.nativeElement.value);
    this.lesson.tempAttach = this.lessonsAttachments;

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
    this.inputForm.get(FormControlNames.LessonForm.htmlContent)?.setValue(view.innerHTML);
    this.ClientSideService.FillObjectFromForm(this.lesson, this.inputForm);
    this.lesson.slug = this.ClientSideService.GenerateSlug(this.lesson.title);
    this.lesson.tempAttach = this.lessonsAttachments;
    if (draftOrPublish === "Draft")
    {
      this.lesson.status = PostStatus.Draft;
    }
    else
    {
      this.lesson.status = PostStatus.Published;
    }
    console.log(this.lesson);
  }
  CheckIfSulgNotUnique(title: string)
  {
    let slug = this.ClientSideService.GenerateSlug(title);
    if (this.ActionType === PostType.Add)
    {
      this.isSlugUnique(slug);
    } else if (this.ActionType === PostType.Edit && this.ClientSideService.isUpdated(this.lesson, this.inputForm))
    {
      this.isSlugUnique(slug);
    }
  }
  DeleteClicked()
  {
    this.store.dispatch(RemoveLesson({ id: this.lesson?.id!, url: DashboardRoutes.Courses.Lessons.EditLesson }));
  }
  isSlugUnique(slug: string)
  {
    if (this.lessons.length > 0)
    {
      if (this.ClientSideService.isNotUnique(this.lessons, 'slug', slug))
        this.inputForm.get('slug')?.setErrors({ notUnique: true });
      else
        this.inputForm.get('slug')?.clearValidators();
    } else
      this.LessonService.IsLessonSlug_NOT_Unique(slug).subscribe(
        r =>
        {
          if (r)
            this.inputForm.get('slug')?.setErrors({ notUnique: true });
          else
            this.inputForm.get('slug')?.clearValidators();
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
    }
  }
  onSectionChange(SectionId: string)
  {
    let sectionId = Number(SectionId);
    if (sectionId > 0)
    {
      this.lesson.sectionId = sectionId;
      let temp = this.AllSections.filter(Section => Section.courseId == this.SelectedCourseId);
      this.treeDataStructure.setData(temp);
      this.SectionsOfSelectedCourse = this.treeDataStructure.finalFlatenArray();
      this.SectionToAddOrUpdate = this.SectionsOfSelectedCourse.filter(s => s.id === sectionId)[0];
    }
  }
}
