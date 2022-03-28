import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthRoutes } from '../../../../Helpers/router-constants';
import { DialogHandlerService } from '../../../../CommonServices/dialog-handler.service';
import { defaultFormAppearance, FormConstants, FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PASSWORD_MINLENGTH, validators } from '../../../../Helpers/constants';
import { CustomErrorStateMatcher } from '../../../../Helpers/custom-error-state-matcher';
import { Store } from '@ngrx/store';
import { IsInProgress, Login } from 'src/State/AuthState/auth.actions';
import { selectIsInProgress, selectValidationErrors } from 'src/State/AuthState/auth.reducer';
import { LoginViewModel } from 'src/models.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit
{
  loginForm: FormGroup = new FormGroup({});
  customErrorStateMatcher: CustomErrorStateMatcher = new CustomErrorStateMatcher();
  ValidationErrors$ = this.store.select(selectValidationErrors);
  loading$ = this.store.select(selectIsInProgress);
  FormControlNames = FormControlNames;
  InputFieldTypes = InputFieldTypes;
  FormFieldsNames = FormFieldsNames;
  defaultFormAppearance = defaultFormAppearance;
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  FormConstants = FormConstants;
  PASSWORD_MINLENGTH = PASSWORD_MINLENGTH;
  AuthRoutes = AuthRoutes;
  //constructor
  constructor(public formBuilder: FormBuilder, public dialogHandler: DialogHandlerService,
    public store: Store, public router: Router)
  {
  }

  @Input() CloseIconHide: boolean = false;
  @Input() ShowCardFooter: boolean = true;

  ngOnInit(): void
  {
    this.loginForm = this.formBuilder.group({
      email: [null,
        [validators.email, validators.required]
      ],
      password: [null,
        [validators.required, validators.password,
        validators.PASSWORD_MIN_LENGTH]]
      ,
      rememberme: [false]
    });
  }


  Login()
  {
    if (this.loginForm.invalid) return;
    let Model: LoginViewModel = {
      email: this.loginForm.get(FormControlNames.authForm.email)?.value,
      password: this.loginForm.get(FormControlNames.authForm.password)?.value,
      rememberMe: Boolean(this.loginForm.get(FormControlNames.authForm.rememberMe)?.value)
    };
    localStorage.setItem(FormControlNames.authForm.rememberMe, this.loginForm.get(FormControlNames.authForm.rememberMe)?.value);
    this.store.dispatch(IsInProgress({ isLoading: true }));
    this.store.dispatch(Login(Model));
  }
}
