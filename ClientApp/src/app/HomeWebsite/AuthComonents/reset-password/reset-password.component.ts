import { Component, OnInit } from '@angular/core';
import * as Constants from '../../../../Helpers/constants';
import { CustomErrorStateMatcher } from 'src/Helpers/custom-error-state-matcher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'src/Helpers/custom-validators';
import { ResetPasswordModel } from 'src/models.model';
import { Store } from '@ngrx/store';
import { selectIsInProgress, selectValidationErrors } from 'src/State/AuthState/auth.reducer';
import { IsInProgress, ResetPassword } from 'src/State/AuthState/auth.actions';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit
{
  Constants = Constants;
  Form: FormGroup = new FormGroup({});
  customErrorStateMatcher: CustomErrorStateMatcher = new CustomErrorStateMatcher();
  ValidationErrors = this.store.select(selectValidationErrors);
  loading = this.store.select(selectIsInProgress);

  email: string | null = "";
  token: string | null = "";
  constructor(private route: ActivatedRoute, private store: Store,
    private router: Router, public formBuilder: FormBuilder) { }

  ngOnInit(): void
  {
    this.Form = this.formBuilder.group({
      password: [null,
        Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          CustomValidators.patternValidator(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, { hasSpecialCharacters: true }),
          Validators.minLength(8)])
      ],
      confirmpassword: [null,
        [Validators.required]
      ],
    },
      {
        validators: CustomValidators.passwordMatchValidator
      }
    );
    this.email = this.route.snapshot.queryParamMap.get(Constants.AuthConstants.email);
    this.token = this.route.snapshot.queryParamMap.get(Constants.AuthConstants.token);
    console.log(Constants.ConstRegex.EmailRegex.test(this.email!));
    console.log(this.token);

    if (!this.email || !this.token
      || !Constants.ConstRegex.EmailRegex.test(this.email!)
    )
    {
      this.router.navigateByUrl("/");
    }
  }


  OnSubmit()
  {
    let ResetPasswordModel: ResetPasswordModel = {
      email: this.email!,
      token: this.token!,
      password: this.Form.get(Constants.FormControlNames.password)?.value,
      confirmPassword: this.Form.get(Constants.FormControlNames.confirmpassword)?.value
    };
    this.store.dispatch(IsInProgress({ isLoading: true }));
    this.store.dispatch(ResetPassword(ResetPasswordModel));
  }
}
