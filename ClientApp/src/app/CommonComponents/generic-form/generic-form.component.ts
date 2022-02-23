import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CardTitle, FormDefs, FormFields, MatBottomSheetDismissData, SelectedDataTransfer, ThemeColor } from '../../../Interfaces/interfaces';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ComponentType } from '@angular/cdk/portal';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { CustomErrorStateMatcher } from '../../../Helpers/custom-error-state-matcher';
import * as Constants from '../../../Helpers/constants';

@Component({
  selector: 'kiko-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.css']
})
export class GenericFormComponent implements OnInit, OnChanges, AfterViewInit
{
  LangSubscibtion: Subscription = new Subscription();
  customErrorStateMatcher: CustomErrorStateMatcher = new CustomErrorStateMatcher();
  loading: boolean = false;
  Constants = Constants;
  FormSpec: FormDefs = new FormDefs();
  temp: any[] = [];
  oneFileName: string = "";
  stopSpace: boolean = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() Form: FormDefs = new FormDefs();
  @Input() Title: CardTitle[] = [];
  @Input() SubTitle: CardTitle[] = [];
  @Input() AllSelectedData: SelectedDataTransfer[] = [];
  @Input() showCloseButton: boolean = false;
  @Input() showAddOrSaveButton: boolean = true;
  @Output() GetValue: EventEmitter<FormDefs> = new EventEmitter();
  @Output() BottomSheetDismissed: EventEmitter<boolean> = new EventEmitter();
  @Output() DatOnChange: EventEmitter<FormDefs> = new EventEmitter();
  @Output() ChipsHandler: EventEmitter<FormDefs> = new EventEmitter();
  @Output() FormArrayAddClick: EventEmitter<FormGroup> = new EventEmitter();
  @ViewChild("matselect") MatSelect!: MatSelect;
  @ViewChild('chip') chipsInput!: ElementRef<HTMLInputElement>;
  constructor(private _bottomSheetRef: MatBottomSheetRef<any>,
    private bottomSheet: MatBottomSheet
  )
  {
    this.FormSpec = this.Form;
  }
  ngAfterViewInit(): void
  {
  }
  ngOnChanges(changes: SimpleChanges): void
  {
    if ("Form" in changes)
    {
      this.FormSpec = this.Form;
    }
  }

  SendOnchange()
  {
    this.DatOnChange.emit(this.FormSpec);
  }
  SetSelectionData(PropertyToSearch: string, SelectedData: any[])
  {

    let tempData = this.AllSelectedData.filter(x => { return x.property === PropertyToSearch; })[0].SelectedData;
    console.log(tempData);
    for (let section of this.FormSpec.formSections)
    {
      for (let field of section.formFieldsSpec)
      {
        if (field.SelectData)
        {
          if (!field.PropertyNameToShowInSelection_many)
          {
            if (field.PropertyNameToShowInSelection === PropertyToSearch)
            {
              field.SelectData = [...tempData];
            }
          } else
          {
            if (field.PropertyNameToShowInSelection_many[field.PropertyNameToShowInSelection_many_index_tosearch!].prop === PropertyToSearch)
              field.SelectData = [...tempData];
          }
        }
      }
      this.DatOnChange.emit(this.FormSpec);
    }
    SelectedData = [...this.AllSelectedData.filter(x => { return x.property === PropertyToSearch; })[0].SelectedData];
  }
  // @HostListener('window:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent)
  // {
  //   event.stopPropagation();
  //   console.log(event.key);
  //   if (this.MatSelect)
  //   {
  //     if (this.MatSelect.panelOpen && event.key === " " && this.stopSpace)
  //     {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  ngOnDestroy(): void
  {
  }
  ngOnInit(): void
  {
    this.FormSpec = this.Form;
  }

  SendData()
  {
    this.GetValue.emit(this.FormSpec);
  }

