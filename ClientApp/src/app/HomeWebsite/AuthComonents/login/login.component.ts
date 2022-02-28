import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Routes from '../../../../Helpers/router-constants';
import { DialogHandlerService } from '../../../../CommonServices/dialog-handler.service';
import * as Constants from '../../../../Helpers/constants';
import { CustomErrorStateMatcher } from '../../../../Helpers/custom-error-state-matcher';
import { CustomValidators } from 'src/Helpers/custom-validators';
import { Store } from '@ngrx/store';
import { IsInProgress, Login } from 'src/State/AuthState/auth.actions';
import * as selectors from 'src/State/AuthState/auth.reducer';
import { LoginViewModel } from 'src/models.model';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit
{
  Constants = Constants;
  loginForm: FormGroup = new FormGroup({});
  customErrorStateMatcher: CustomErrorStateMatcher = new CustomErrorStateMatcher();
  ValidationErrors$ = this.store.select(selectors.selectValidationErrors);
  loading$ = this.store.select(selectors.selectIsInProgress);

  Routes = Routes;

  //constructor
  constructor(public formBuilder: FormBuilder, public dialogHandler: DialogHandlerService,
    private store: Store)
  {
  }

  @Input() CloseIconHide: boolean = false;
  @Input() ShowCardFooter: boolean = true;

  ngOnInit(): void
  {
    this.loginForm = this.formBuilder.group({
      email: [null,
        [Validators.pattern(Constants.ConstRegex.EmailRegex), Validators.required]
      ],
      password: [null,
        [Validators.required, Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(/\d/, { hasNumber: true }),
          CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
          CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
          CustomValidators.patternValidator(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, { hasSpecialCharacters: true }),
          Validators.minLength(8)])]
      ],
      rememberme: [false]
    });
  }


  Login()
  {
    // this.loading = true;
    if (this.loginForm.invalid) return;
    let Model: LoginViewModel = {
      email: this.loginForm.get(Constants.FormControlNames.authForm.email)?.value,
      password: this.loginForm.get(Constants.FormControlNames.authForm.password)?.value,
      rememberMe: Boolean(this.loginForm.get(Constants.FormControlNames.authForm.rememberMe)?.value)
    };
    localStorage.setItem(Constants.FormControlNames.authForm.rememberMe, this.loginForm.get(Constants.FormControlNames.authForm.rememberMe)?.value);
    this.store.dispatch(IsInProgress({ isLoading: true }));
    this.store.dispatch(Login(Model));
  }

  // SendConfirmationAgain()
  // {
  //   const sendEmailConfirmationAgian: SendEmailConfirmationAgian = {
  //     Email: this.loginForm.get("Email")?.value,
  //     ClientUrl: this.Constants.ClientUrl(RouterConstants.Client_EmailConfirmationUrl)
  //   };
  //   this.accountService.SendConfirmationAgain(sendEmailConfirmationAgian).subscribe(
  //     (response: any) =>
  //     {
  //       this.Notifications.success(this.translate.GetTranslation(this.Constants.EmilConfirmationResnding_success),
  //         this.translate.isRightToLeft(this.selected) ? "rtl" : "ltr");
  //     },
  //     (error) =>
  //     {
  //       this.Notifications.error(this.translate.GetTranslation(this.Constants.EmilConfirmationResnding_Error), '',
  //         this.translate.isRightToLeft(this.selected) ? "rtl" : "ltr");
  //       console.log(error);
  //     }
  //   );
  // }
  // rememberMeOnClick()
  // {
  //   localStorage.setItem(this.Constants.ClientRememberMe, this.loginForm.get(this.Constants.RememberMe)?.value);
  // }

  ngOnDestroy(): void
  {
  }
}
