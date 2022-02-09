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
  ValidationErrors: any[] = [];
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
      email: [null, [Validators.pattern(Constants.ConstRegex.EmailRegex), Validators.required]],
      password: [null, [Validators.required]],
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
      rememberMe: this.loginForm.get(Constants.FormControlNames.rememberMe)?.value
    };
    this.accountService.Login(Model).subscribe({
      next: r =>
      {
        console.log(r);
        this.ServerResponse.GeneralSuccessResponse_Swal(Constants.NotificationMessage.Success.Logged_In_Success);
        this.dialogHandler.CloseDialog();
        this.loading = false;
        if (this.router.url.includes(Routes.AuthRoutes.Login))
          this.router.navigateByUrl(Routes.HomeRoutes.Dashboard);
      },
      error: error =>
      {
        this.loading = false;
        // this.ServerResponse.Error_Swal(errors.);
        console.log(error);
        this.ValidationErrors = error;
      },
    });
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
