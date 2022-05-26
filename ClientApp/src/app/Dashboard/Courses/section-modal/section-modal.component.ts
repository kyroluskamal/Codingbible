import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { BaseUrl, FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PostType, validators } from 'src/Helpers/constants';
import { DashboardRoutes } from 'src/Helpers/router-constants';
import { SelectedTextData } from 'src/Interfaces/interfaces';
import { Attachments, Section } from 'src/models.model';
import { TreeDataStructureService } from 'src/Services/tree-data-structure.service';
import { SelectAttachment } from 'src/State/Attachments/Attachments.actions';
import { AddSection } from 'src/State/SectionsState/sections.actions';
import { selectAllSections } from 'src/State/SectionsState/sections.reducer';

@Component({
  selector: 'section-modal',
  templateUrl: './section-modal.component.html',
  styleUrls: ['./section-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  selectedText: SelectedTextData = {
    Range: new Range(),
    text: "",
    start: -1,
    end: -1,
    anchorNode: null,
    focusNode: null,
  };
  sectionssForSelectmenu: Section[] = [];
  @Input() ActionType: string = "";
  @Input() UpdateObject: Section = new Section();
  @Input() ModalId: string = "SectionModal";
  @Input() CourseId: number = 0;
  @ViewChild("SectionModal") modal!: BootstrapMoalComponent;
  constructor(private fb: FormBuilder, private store: Store,
    private TreeStructure: TreeDataStructureService<Section>,
    private clientSideSevrice: ClientSideValidationService,)
  {
    if (this.ActionType == PostType.Edit)
    {
      let parent = this.sectionssForSelectmenu.filter(cat => cat.id == this.SectionForm.get("id")?.value)[0];
      this.OldLevel = parent?.level;
    }
  }
  ngOnChanges(changes: SimpleChanges): void
  {
    if ("UpdateObject" in changes)
    {
      console.log(this.UpdateObject);
      this.SectionForm.patchValue(this.UpdateObject);
      this.SectionForm.get(FormControlNames.SectionForm.parentKey)?.setValue(this.UpdateObject.parent?.id);
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
      [FormControlNames.SectionForm.introductoryVideoUrl]: ['', [validators.YoububeVideo]],
      [FormControlNames.SectionForm.whatWillYouLearn]: [""],
      [FormControlNames.SectionForm.isLeafSection]: [false],
    });
    this.AllSections$.subscribe(sections =>
    {
      this.TreeStructure.setData(sections);
      this.sectionssForSelectmenu = this.TreeStructure.finalFlatenArray();
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
    console.log(attachment);
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
    let parent = this.sectionssForSelectmenu.filter(cat => cat.id == section.parentKey)[0];
    if (section.parentKey == null || section.parentKey == 0 || section.parent == null)
    {
      section.level = 0;
    } else
    {
      section.level = parent?.level + 1;
    }
    section.slug = section.title.split(" ").join("-");
    this.store.dispatch(AddSection(section));
  }
}
