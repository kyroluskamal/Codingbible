import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { css, NotificationMessage, sweetAlert } from 'src/Helpers/constants';
import { CardTitle, KeyValueForUniqueCheck, SelectedTextData, SweetAlertData } from '../Interfaces/interfaces';
import { NotificationsService } from './notifications.service';
@Injectable({
  providedIn: 'root'
})
export class ClientSideValidationService
{
  mousex: number = 0;
  mousey: number = 0;
  constructor(private NotificationService: NotificationsService,
    @Inject(DOCUMENT) private document: Document)
  {
    this.document.addEventListener("mousemove", (e) =>
    {
      this.mousex = e.pageX;
      this.mousey = e.pageY;
    });
  }

  refillForm(object: any, formGroup: FormGroup)
  {
    let keys = Object.keys(object);
    for (let k of keys)
    {
      let key = k.toLowerCase();
      if (formGroup.get(key))
        formGroup.get(key)?.setValue(object[k]);
    }
  }
  isNotUnique(array: any[], keyToCheck: string, value: string, id?: number)
  {
    if (!id)
    {
      return array.find(x => x[keyToCheck] === value) !== undefined;
    } else
    {
      return array.find(x => x[keyToCheck] === value && x[id] !== id) !== undefined;
    }
  }

  isUniqueMany(array: any[], keyValue: KeyValueForUniqueCheck[], id?: number)
  {
    let translatedMessage = "";
    let notUnique: boolean = true;
    for (let k of keyValue)
    {
      if (this.isNotUnique(array, k.key, k.value, id))
      {
        translatedMessage += `<strong>( ${k.key} )</strong>
      ${NotificationMessage.Error.Unique_Field_ERROR}<br/>`;
        notUnique = false;
      }
    }
    if (!notUnique)

      this.NotificationService.Error_Swal(`${sweetAlert.Title.Error}:`,
        sweetAlert.ButtonText.OK, translatedMessage);
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

  FillObjectFromAnotherObject(ObjectToFill: any, from: any)
  {
    let Keys: string[] = Object.keys(ObjectToFill);
    for (let k of Keys)
    {
      ObjectToFill[k] = from[k];
    }
  }
  GetVideo(VideoUrl: string)
  {
    if (VideoUrl)
    {
      let vedioId;
      if (VideoUrl.includes('youtu.be'))
      {
        vedioId = VideoUrl.split('youtu.be');
      }
      else if (VideoUrl.includes('list='))
      {
        let link = VideoUrl.split('&list=')[0];
        vedioId = link.split("youtube.com/watch?v=");
      } else if (VideoUrl.includes("youtube.com/embed/"))
      {
        vedioId = VideoUrl.split("youtube.com/embed/");
      }
      else
        vedioId = VideoUrl.split("youtube.com/watch?v=");
      vedioId = vedioId[vedioId.length - 1];
      return vedioId;
    }
    return "";
  }
  GetSelectedText()
  {
    var range: Range | undefined = new Range();
    var selection: Selection | null = null;
    if (window.getSelection && window.getSelection()?.rangeCount! > 0)
    {
      range = window.getSelection()?.getRangeAt(0);
      selection = window.getSelection();
    }
    else if (this.document.getSelection() && this.document.getSelection()?.rangeCount! > 0)
    {
      range = this.document.getSelection()?.getRangeAt(0);
      selection = this.document.getSelection();
    }
    let selectedText: SelectedTextData = {
      documentFragment: range?.cloneRange().cloneContents(),
      Range: range!,
      text: selection!?.toString(),
      start: range?.startOffset!,
      end: range?.endOffset!,
      anchorNode: selection?.anchorNode,
      focusNode: selection?.focusNode,
      mouseX: this.mousex,
      mouseY: this.mousey
    };
    return selectedText;
  }
  GenerateSlug(title: string)
  {
    return title.toLowerCase().replace(/\|/g, ' ').replace(/[^\w-]+/g, '-');
  }
}
