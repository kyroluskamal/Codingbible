import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CustomErrorStateMatcher } from 'src/Helpers/custom-error-state-matcher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'src/Helpers/custom-validators';
import { ResetPasswordModel } from 'src/models.model';
import { Store } from '@ngrx/store';
import { selectIsInProgress, selectValidationErrors } from 'src/State/AuthState/auth.reducer';
import { IsInProgress, ResetPassword } from 'src/State/AuthState/auth.actions';
import { AuthConstants, ConstRegex, defaultFormAppearance, FormConstants, FormControlNames, FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PASSWORD_MINLENGTH, validators } from 'src/Helpers/constants';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit
{
  FormControlNames = FormControlNames;
  InputFieldTypes = InputFieldTypes;
  FormFieldsNames = FormFieldsNames;
  defaultFormAppearance = defaultFormAppearance;
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  FormConstants = FormConstants;
  PASSWORD_MINLENGTH = PASSWORD_MINLENGTH;
  Form: FormGroup = new FormGroup({});
  customErrorStateMatcher: CustomErrorStateMatcher = new CustomErrorStateMatcher();
  ValidationErrors = this.store.select(selectValidationErrors);
  loading = this.store.select(selectIsInProgress);
  email: string | null = "";
  token: string | null = "";

  constructor(public route: ActivatedRoute, public store: Store,
    public router: Router, public formBuilder: FormBuilder) { }

  ngOnInit(): void
  {
    this.Form = this.formBuilder.group({
      password: [null, [validators.required, validators.password, validators.PASSWORD_MIN_LENGTH]],
      confirmpassword: [null,
        [validators.required, validators.password, validators.PASSWORD_MIN_LENGTH]
      ],
    },
      {
        validators: CustomValidators.passwordMatchValidator
      }
    );
    this.email = this.route.snapshot.queryParamMap.get(AuthConstants.email);
    this.token = this.route.snapshot.queryParamMap.get(AuthConstants.token);
    if (!this.email || !this.token || !ConstRegex.EmailRegex.test(this.email!))
    {
      this.router.navigateByUrl("/");
    }
  }


  OnSubmit()
  {
    if (!this.email || !this.token || !ConstRegex.EmailRegex.test(this.email!) || this.Form.invalid) return;

    let ResetPasswordModel: ResetPasswordModel = {
      email: this.email!,
      token: this.token!,
      password: this.Form.get(FormControlNames.authForm.password)?.value,
      confirmPassword: this.Form.get(FormControlNames.authForm.confirmpassword)?.value
    };
    this.store.dispatch(IsInProgress({ isLoading: true }));
    this.store.dispatch(ResetPassword(ResetPasswordModel));
  }
}
