import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService
{

  constructor(private spinner: NgxSpinnerService) { }

  fullScreenSpinner()
  {
    return this.spinner.show('general', {
      fullScreen: true,
      type: "ball-scale-multiple",
      size: "large",
      bdColor: "rgba(0, 0, 0, 0.25)",
      color: "white",
      zIndex: 500000
    });
  }
  fullScreenSpinnerForForm()
  {
    return this.spinner.show('form', {
      fullScreen: true,
      type: "ball-scale-multiple",
      size: "large",
      bdColor: "rgba(0, 0, 0, 0.25)",
      color: "white",
      zIndex: 500000
    });
  }
  InsideContainerSpinner()
  {
    return this.spinner.show('inside', {
      fullScreen: false,
      type: "ball-scale-multiple",
      size: "medium",
      bdColor: "rgba(0, 0, 0, 1)",
      color: "white",
    });
  }
  removeSpinner()
  {
    this.spinner.hide('general');
    this.spinner.hide('inside');
    this.spinner.hide('form');
  }
}
