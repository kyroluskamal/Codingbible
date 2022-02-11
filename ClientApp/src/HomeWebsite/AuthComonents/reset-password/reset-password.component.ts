import { Component, OnInit } from '@angular/core';
import * as Routes from '../../../Helpers/router-constants';

import * as Constants from '../../../Helpers/constants';
import { ModelStateErrors } from 'src/Interfaces/interfaces';
import { CustomErrorStateMatcher } from 'src/Helpers/custom-error-state-matcher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/Services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'src/Helpers/custom-validators';
import { ResetPasswordModel } from 'src/models.model';
import { ServerResponseHandelerService } from 'src/CommonServices/server-response-handeler.service';
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
  ValidationErrors: ModelStateErrors[] = [];
  loading: boolean = false;
  Routes = Routes;
  email: string | null = "";
  token: string | null = "";
  constructor(private accountService: AccountService, private route: ActivatedRoute,
    private router: Router, public formBuilder: FormBuilder, private ServerResponse: ServerResponseHandelerService) { }

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
      confirmpassword: [null, [Validators.required]],
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
    this.accountService.ResetPassword(ResetPasswordModel).subscribe({
      next: (r: any) =>
      {
        this.ServerResponse.GeneralSuccessResponse_Swal(r.message);
        this.router.navigate(['', Routes.AuthRoutes.Login]);
      },
      error: (e: any) =>
      {
        console.log(e);
        if (e.error.status === Constants.HTTPResponseStatus.identityErrors)
        {
          for (let error of e.error.message)
          {
            if (error.code === "InvalidToken")
            {
              this.ServerResponse.GetGeneralError_Swal("Failed", "OK", Constants.NotificationMessage.Error.ResetPasswordFail_InvalidToken);
              this.router.navigateByUrl("/");
              break;
            }
          }
          return;
        }
        if (e.error.errors.Email)
        {
          this.ServerResponse.GetGeneralError_Swal("Failed", "OK", "Not a valid email. Try to reset password again");
          this.router.navigateByUrl("/");
          return;
        }
        this.ValidationErrors = [];
        this.loading = false;
        //add ModelStateErrors
        this.ValidationErrors = this.ServerResponse.GetServerSideValidationErrors(e);
      }
    });
  }
}
