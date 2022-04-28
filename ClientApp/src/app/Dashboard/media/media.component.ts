import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { ClientSideValidationService } from 'src/CommonServices/client-side-validation.service';
import { SpinnerService } from 'src/CommonServices/spinner.service';
import { BootstrapErrorStateMatcher } from 'src/Helpers/bootstrap-error-state-matcher';
import { FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, validators } from 'src/Helpers/constants';
import { Attachments } from 'src/models.model';
import { MediaService } from 'src/Services/media.service';
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
  attachments: Attachments[] = [];
  attachments$ = this.store.select(selectAllAttachment);
  selectedFile$ = this.store.select(SelectSelected_Attachment);

  @Input() setFeatureImageButton: boolean = false;
  @Output() setFeatureImage: EventEmitter<Attachments | null> = new EventEmitter();
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
      title: ['', [validators.required, validators.SEO_TITLE_MAX_LENGTH, validators.SEO_TITLE_MIN_LENGTH]],
      description: ['', [validators.required, validators.SEO_DESCRIPTION_MAX_LENGTH, validators.SEO_DESCRIPTION_MIN_LENGTH]],
      caption: [''],
      alttext: ['', [validators.required]],
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
    console.log(this.selectedFile);
    this.store.dispatch(Add_ATTACHMENT_Success({ attachments: this.attachments }));
    this.store.dispatch(Add_ATTACHMENT({
      files: files, tempAttachments: this.attachments
    }));
    // this.mediaService.SendImages(files)
    //   .subscribe(res =>
    //   {
    //     for (let i = 0; i < res.length; i++)
    //     {

    //       let index = this.attachments.findIndex(att => att.fileName === res[i].fileName);
    //       this.attachments[index] = res[i];
    //       this.attachments = [...this.attachments];
    //       if (res[i].fileName === this.selectedFile?.fileName)
    //       {
    //         this.selectedFile = res[i];
    //       }
    //     }
    //   });
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
    // this.Spinner.InsideContainerSpinner();
    // this.mediaService.Delete(id).subscribe(res =>
    // {
    //   let index = this.attachments.findIndex(att => att.id === id);
    //   this.attachments.splice(index, 1);
    //   this.attachments = [...this.attachments];
    //   this.selectedFile = null;
    //   this.Spinner.removeSpinner();
    // });
  }
  UpdateAttachment()
  {
    console.log(this.form.get("caption")?.value);
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
  //helper methods
  getRandomInt(min: number, max: number): number
  {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
