import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Observable, Subscription } from 'rxjs';
import { ValidationErrorMessagesService } from '../../CommonServices/ValidationErrorMessagesService/validation-error-messages.service';
import { CustomErrorStateMatcher } from '../../Helpers/custom-error-state-matcher';

import { FormDefs, KikoStepper, StepperNextData, ThemeColor } from '../../Interfaces/interfaces';

@Component({
  selector: 'kyrolus-stepper',
  templateUrl: './generic-stepper.component.html',
  styleUrls: ['./generic-stepper.component.css']
})
export class GenericStepperComponent implements OnInit
{
  LangSubscibtion: Subscription = new Subscription();
  customErrorStateMatcher: CustomErrorStateMatcher = new CustomErrorStateMatcher();

  FormDef: FormDefs = new FormDefs();
  @Input() Stepper: KikoStepper = new KikoStepper;
  @Output() FormDefs: EventEmitter<FormDefs> = new EventEmitter();
  @Output() ChipsHandler: EventEmitter<FormDefs> = new EventEmitter();
  @Output() ResetClick: EventEmitter<boolean> = new EventEmitter();
  @Output() NextClick: EventEmitter<StepperNextData> = new EventEmitter();
  @Output() FormArrayAddButtonClick: EventEmitter<StepperNextData> = new EventEmitter();
  constructor(
    breakpointObserver: BreakpointObserver,
    public ValidationErrorMessage: ValidationErrorMessagesService, private bottomSheet: MatBottomSheet)
  {

  }

  ngOnInit(): void
  {
  }
  SendData(event: FormDefs)
  {
    this.FormDef = event;
    this.FormDefs.emit(event);
  }
  SendNext(stepper: KikoStepper, i: number)
  {
    this.NextClick.emit({ Stepper: stepper, index: i });
  }
  SendFinal(form: FormDefs, i: number)
  {
    console.log(`index  = ${i}`);
    console.log(form);
  }
  ChipsHandle(event: FormDefs)
  {
    this.ChipsHandler.emit(event);
  }
  resetChips()
  {
    for (let s of this.FormDef.formSections)
    {
      for (let x of s.formFieldsSpec)
      {
        if (x.chipsFill) x.chipsFill = [];
      }
    }
  }
  FormArrayAdd_Click(event: FormGroup, stepper: KikoStepper, index: number)
  {
    this.FormArrayAddButtonClick.emit({ Stepper: stepper, index: index });
  }

}
