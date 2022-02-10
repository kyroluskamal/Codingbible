import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as Routes from '../../../Helpers/router-constants';
import { DialogHandlerService } from '../../../CommonServices/dialog-handler.service';
import { ValidationErrorMessagesService } from '../../../CommonServices/ValidationErrorMessagesService/validation-error-messages.service';
import * as Constants from '../../../Helpers/constants';
import { CustomErrorStateMatcher } from '../../../Helpers/custom-error-state-matcher';
import { LoginViewModel } from '../../../models.model';
import { AccountService } from '../../../Services/account.service';
import { ServerResponseHandelerService } from '../../../CommonServices/server-response-handeler.service';
import { CustomValidators } from 'src/Helpers/custom-validators';
import { ModelStateErrors } from 'src/Interfaces/interfaces';
import { HttpErrorResponse } from '@angular/common/http';
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
  ValidationErrors: ModelStateErrors[] = [];
  loading: boolean = false;
  Routes = Routes;
  FormFieldAppear = new Constants.FormFiledAppearance();
  //constructor
  constructor(public formBuilder: FormBuilder, private accountService: AccountService,
    public ValidationErrorMessage: ValidationErrorMessagesService, private router: Router,
    private ServerResponse: ServerResponseHandelerService, public dialogHandler: DialogHandlerService)
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
    // this.rememberMeOnClick();
  }


  Login()
  {
    this.loading = true;
    if (this.loginForm.invalid) return;
    let Model: LoginViewModel = {
      email: this.loginForm.get(Constants.FormControlNames.email)?.value,
      password: this.loginForm.get(Constants.FormControlNames.password)?.value,
      rememberMe: Boolean(this.loginForm.get(Constants.FormControlNames.rememberMe)?.value)
    };
    console.log("Login");
    this.accountService.Login(Model).subscribe({

      next: r =>
      {
        console.log(r);
        this.ServerResponse.GeneralSuccessResponse_Swal(r.message);
        this.dialogHandler.CloseDialog();
        this.loading = false;
        if (this.router.url.includes(Routes.AuthRoutes.Login))
          this.router.navigateByUrl(Routes.HomeRoutes.Dashboard);
      },
      error: (e) =>
      {
        this.ValidationErrors = [];
        this.loading = false;
        this.ValidationErrors = this.ServerResponse.GetServerSideValidationErrors(e);
      },
    });
  }
  CheckIfEmailIsNotFound()
  {
    this.ValidationErrors = [];
    this.accountService.IsUserFoundByEmail(this.loginForm.get(Constants.AuthConstants.email)?.value)?.subscribe(
      {
        next: r => { },
        error: e =>
        {
          this.ValidationErrors = [];
          if (e.error)
            this.ValidationErrors.push({ key: e.error.status, message: e.error.message });
          console.log(e);
        }
      }
    );
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
