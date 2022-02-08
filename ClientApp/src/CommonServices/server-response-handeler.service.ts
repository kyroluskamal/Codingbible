import { Injectable } from '@angular/core';
import { MaxMinLengthValidation } from '../Interfaces/interfaces';
import { NotificationsService } from './notifications.service';
import * as Constants from '../Helpers/constants';
@Injectable({
  providedIn: 'root'
})
export class ServerResponseHandelerService
{
  Constants = Constants;
  constructor(
    private NotificationService: NotificationsService) { }

  DatatAddition_Success()
  {
    this.NotificationService.success(this.Constants.NotificationMessage.Success.DataAddtionStatus_Success);
  }
  DatatAddition_Success_Swal()
  {
    this.NotificationService.Success_Swal(this.Constants.NotificationMessage.Success.DataAddtionStatus_Success);
  }
  Data_Updaed_Success()
  {
    this.NotificationService.success(this.Constants.NotificationMessage.Success.Data_SAVED_success);
  }
  Data_Updaed_Success_Swal()
  {
    this.NotificationService.Success_Swal(this.Constants.NotificationMessage.Success.Data_SAVED_success);
  }
  GeneralSuccessResponse(SuncessResponse: any)
  {
    this.NotificationService.success(SuncessResponse.status);
  }
  GeneralSuccessResponse_Swal(SuncessResponse: any)
  {
    this.NotificationService.Success_Swal(SuncessResponse.status);
  }

  // GetErrorNotification(e: any, MaxMinLenth: MaxMinLengthValidation[] = [])
  // {
  //   let translatedError: string = "";
  //   if (Array.isArray(e))
  //   {
  //     if (typeof (e[0].status) === "string")
  //       translatedError += `${this.translate.GetTranslation(e[0].status)} `;
  //     if (e[0].errors)
  //     {
  //       let keys = Object.keys(e[0].errors);
  //       for (let k of keys)
  //       {
  //         for (let err of e[0].errors[k])
  //         {
  //           if (err === this.Constants.MaxLengthExceeded_ERROR)
  //           {
  //             let maxLength = MaxMinLenth.filter((i) => { return i.prop.toLowerCase() === k.toLowerCase(); });
  //             translatedError += `( ${this.translate.GetTranslation(k.toLowerCase())} ) ${this.translate.GetTranslation(err)} ${maxLength[0].maxLength}
  //             ${this.translate.GetTranslation(this.Constants.characters)} `;
  //           } else
  //             translatedError += `( ${this.translate.GetTranslation(k.toLowerCase())} ) ${this.translate.GetTranslation(err)} `;
  //         }
  //       }
  //     }
  //   } else if (e.error.status)
  //     translatedError += `${this.translate.GetTranslation(e.error.status)} `;

  //   else if (e.status === 401 && e.error === null)
  //   {
  //     translatedError += `${this.translate.GetTranslation(this.Constants.Unauthorized_Error)} `;
  //   }
  //   this.NotificationService.error(translatedError, '',
  //     this.translate.isRightToLeft(this.translate.GetCurrentLang()) ? 'rtl' : 'ltr');
  // }
  // GetErrorNotification_swal(e: any, MaxMinLenth: MaxMinLengthValidation[] = [])
  // {
  //   let translatedError: string = "";
  //   if (Array.isArray(e))
  //   {
  //     if (typeof (e[0].status) === "string")
  //       translatedError += `${this.translate.GetTranslation(e[0].status.toLowerCase())}<br>`;
  //     if (e[0].errors)
  //     {
  //       let keys = Object.keys(e[0].errors);
  //       for (let k of keys)
  //       {
  //         for (let err of e[0].errors[k])
  //         {
  //           if (err === this.Constants.MaxLengthExceeded_ERROR)
  //           {
  //             let maxLength = MaxMinLenth.filter((i) => { return i.prop.toLowerCase() === k.toLowerCase(); });
  //             translatedError += `<strong>( ${this.translate.GetTranslation(k.toLowerCase())} )</strong> ${this.translate.GetTranslation(err.toLowerCase())} <strong>${maxLength[0].maxLength}</strong>
  //             ${this.translate.GetTranslation(this.Constants.characters)}<br>`;
  //           } else if (err === this.Constants.Unique_Field_ERROR)
  //           {
  //             translatedError += `<strong>( ${this.translate.GetTranslation(k.toLowerCase())} )</strong> ${this.translate.GetTranslation(err.toLowerCase())}<br>`;
  //           }
  //           else
  //             translatedError += `<strong>( ${this.translate.GetTranslation(k.toLowerCase())} )</strong> ${this.translate.GetTranslation(err.toLowerCase())}<br>`;
  //         }
  //       }
  //     }
  //   } else if (e.error.status)
  //     translatedError += `${this.translate.GetTranslation(e.error.status.toLowerCase())}<br>`;

  //   else if (e.status === 401 && e.error === null)
  //   {
  //     translatedError += `${this.translate.GetTranslation(this.Constants.Unauthorized_Error)}<br>`;
  //   }

  //   this.NotificationService.Error_Swal(`${this.translate.GetTranslation(this.Constants.error)} :`,
  //     this.translate.GetTranslation(this.Constants.OK), translatedError,
  //     this.translate.isRightToLeft(this.translate.GetCurrentLang()) ? 'rtl' : 'ltr');
  // }
}
