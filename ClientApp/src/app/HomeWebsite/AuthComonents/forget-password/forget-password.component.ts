import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogHandlerService } from '../../../../CommonServices/dialog-handler.service';
import { CustomErrorStateMatcher } from '../../../../Helpers/custom-error-state-matcher';
import { ForgetPasswordModel } from '../../../../models.model';
import { AuthRoutes } from 'src/Helpers/router-constants';
import { Store } from '@ngrx/store';
import { selectIsInProgress, selectValidationErrors } from 'src/State/AuthState/auth.reducer';
import { ForgetPassword, IsInProgress } from 'src/State/AuthState/auth.actions';
import { ClientUrl, defaultFormAppearance, FormConstants, FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, validators } from 'src/Helpers/constants';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit
{
  FormControlNames = FormControlNames;
  InputFieldTypes = InputFieldTypes;
  FormFieldsNames = FormFieldsNames;
  defaultFormAppearance = defaultFormAppearance;
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  FormConstants = FormConstants;
  ForgetPassworForm = new UntypedFormGroup({});
  customErrorStateMatcher: CustomErrorStateMatcher = new CustomErrorStateMatcher();
  ValidationErrors = this.store.select(selectValidationErrors);
  loading = this.store.select(selectIsInProgress);
  //Constructor
  constructor(public formBuilder: FormBuilder, public store: Store,
    public dialogHandler: DialogHandlerService)
  {
  }
  //NgOnInit
  ngOnInit(): void
  {

    this.ForgetPassworForm = this.formBuilder.group({
      email: [,
        [validators.email, validators.required]
      ]
    });
  }

  //new Functions
  OnSubmit()
  {
    if (this.ForgetPassworForm.invalid) return;
    const ForgetPasswordModel: ForgetPasswordModel = {
      email: this.ForgetPassworForm.get(FormControlNames.authForm.email)?.value,
      clientUrl: ClientUrl(AuthRoutes.ResetPassword)
    };
    this.store.dispatch(IsInProgress({ isLoading: true }));
    this.store.dispatch(ForgetPassword(ForgetPasswordModel));
  }
}
