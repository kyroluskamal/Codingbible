import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogHandlerService } from '../../../CommonServices/dialog-handler.service';
import * as Constants from '../../../Helpers/constants';
import { CustomErrorStateMatcher } from '../../../Helpers/custom-error-state-matcher';
import { ForgetPasswordModel } from '../../../models.model';
import { AuthRoutes } from 'src/Helpers/router-constants';
import { Store } from '@ngrx/store';
import { selectIsInProgress, selectValidationErrors } from 'src/State/AuthState/auth.reducer';
import { ForgetPassword, IsInProgress } from 'src/State/AuthState/auth.actions';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit
{
  Constants = Constants;
  ForgetPassworForm = new FormGroup({});
  customErrorStateMatcher: CustomErrorStateMatcher = new CustomErrorStateMatcher();
  ValidationErrors = this.store.select(selectValidationErrors);
  loading = this.store.select(selectIsInProgress);
  //Constructor
  constructor(public formBuilder: FormBuilder, private store: Store,
    public dialogHandler: DialogHandlerService)
  {
  }
  //NgOnInit
  ngOnInit(): void
  {

    this.ForgetPassworForm = this.formBuilder.group({
      email: [null,
        [Validators.pattern(Constants.ConstRegex.EmailRegex), Validators.required]
      ]
    });
  }

  //new Functions
  OnSubmit()
  {
    const ForgetPasswordModel: ForgetPasswordModel = {
      email: this.ForgetPassworForm.get(Constants.FormControlNames.email)?.value,
      clientUrl: Constants.ClientUrl(AuthRoutes.ResetPassword)
    };
    this.store.dispatch(IsInProgress({ isLoading: true }));
    this.store.dispatch(ForgetPassword(ForgetPasswordModel));
  }
}
