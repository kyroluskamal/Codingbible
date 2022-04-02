
import { SweetAlertOptions } from "sweetalert2";

export interface ExpansionPanel
{
  title: string;
  expanded: boolean;
  links: { link: string[], LinkText: string, state: boolean; }[];
  bootstrapIcon?: string;
  itemLevel?: number;
}
export interface ColDefs
{
  field: string;
  display?: string;
  icon?: string;
  HeaderClasses?: string;
  rowClasses?: string;
  pipe?: string;
  data_icon?: string;
  isObject?: boolean;
  KeyToShowIfObjectTrue?: string;
}


export interface CardTitle
{
  text: string;
  needTranslation: boolean;
}
export interface MaxMinLengthValidation
{
  prop: string; maxLength?: number; minLength?: number;
}

export interface SweetAlertData
{
  title?: CardTitle[];
  text?: CardTitle[];
  ConfirmButton_FaIcon?: any;
  ConfirmButton_GoogleIcon?: string;
  CancelButton_FaIcon?: any;
  CancelButton_GoogleIcon?: string;
  DenyButton_FaIcon?: any;
  DenyButton_GoogleIcon?: string;
  OtherOptions: SweetAlertOptions,
  direction: string;
}

export interface KeyValueForUniqueCheck
{
  key: string;
  value: string;
}

export interface ModelStateErrors
{
  key: string;
  message: string;
}
export interface IdentityErrors
{
  code: string;
  description: string;
}

export interface SelectedTextData
{
  text: string;
  start: number;
  end: number;
  anchorNode: Node | null | undefined;
  focusNode: Node | null | undefined;
}

export class CbTableDataSource<T>{
  public Data: T[] | null = [];
  private FilteredData: T[] | null = [];
  set data(value: T[] | null)
  {
    this.Data = value;
  }
  get data(): T[] | null
  {
    return this.Data;
  }

  public filter(value: string): T[] | null
  {
    this.FilteredData = [];
    if (this.data != null)
      for (let i of this.data)
      {
        if (JSON.stringify(i).toLowerCase().includes(value.toLowerCase()))
        {
          this.FilteredData?.push(i);
        }
      }
    return this.FilteredData;
  }
}