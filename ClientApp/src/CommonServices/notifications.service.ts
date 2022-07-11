import { Inject, Injectable } from '@angular/core';
import { SweetAlertData } from '../Interfaces/interfaces';
import Swal from 'sweetalert2';
import { css, sweetAlert } from 'src/Helpers/constants';
import { DOCUMENT } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService
{
  swet = sweetAlert;
  constructor(@Inject(DOCUMENT) private document: Document)
  {

  }

  Error_Swal(title: string, confirmText: string, message: string)
  {
    return Swal.fire({
      title: title,
      icon: "error",
      html: message,
      color: "black",
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: confirmText,
      allowEnterKey: true,
      allowEscapeKey: true,
      allowOutsideClick: true,
      customClass: { title: css.SwalErrorTitle },
    });
  }
  Success_Swal(message: string, closeModal: boolean = true)
  {
    if (this.document.getElementById("ModalCloseButton") && closeModal)
      this.document.getElementById("ModalCloseButton")?.click();
    return Swal.fire({
      icon: "success",
      html: message,
      color: "black",
      showCancelButton: false,
      showConfirmButton: false,
      allowEnterKey: true,
      allowEscapeKey: true,
      allowOutsideClick: true,
      backdrop: true,
      scrollbarPadding: false,
      timer: 3500,
      keydownListenerCapture: true,
      customClass: { htmlContainer: css.SwalHtmlContent },
    });
  }
  Confirm_Swal()
  {
    return Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
      cancelButtonText: "No!",
      confirmButtonAriaLabel: "Yes!",
      cancelButtonAriaLabel: "No!",
      allowEnterKey: false,
      allowEscapeKey: true,
      allowOutsideClick: true,
      focusConfirm: true,
      customClass: { title: css.SwalWarningTitle },

    });
  }
  Custom_Swal(title: string, SwalConfig: SweetAlertData)
  {
    return Swal.fire({
      title: title,
      icon: SwalConfig.OtherOptions.icon,
      iconColor: SwalConfig.OtherOptions.iconColor,
      iconHtml: SwalConfig.OtherOptions.iconHtml,
      text: SwalConfig.OtherOptions.text,
      html: SwalConfig.OtherOptions.html,
      color: "black",
      showCancelButton: SwalConfig.OtherOptions.showCancelButton,
      cancelButtonColor: SwalConfig.OtherOptions.cancelButtonColor,
      cancelButtonText: SwalConfig.OtherOptions.cancelButtonText,
      showConfirmButton: SwalConfig.OtherOptions.showConfirmButton,
      confirmButtonText: SwalConfig.OtherOptions.confirmButtonText,
      allowEnterKey: SwalConfig.OtherOptions.allowEnterKey,
      allowEscapeKey: SwalConfig.OtherOptions.allowEscapeKey,
      allowOutsideClick: SwalConfig.OtherOptions.allowOutsideClick,
      backdrop: true,
      showLoaderOnConfirm: SwalConfig.OtherOptions.showLoaderOnConfirm,
      showLoaderOnDeny: SwalConfig.OtherOptions.showLoaderOnDeny,
      timer: SwalConfig.OtherOptions.timer,
      // customClass: { container: SwalConfig.direction, title: SwalConfig.OtherOptions.customClass?.title }
    });
  }
}
