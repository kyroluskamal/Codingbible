import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ElementRef, ViewChild, Inject, Input } from '@angular/core';

@Component({
  selector: 'bootstrap-modal',
  templateUrl: './bootstrap-modal.component.html',
  styleUrls: ['./bootstrap-modal.component.css'],
})
export class BootstrapMoalComponent implements OnInit
{
  @Input() FullScreeen: boolean = false;
  @Input() FullScreenClass: string = "";
  @Input() VerticallyCentered: boolean = false;
  @Input() Modal_Header_AdditionalClasses: string = "";
  @Input() Modal_Content_AdditionalClasses: string = "";
  @Input() Modal_Header_Template!: TemplateRef<any>;
  @Input() Modal_Header_Text: string = "";
  @Input() Modal_Body_template!: TemplateRef<any>;
  @Input() Modal_Footer_template!: TemplateRef<any>;
  @Input() Modal_Body_Additionalclasses: string = "";
  @Input() Modal_Footer_Additionalclasses: string = "";
  Body_template!: TemplateRef<any>;
  DialogClass = 'modal-dialog';
  HeaderCLass = "modal-header";
  ContentClass = "modal-content";
  Body_Additional_Classes: string = "modal-body";
  Header_text: string = "";
  Header_TemplateRef!: TemplateRef<any>;
  Footer_TemplateRef!: TemplateRef<any>;
  Footer_Additional_Classes: string = "modal-footer";
  constructor(@Inject(DOCUMENT) private document: Document) { }


  @ViewChild("ModalButtton") ModalButtton!: ElementRef<HTMLButtonElement>;
  @ViewChild("Modal") Modal!: ElementRef<HTMLDivElement>;

  ngOnInit(): void
  {
    this.Header_text = this.Modal_Header_Text;
    if (this.FullScreeen && this.FullScreenClass !== "")
      this.DialogClass += " " + this.FullScreenClass;
    if (this.VerticallyCentered)
      this.DialogClass += " modal-dialog-centered";
    if (this.Modal_Header_AdditionalClasses !== "")
      this.HeaderCLass += " " + this.Modal_Header_AdditionalClasses;
    if (this.Modal_Content_AdditionalClasses !== "")
      this.ContentClass += " " + this.Modal_Content_AdditionalClasses;

    if (this.Modal_Body_Additionalclasses !== "")
      this.Body_Additional_Classes += " " + this.Modal_Body_Additionalclasses;
    if (this.Modal_Footer_Additionalclasses !== "")
      this.Footer_Additional_Classes += " " + this.Modal_Footer_Additionalclasses;
    this.Footer_TemplateRef = this.Modal_Footer_template;
    this.Body_template = this.Modal_Body_template;
    this.Header_TemplateRef = this.Modal_Header_Template;
  }

  Toggle()
  {
    this.ModalButtton.nativeElement.click();
    this.document.body.appendChild(this.Modal.nativeElement);
  }
}
