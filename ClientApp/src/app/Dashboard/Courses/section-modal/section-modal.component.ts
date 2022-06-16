import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Input, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { NotificationsService } from 'src/CommonServices/notifications.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { ArabicRegex, BaseUrl, FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PostStatus, PostType, sweetAlert, validators } from 'src/Helpers/constants';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { Attachments, Course, Section } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { SelectAttachment } from 'src/State/Attachments/Attachments.actions';
import { AddSection, UpdateSection } from 'src/State/SectionsState/sections.actions';
import { selectAllSections } from 'src/State/SectionsState/sections.reducer';

@Component({
  selector: 'section-modal',
  templateUrl: './section-modal.component.html',
  styleUrls: ['./section-modal.component.css'],
})
export class SectionModalComponent implements OnInit, OnChanges
{
  FormControlNames = FormControlNames;
  errorState = new BootstrapErrorStateMatcher();
  InputFieldTypes = InputFieldTypes;
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  FormFieldsNames = FormFieldsNames;
  resetSelectedRow: boolean = false;
  isLoading = true;
  PostType = PostType;
  DashboardRoutes = DashboardRoutes;
  Action: string = "";
  CourseVedioID = "";
  SectionForm: FormGroup = new FormGroup({});
  BaseUrl = BaseUrl;
  SectionPostType: string = "Add";
  FeatureImageUrl: string = "";
  AllSections$ = this.store.select(selectAllSections);
  OldLevel: number = 0;
  VedioID = "";
  sectionsForSelectmenu: Section[] = [];
  selectedTranslation: Section[] = [];
  AllSections: Section[] = [];
  @Input() ActionType: string = "";
  @Input() UpdateObject: Section = new Section();
  @Input() ModalId: string = "SectionModal";
  @Input() CourseId: number = 0;
  @Input() course: Course | null = null;
  @Input() AddionIsDone: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() UpdateIsDone: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild("SectionModal") modal!: BootstrapMoalComponent;
  constructor(private fb: FormBuilder, private store: Store,
    private TreeStructure: TreeDataStructureService<Section>,
    private Notifications: NotificationsService,
    private clientSideSevrice: ClientSideValidationService,)
  {
    if (this.ActionType == PostType.Edit)
    {
      let parent = this.sectionsForSelectmenu.filter(cat => cat.id == this.SectionForm.get("id")?.value)[0];
      this.OldLevel = parent?.level;
    } else
    {
      this.SectionForm.reset();
    }
  }
  ngOnChanges(changes: SimpleChanges): void
  {
    if ("UpdateObject" in changes)
    {
      this.SectionForm.patchValue(this.UpdateObject);
      this.GetVideo(this.UpdateObject.introductoryVideoUrl);
      this.SectionForm.get(FormControlNames.SectionForm.parentKey)?.setValue(Number(this.UpdateObject.parentKey));
      this.SectionForm.get(FormControlNames.SectionForm.featureImageUrl)?.setValue(Number(this.UpdateObject.featureImageUrl));
      this.FeatureImageUrl = this.UpdateObject.featureImageUrl;
    }
    if ("ActionType" in changes)
    {
      if (this.ActionType == PostType.Add)
      {
        this.SectionForm.reset();
        this.FeatureImageUrl = "";
        this.VedioID = "";
        this.SectionForm.get(FormControlNames.SectionForm.parentKey)?.setValue(0);
        this.SectionForm.get(FormControlNames.SectionForm.isArabic)?.setValue(false);
      }
    }
  }

  ngOnInit(): void
  {
    this.SectionForm = this.fb.group({
      id: [0],
      [FormControlNames.SectionForm.name]: [null, [validators.required]],
      [FormControlNames.SectionForm.title]: [null, [validators.required, validators.SEO_TITLE_MIN_LENGTH, validators.SEO_TITLE_MAX_LENGTH]],
      [FormControlNames.SectionForm.description]: ['', [validators.required, validators.SEO_DESCRIPTION_MIN_LENGTH, validators.SEO_DESCRIPTION_MAX_LENGTH]],
      [FormControlNames.SectionForm.parentKey]: [0, [validators.required]],
      [FormControlNames.SectionForm.featureImageUrl]: ['', [validators.required]],
      [FormControlNames.SectionForm.introductoryVideoUrl]: ['', [validators.YoutubeVideo]],
      [FormControlNames.SectionForm.whatWillYouLearn]: [""],
      [FormControlNames.SectionForm.isLeafSection]: [false],
      [FormControlNames.SectionForm.isArabic]: [{ value: false, disabled: true }],
      [FormControlNames.SectionForm.otherSlug]: [null, [validators.required]],
    });
    this.AllSections$.subscribe(sections =>
    {
      this.AllSections = sections;
      this.TreeStructure.setData(sections.filter(x => x.isArabic
        === Boolean(this.SectionForm.get(FormControlNames.SectionForm.isArabic)?.value)));
      this.sectionsForSelectmenu = this.TreeStructure.finalFlatenArray();
      if (this.ActionType == PostType.Add)
      {
        this.SectionForm.reset();
        this.FeatureImageUrl = "";
        this.VedioID = "";
        this.SectionForm.get(FormControlNames.SectionForm.parentKey)?.setValue(0);
      }
    });
  }
  Toggle()
  {
    this.modal.Toggle();
  }
  onChange(event: HTMLSelectElement)
  {
    this.SectionForm.get(FormControlNames.SectionForm.parentKey)?.setValue(Number(event.value));
  }

