import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, Inject, TemplateRef } from '@angular/core';
import { BootstrapMoalComponent } from 'src/app/CommonComponents/bootstrap-modal/bootstrap-modal.component';
import { MediaService } from 'src/Services/media.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css'],
})
export class MediaComponent implements OnInit 
{
  @ViewChild("modal") modal!: BootstrapMoalComponent;
  constructor(private mediaService: MediaService) { }
  ngOnInit(): void
  {

  }
  Toggle()
  {
    this.modal.Toggle();
  }

  uploadImage(event: any)
  {
    console.log(event.target.files);
    this.mediaService.SendImages(event.target.files).subscribe(res => console.log(res));
  }
}
