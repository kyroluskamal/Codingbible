import { Direction } from "@angular/cdk/bidi";
import { ComponentType } from "@angular/cdk/portal";
import { StepperOrientation } from "@angular/cdk/stepper";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { MatFormFieldAppearance } from "@angular/material/form-field";
import { MatTableDataSource } from "@angular/material/table";
import { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";

export interface ExpansionPanel
{
  title: string;
  expanded: boolean;
  links: { link: string[], LinkText: string, state: boolean; }[];
  GoogleIconName?: string;
  faIcon?: any;
  boostrapIcon?: any;
}

export interface ThemeColor
{
  colorName: string;
  value: string;
  choosen: boolean;
  bg: string;
  color: string;
}

export interface ColDefs
{
  field: string;
  display: string;
  HeaderfaIcon?: any;
  HeaderGoogleIcon?: string;
  IsTrueOrFlase?: boolean;
  True_faIcon?: any;
  False_faIcon?: any;
  True_GoogleIcon?: string;
  False_GoogleIcon?: string;
  preventDeleteFor?: string;
}

export class FormDefs
{
  form: FormGroup = new FormGroup({});
  Card_fxFlex?: string;
  StepNoInStepper?: number = 0;
  Form_fxLayout: string = "";
  Form_fxLayoutAlign: string = "";
  Form_fxLayoutGap?: string = "";
  stepperStepLabel?: string = "";
  Button_faIcon?: any;
  AllSelectionData?: SelectedDataTransfer[] = [];
  Show_Next_Button_Stepper?: boolean = false;
  Show_Back_Button_Stepper?: boolean = false;
  Show_Reset_Button_Stepper?: boolean = false;
  Show_Add_Button_Stepper?: boolean = false;
  Next_Button_Stepper_text?: CardTitle[] = [];
  Back_Button_Stepper_text?: CardTitle[] = [];
  Reset_Button_Stepper_text?: CardTitle[] = [];
  Add_Button_Stepper_text?: CardTitle[] = [];
  Next_Button_Stepper_GoogleIcon?: string = "";
  Back_Button_Stepper_GoogleIcon?: string = "";
  Reset_Button_Stepper_GoogleIcon?: string = "";
  Add_Button_Stepper_GoogleIcon?: string = "";
  Next_Button_Stepper_faIcon?: any;
  Back_Button_Stepper_faIcon?: any;
  Reset_Button_Stepper_faIcon?: any;
  Add_Button_Stepper_faIcon?: any;
  Button_GoogleIcon?: string;
  ButtonText: string[] = [];
  formSections: formSections[] = [];
  formGroupToAddInFormArray?: FormGroup = new FormGroup({});
}
export class StepperNextData
{
  Stepper: KikoStepper = new KikoStepper();
  index: number = 0;
}
export class formSections
{
  sectionTitle?: CardTitle[] = [];
  fxFlex: string = "";
  fxFlex_sm?: string = "";
  fxFlex_md?: string = "";
  formFieldsSpec: FormFields[] = [];
}
export interface FormArray_Add_Remove_TransferData
{
  steper: KikoStepper;
  formArrayName: string;
}
export class FormFields
{
  type: string = "";
  formControlName: string = "";
  appearance: MatFormFieldAppearance = "outline";
  fxFlex?: string;
  fxFlex_gt_xs?: string;
  fxFlex_xs?: string;
  mat_label: string = "";
  faIcon?: any;
  GoogleIcon?: string;
  errors?: MatError[];
  hint?: MatFormHint = new MatFormHint();
  cdkAutosizeMinRows?: string = "";
  required: boolean = false;
  maxLength?: number = 0;
  minLength?: number = 0;
  min?: string = "";
  max?: string = "";
  SelectData?: any[] = [];
  PropertyNameToShowInSelection?: string = "";
  PropertyNameToShowInSelection_many?: { prop: string, separator: string; }[] = [];
  PropertyNameToShowInSelection_many_index_tosearch?: number = 0;
  PropertyNameToSetInValue?: string = "";
  SelectionInsideButton_faIcon?: any;
  SelectionInsideButton_GoogleIcon?: string = "";
  SelectionButton_ToolTip?: string = "";
  SelectionText_IfNoData?: string = "";
  SelectionDataSentToBottomSheet?: any;
  SelectionBottomSheetComponent?: ComponentType<unknown>;
  Selection_Multiple?: boolean = false;
  ShowSelectionAddButton?: boolean = true;
  UploadInputText?: CardTitle[] = [];
  displayedColumns?: string[] = [];
  columns?: ColDefs[] = [];
  ShowSelectionSearchBox?: boolean = false;
  disabled?: boolean = false;
  SelectionHasOptions?: boolean = false;
  SelectionOptionGroups?: MatGroupOptionsForMatSelect[] = [];
  formArrayName?: string = "";
  formArray?: FormArray = new FormArray([]);
  dataSource?: MatTableDataSource<any>;
  formFields?: FormFields[] = [];
  chipsFromDb?: any[] = [];
  chipsFill?: any[] = [];
  ChipsFromDbUnFiltered?: any[];
  chipPropertyToShowInValue?: string = "";
  chipPropertyToShowInSelection?: string = "";
  fieldToolTip: string = "";
  imageHeight?: string = "";
  imageWidth?: string = "";
  UploadedImageWidth?: string = "";
}
export class MatFormHint
{
  text_no_translation?: string = "";
  text_to_translation: string = "";
  dir: Direction = "ltr";
  align: 'start' | 'end' = "end";
}
export class MatGroupOptionsForMatSelect
{
  name: string = "";
  options: any;
  disabled: boolean = false;
}
export abstract class FormFieldType
{
  public static text = 'text';
  public static checkbox = 'checkbox';
  public static search = 'search';
  public static chip_autocomplete = 'chip-autocomplete';
  public static email = 'email';
  public static tel = 'tel';
  public static textarea = 'textarea';
  public static OneFile = 'OneFile';
  public static image = 'image';
  public static select = 'select';
  public static date = 'date';
  public static number = 'number';
  public static array = 'array';
}
export class MatError
{
  type: string = "";
  TranslatedMessage: { text: string, needTraslation: boolean; }[] = [];
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

export interface SelectedDataTransfer
{
  property: string;
  SelectedData: any[];
}

export interface AbstractApi
{
  ip_address: string;
  city: string;
  city_geoname_id: number;
  region: string;
  region_iso_code: string;
  region_geoname_id: number;
  postal_code: string,
  country: string;
  country_code: string;
  country_geoname_id: number;
  country_is_eu: boolean;
  continent: string;
  continent_code: string;
  continent_geoname_id: number;
  longitude: number;
  latitude: number;
  security: {
    is_vpn: boolean;
  },
  timezone: {
    name: string;
    abbreviation: string;
    gmt_offset: number;
    current_time: string;
    is_dst: boolean;
  },
  flag: {
    emoji: string;
    unicode: string;
    png: string;
    svg: string;
  },
  currency: {
    currency_name: string;
    currency_code: string;
  },
  connection: {
    autonomous_system_number: number;
    autonomous_system_organization: string;
    connection_type: string;
    isp_name: string;
    organization_name: string;
  };
}

export interface TableSlidingSections
{
  sectionName: CardTitle[];
  fxFlex?: string;
  fxFlex_sm?: string;
  girdCols?: number;
  keys: string[];
}

export interface MatBottomSheetDismissData<T>
{
  dataSource: MatTableDataSource<T>;
  ShowBrogressBar: boolean;
  addedRow: T;
  data: T[];
  SelectedRows: T[];
}

export interface DataToEdit_PassToBottomSheet<T>
{
  dataToEdit: T, Array: T[], ShowProgressBar: boolean;
}
export interface KeyValueForUniqueCheck
{
  key: string;
  value: string;
}

export class KikoStepper
{
  isLinear: boolean = false;
  orientation: StepperOrientation = "horizontal";
  formDef?: FormDefs[] = [];
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