  SetFeatureImage(attachment: Attachments | null)
  {
    this.FeatureImageUrl = attachment?.fileUrl!;
    this.SectionForm.get(FormControlNames.SectionForm.featureImageUrl)?.setValue(attachment?.fileUrl);
  }

  removeFeatureImage()
  {
    this.store.dispatch(SelectAttachment({ selectedFile: null }));
    this.FeatureImageUrl = "";
    this.SectionForm.get(FormControlNames.SectionForm.featureImageUrl)?.setValue("");
  }
  GetVideo(VideoUrl: string)
  {
    this.SectionForm.get(FormControlNames.SectionForm.introductoryVideoUrl)?.setValue(VideoUrl);
    this.VedioID = this.clientSideSevrice.GetVideo(VideoUrl);
  }
  AddNewSection()
  {
    let section = new Section();
    this.clientSideSevrice.FillObjectFromForm(section, this.SectionForm);
    section.courseId = this.CourseId;
    if (section.parentKey === 0)
      section.parentKey = null;
    let parent = this.sectionsForSelectmenu.filter(cat => cat.id == section.parentKey)[0];
    if (section.parentKey == null || section.parentKey == 0)
    {
      section.level = 0;
    } else
    {
      section.level = parent?.level + 1;
    }
    section.slug = this.clientSideSevrice.GenerateSlug(section.title);
    let sbllings = this.sectionsForSelectmenu.filter(cat => cat.parentKey == section.parentKey);
    if (sbllings.length > 0)
    {
      section.order = sbllings[sbllings.length - 1].order + 1;
    }
    else
    {
      section.order = 1;
    }
    if (this.SectionForm.get(FormControlNames.courseForm.otherSlug)?.value == "0")
    {
      section.otherSlug = null;
    }
    this.store.dispatch(AddSection(section));
    this.SectionForm.reset();
  }
  Update()
  {
    this.SectionForm.markAllAsTouched();
    let newSection = new Section();
    this.clientSideSevrice.FillObjectFromForm(newSection, this.SectionForm);
    newSection.courseId = this.CourseId;
    if (newSection.parentKey === 0)
    {
      newSection.parentKey = null;
    }
    let parent = this.sectionsForSelectmenu.filter(sec => sec.id == newSection.parentKey)[0];

    if (newSection.parentKey === 0 || parent == null)
    {
      newSection.level = 0;
    } else
    {
      newSection.level = parent?.level! + 1;
    }
    newSection.slug = this.clientSideSevrice.GenerateSlug(newSection.title);
    if (this.SectionForm.get(FormControlNames.courseForm.otherSlug)?.value == "0")
    {
      newSection.otherSlug = null;
    }
    this.store.dispatch(UpdateSection(newSection));
  }
  SelectTranslation()
  {
    let treeService = new TreeDataStructureService<Section>();
    treeService.setData(this.AllSections.filter(x => x.isArabic
      !== Boolean(this.SectionForm.get(FormControlNames.SectionForm.isArabic)?.value)));
    this.selectedTranslation = treeService.finalFlatenArray();
  }
  setIsArabic()
  {
    let isArabic = ArabicRegex.test(this.SectionForm.get(FormControlNames.SectionForm.title)?.value)
      || ArabicRegex.test(this.SectionForm.get(FormControlNames.SectionForm.name)?.value);
    if (!this.course)
    {
      this.SectionForm.get(FormControlNames.SectionForm.isArabic)?.setValue(isArabic);
    } else
    {
      this.SectionForm.get(FormControlNames.SectionForm.isArabic)?.setValue(this.course.isArabic);
      if (!isArabic && this.course.isArabic)
      {
        this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK,
          `<h4>You are <span class='text-danger'>adding section in an English course</span> in an Arabic course. You have to add <span class="text-success">the section in English language</span></h4>`);
        this.SectionForm.get(FormControlNames.SectionForm.name)?.setValue(null);
        this.SectionForm.get(FormControlNames.SectionForm.title)?.setValue(null);
        return;
      } else if (isArabic && !this.course.isArabic)
      {
        this.Notifications.Error_Swal(sweetAlert.Title.Error, sweetAlert.ButtonText.OK,
          "<h4>You are <span class='text-danger'>adding section in an English course</span>. You have to <span class='text-success'>add the section in Arabic language</span></h4>");
        this.SectionForm.get(FormControlNames.SectionForm.name)?.setValue(null);
        this.SectionForm.get(FormControlNames.SectionForm.title)?.setValue(null);
        return;
      }
    }
    this.SelectTranslation();
  }
}