  OpenButtomSheet(component: ComponentType<unknown>, dataSentToBottomSheet: any)
  {
    this.bottomSheet.open(component, { data: dataSentToBottomSheet });
  }
  Search(event: any, PropertyToSearch: string)
  {
    let tempData = this.AllSelectedData.filter(x => { return x.property === PropertyToSearch; })[0].SelectedData;
    let filteredData = tempData.filter(x =>
    {
      for (let v of String(event.target.value).trim().split(" "))
      {
        if (Object.values(x).join(" ").toLowerCase().includes(v.toLowerCase()))
          return true;
      }
      return false;
    });

    for (let section of this.FormSpec.formSections)
    {
      for (let field of section.formFieldsSpec)
      {
        if (field.SelectData)
        {
          if (!field.PropertyNameToShowInSelection_many)
          {
            if (field.PropertyNameToShowInSelection === PropertyToSearch)
            {
              if (event.target.value !== "")
              {
                this.stopSpace = true;
                field.SelectData = [...filteredData];
              }
              else if (event.target.value === "")
              {

                field.SelectData = [...tempData];
              }
            }
          }
          else
          {
            if (field.PropertyNameToShowInSelection_many![field.PropertyNameToShowInSelection_many_index_tosearch!].prop === PropertyToSearch)
            {
              if (event.target.value !== "")
                field.SelectData = [...filteredData];
              else if (event.target.value === "")
              {
                field.SelectData = [...tempData];
              }
            }
          }
        }
      }
    }
  }

  BottomSheetDismiss()
  {
    this.BottomSheetDismissed.emit(true);
  }
  onFileSelected(event: any, formContolName: string)
  {
    let file: File = event.target.files[0];
    this.oneFileName = file.name;
    const reader = new FileReader();
    reader.onload = (e: any) =>
    {
      const bytes = e.target.result;
      this.FormSpec.form.get(formContolName)?.setValue(bytes);
    };
    reader.readAsDataURL(file);
    // var fileByteArray: any[] = [];
    // reader.readAsArrayBuffer(file);
    // reader.onloadend = (evt: any) => {
    //   if (evt.target.readyState == FileReader.DONE) {
    //     var arrayBuffer = evt.target.result;
    //     let array = new Uint8Array(arrayBuffer);
    //     for (var i = 0; i < array.length; i++) {
    //       fileByteArray.push(array[i]);
    //     }
    //     console.log(fileByteArray)
    //     this.FormSpec.form.get(formContolName)?.setValue(fileByteArray);
    //   }
    // }
  }
  formArray(formArrayName: string): FormArray
  {
    return this.FormSpec.form.get(formArrayName) as FormArray;
  }
  getControl(controlName: string): FormControl
  {
    return this.FormSpec.form.get(controlName) as FormControl;
  }

  selectedChip(event: MatAutocompleteSelectedEvent, chipsToFill: any[], ChipsFromDb: any[], chipPropertyToShowInValue: string)
  {
    let chip = ChipsFromDb.filter(x => { return x[chipPropertyToShowInValue] === event.option.value; })[0];
    if (chipsToFill.includes(chip)) return;
    chipsToFill.push(chip);
    console.log(chipsToFill);

  }

  addChip(event: MatChipInputEvent)
  {
    if (event.value === "") return;
    this.ChipsHandler.emit(this.FormSpec);
  }

  removeChip(chip: any, ChipsToFill: any[])
  {
    const index = ChipsToFill.indexOf(chip);

    if (index >= 0)
    {
      ChipsToFill.splice(index, 1);
    }
  }
  FilterChipsAutoComplete(event: any, chipPropertyToShowInSelection: string)
  {
    for (let section of this.FormSpec.formSections)
    {
      for (let field of section.formFieldsSpec)
      {
        if (field.chipsFromDb)
        {
          if (field.chipPropertyToShowInSelection === chipPropertyToShowInSelection)
          {
            if (event.target.value !== "")
            {
              field.chipsFromDb = [...field.ChipsFromDbUnFiltered!.filter(i => { return String(i[chipPropertyToShowInSelection]).toLowerCase().includes(event.target.value.toLowerCase()); })];
            }
            else if (event.target.value === "")
            {
              field.chipsFromDb = [...field.ChipsFromDbUnFiltered!];
            }
          }
        }
      }
    }
  }
  FormArrayAdd_click(formGroup: FormGroup)
  {
    this.FormArrayAddClick.emit(formGroup);
  }
}
