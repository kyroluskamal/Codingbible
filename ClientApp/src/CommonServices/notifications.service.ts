import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SweetAlertData } from '../Interfaces/interfaces';
import Swal from 'sweetalert2';
import { css } from 'src/Helpers/constants';
@Injectable({
  providedIn: 'root'
})
export class NotificationsService
{

  constructor(public SnackBar: MatSnackBar)
  {

  }

  error(message: string)
  {
    this.SnackBar.open(message, "✖", {
      duration: 5000,
      direction: "ltr",
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: "Error-Notification",
      data: { message }
    });
  }

  success(message: string)
  {
    this.SnackBar.open(message, "✖", {
      duration: 5000,
      direction: 'ltr',
      horizontalPosition: "right",
      verticalPosition: "bottom",
      panelClass: "Success-Notification",
      data: { message }
    });
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
  Success_Swal(message: string)
  {
    return Swal.fire({
      icon: "success",
      html: message,
      color: "black",
      showCancelButton: false,
      showConfirmButton: false,
      allowEnterKey: true,
      allowEscapeKey: true,
      allowOutsideClick: true,
      scrollbarPadding: false,
      timer: 3500,
      customClass: { htmlContainer: css.SwalHtmlContent },
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
      showLoaderOnConfirm: SwalConfig.OtherOptions.showLoaderOnConfirm,
      showLoaderOnDeny: SwalConfig.OtherOptions.showLoaderOnDeny,
      timer: SwalConfig.OtherOptions.timer,
      // customClass: { container: SwalConfig.direction, title: SwalConfig.OtherOptions.customClass?.title }
    });
  }
}
