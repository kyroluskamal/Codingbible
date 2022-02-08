import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CardTitle, KeyValueForUniqueCheck, SweetAlertData } from '../Interfaces/interfaces';
import { NotificationsService } from './notifications.service';
import * as Constants from '../Helpers/constants';
@Injectable({
  providedIn: 'root'
})
export class ClientSideValidationService
{
  Constants = Constants;
  constructor(private NotificationService: NotificationsService) { }

  refillForm(object: any, formGroup: FormGroup)
  {
    let keys = Object.keys(object);
    for (let k of keys)
    {
      if (formGroup.get(k))
        formGroup.get(k)?.setValue(object[k]);
    }
  }
  isUnique(array: any[], keyToCheck: string, value: string, id?: number)
  {
    if (!id)
    {
      for (let el of array)
      {
        if (el[keyToCheck])
          if (el[keyToCheck] === value)
          {
            return false;
          }
      }
    } else
    {
      for (let el of array)
      {
        if (el[keyToCheck] && el['id'] !== id)
          if (el[keyToCheck] === value)
          {
            return false;
          }
      }
    }
    return true;
  }

  isUniqueMany(array: any[], keyValue: KeyValueForUniqueCheck[], id?: number)
  {
    let translatedMessage = "";
    let notUnique: boolean = false;
    for (let k of keyValue)
    {
      if (!this.isUnique(array, k.key, k.value, id))
      {
        translatedMessage += `<strong>( ${k.key} )</strong>
      ${this.Constants.NotificationMessage.Error.Unique_Field_ERROR}<br/>`;
        notUnique = true;
      }
    }
    if (notUnique)

      this.NotificationService.Error_Swal(`${this.Constants.sweetAlert.Title.Error}:`,
        this.Constants.sweetAlert.ButtonText.OK, translatedMessage);
    return notUnique;
  }
  isEqual(ObjectToCompare: any, ObjectToCompareWith: any): boolean
  {
    let keys = Object.keys(ObjectToCompare);
    for (let k of keys)
    {
      if (k === "subdomain" || k === "Subdomain" || k === 'id' || k === "id") continue;
      else
      {
        if (ObjectToCompare[k] !== ObjectToCompareWith[k])
        {
          return false;
        }
      }
    }
    return true;
  }
  isUpdated(object: any, formGroup: FormGroup): boolean
  {
    let objectKeys: string[] = Object.keys(object);
    for (let k of objectKeys)
    {
      if (formGroup.get(k)?.value || formGroup.get(k)?.value === '')
        if (object[k] !== formGroup.get(k)?.value)
        {
          return true;
        }
    }
    return false;
  }
  FillObjectFromForm(object: any, formGroup: FormGroup)
  {
    let formControls: string[] = Object.keys(formGroup.controls);
    let objectKeys: string[] = Object.keys(object);

    for (let c of objectKeys)
    {
      if (formControls.includes(c))
      {

        if (typeof object[c] === 'number')
        {
          let x: number = Number(formGroup.get(c)?.value);
          if (isNaN(Number(formGroup.get(c)?.value)))
            x = 0;
          object[c] = x;
        }
        else if (typeof object[c] === 'boolean')
          object[c] = Boolean(formGroup.get(c)?.value);
        else if (typeof object[c] === 'string')
          object[c] = formGroup.get(c)?.value;
        else object[c] = formGroup.get(c)?.value;
      }
    }
  }
  notUniqueNotification(keyToCheck: string)
  {
    this.NotificationService.error(`( ${keyToCheck} )
          ${this.Constants.NotificationMessage.Error.Unique_Field_ERROR}`);
  }
  notUniqueNotification_Swal(keyToCheck: string)
  {
    this.NotificationService.Error_Swal(`${this.Constants.sweetAlert.Title.Error}:`,
      this.Constants.sweetAlert.ButtonText.OK, `<strong>( ${keyToCheck} )</strong>
    ${this.Constants.NotificationMessage.Error.Unique_Field_ERROR}`);
  }

  GerneralClientSideError_swal(keyToCheck: string, Message: CardTitle)
  {

    this.NotificationService.Error_Swal(`${this.Constants.sweetAlert.Title.Error}:`,
      this.Constants.sweetAlert.ButtonText.OK, `<strong>( ${keyToCheck}) </strong>${Message.text} `);
  }
  Warning(message: string)
  {
    let swalData: SweetAlertData = {
      OtherOptions: {
        icon: "warning",
        text: message,
        html: message,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: this.Constants.sweetAlert.ButtonText.Cancenl,
        confirmButtonText: this.Constants.sweetAlert.ButtonText.Confirm,
        allowEnterKey: true,
        allowEscapeKey: true,
        allowOutsideClick: true,
        showLoaderOnConfirm: true,
        customClass: { title: this.Constants.css.SwalWarningTitle }
      },
      direction: "ltr"
    };
    return this.NotificationService.Custom_Swal(this.Constants.sweetAlert.Title.Warning, swalData);
  }

  Error_swal(message: string)
  {
    return this.NotificationService.Error_Swal(`${this.Constants.sweetAlert.Title.Error}: `,
      this.Constants.sweetAlert.ButtonText.OK, message);
  }
  convertDataURIToBinary(dataURI: any)
  {
    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++)
    {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  FillObjectFromAnotherObject(ObjectToFill: any, from: any)
  {
    let Keys: string[] = Object.keys(ObjectToFill);
    for (let k of Keys)
    {
      ObjectToFill[k] = from[k];
    }
  }
}
