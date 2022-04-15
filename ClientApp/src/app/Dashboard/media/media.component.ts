import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { SpinnerService } from 'src/CommonServices/spinner.service';
import { FormControlNames, FormFieldsNames } from 'src/Helpers/constants';
import { Attachments } from 'src/models.model';
import { MediaService } from 'src/Services/media.service';
import { Add_ATTACHMENT, LoadATTACHMENTSs, RemoveATTACHMENTS, SelectAttachment } from 'src/State/Attachments/Attachments.actions';
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
  @ViewChild("modal") modal!: BootstrapMoalComponent;
  selectedFile: Attachments | null = null;
  form: FormGroup = new FormGroup({});
  FormControlNames = FormControlNames;
  FormFieldsNames = FormFieldsNames;
  attachments: Attachments[] = [];
  attachments$ = this.store.select(selectAllAttachment);
  selectedFile$ = this.store.select(SelectSelected_Attachment);
  constructor(private mediaService: MediaService, private Spinner: SpinnerService,
    @Inject(DOCUMENT) private document: Document, private store: Store,
    private fb: FormBuilder)
  {
  }
  ngOnInit(): void
  {
    this.selectedFile$.subscribe(file =>
    {
      this.selectedFile = file;
    });
    this.store.dispatch(LoadATTACHMENTSs());
    this.form = this.fb.group({
      title: [''],
      description: [''],
      caption: [''],
      alttext: [''],
    });
  }
  Toggle()
  {
    this.modal.Toggle();
  }

  uploadImage(event: any)
  {
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
      att.fileName = file.name;
      att.fileType = file.type;
      att.fileSize = file.size;

      this.attachments.unshift(att);
    }
    this.store.dispatch(Add_ATTACHMENT({ files: files }));
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
}
