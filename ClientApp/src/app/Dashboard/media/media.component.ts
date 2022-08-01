import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { BaseUrl, FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, validators } from 'src/Helpers/constants';
import { Attachments } from 'src/models.model';
import { Add_ATTACHMENT, Add_ATTACHMENT_Success, LoadATTACHMENTSs, RemoveATTACHMENTS, SelectAttachment, UpdateATTACHMENTS } from 'src/State/Attachments/Attachments.actions';
import { selectAllAttachment, SelectSelected_Attachment } from 'src/State/Attachments/Attachments.reducer';

export interface IFileMetaData
{
  file: File;
  details: Attachments;
}

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css'],
})
export class MediaComponent implements OnInit 
{
  @ViewChild("mediaModal") modal!: BootstrapMoalComponent;
  errorState = new BootstrapErrorStateMatcher();
  FormValidationErrors = FormValidationErrors;
  FormValidationErrorsNames = FormValidationErrorsNames;
  selectedFile: Attachments | null = null;
  form: FormGroup = new FormGroup({});
  FormControlNames = FormControlNames;
  FormFieldsNames = FormFieldsNames;
  BaseUrl = BaseUrl;
  attachments: Attachments[] = [];
  attachments$ = this.store.select(selectAllAttachment);
  selectedFile$ = this.store.select(SelectSelected_Attachment);
  @Input() IsStaticBackdrop: boolean = false;
  @Input() FalseKeyboard: boolean = true;
  @Input() setFeatureImageButton: boolean = false;
  @Input() ModalId: string = "Model";
  @Input() data_bs_target_for_Previous_modal: string = "none";
  @Output() setFeatureImage: EventEmitter<Attachments | null> = new EventEmitter();
  @Output() selectImage: EventEmitter<Attachments | null> = new EventEmitter();
  constructor(private ClientService: ClientSideValidationService,
    @Inject(DOCUMENT) private document: Document, private store: Store,
    private fb: FormBuilder)
  {
  }
  ngOnInit(): void
  {
    this.selectedFile$.subscribe(file =>
    {
      this.selectedFile = file;
      if (file != null)
        this.ClientService.refillForm(file, this.form);
    });
    this.store.dispatch(LoadATTACHMENTSs());
    this.form = this.fb.group({
      [FormControlNames.mediaForm.title]: ['', [validators.required, validators.SEO_TITLE_MAX_LENGTH, validators.SEO_TITLE_MIN_LENGTH]],
      [FormControlNames.mediaForm.description]: ['', [validators.required, validators.SEO_DESCRIPTION_MAX_LENGTH, validators.SEO_DESCRIPTION_MIN_LENGTH]],
      [FormControlNames.mediaForm.caption]: [''],
      [FormControlNames.mediaForm.altText]: ['', [validators.required]],
    });
  }
  Toggle()
  {
    this.modal.Toggle();
  }

  uploadImage(event: any)
  {
    this.attachments = [];
    let files: File[] = [];
    for (let f of event.target.files)
    {
      let file: File = f;
      if (file.name.indexOf(" ") > -1)
      {
        let fileName = file.name.split(" ").join("-");
        let newFile = new File([file], fileName, { type: file.type });
        file = newFile;
      }
      files.push(file);
      let att = new Attachments();
      att.id = this.getRandomInt(10000, 99999);
      att.fileName = file.name;
      att.fileType = file.type;
      att.fileSize = file.size;

      this.attachments.unshift(att);
    }
    this.store.dispatch(Add_ATTACHMENT_Success({ attachments: this.attachments }));
    this.store.dispatch(Add_ATTACHMENT({
      files: files, tempAttachments: this.attachments
    }));
  }
  SelectFile(file: Attachments)
  {
    this.store.dispatch(SelectAttachment({ selectedFile: file }));
  }
  openBrowseFiles()
  {
    this.document.getElementById("AddButton")?.click();
  }
  DeleteAttachment()
  {
    this.store.dispatch(RemoveATTACHMENTS({ id: this.selectedFile?.id! }));
  }
  UpdateAttachment()
  {
    let temp: Attachments = new Attachments();
    temp = { ...this.selectedFile! };
    temp.caption = "";
    this.ClientService.FillObjectFromForm(temp, this.form);
    this.store.dispatch(UpdateATTACHMENTS(temp));
  }

  featureImageClicked()
  {
    this.setFeatureImage.emit(this.selectedFile);
  }
  InsertImageIntoPost()
  {
    this.selectImage.emit(this.selectedFile);
  }
  //helper methods
  getRandomInt(min: number, max: number): number
  {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
