import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Routes from '../../../Helpers/router-constants';
import { DialogHandlerService } from '../../../CommonServices/dialog-handler.service';
import { ValidationErrorMessagesService } from '../../../CommonServices/ValidationErrorMessagesService/validation-error-messages.service';
import * as Constants from '../../../Helpers/constants';
import { ServerResponseHandelerService } from '../../../CommonServices/server-response-handeler.service';
import { AccountService } from 'src/Services/account.service';
import { Router } from '@angular/router';
import { CustomErrorStateMatcher } from '../../../Helpers/custom-error-state-matcher';
import { ForgetPasswordModel } from '../../../models.model';
import { ModelStateErrors } from 'src/Interfaces/interfaces';
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
  ValidationErrors: ModelStateErrors[] = [];
  loading: boolean = false;
  Routes = Routes;

  //Constructor
  constructor(public formBuilder: FormBuilder, private accountService: AccountService,
    public ValidationErrorMessage: ValidationErrorMessagesService, private router: Router,
    private ServerResponse: ServerResponseHandelerService, public dialogHandler: DialogHandlerService)
  {
  }
  //NgOnInit
  ngOnInit(): void
  {

    this.ForgetPassworForm = this.formBuilder.group({
      email: [null, [Validators.pattern(Constants.ConstRegex.EmailRegex), Validators.required]]
    });
  }

  //new Functions
  OnSubmit()
  {
    this.loading = true;
    const ForgetPasswordModel: ForgetPasswordModel = {
      email: this.ForgetPassworForm.get(Constants.FormControlNames.email)?.value,
      clientUrl: Constants.ClientUrl(Routes.AuthRoutes.ResetPassword)
    };
    this.accountService.ForgetPassword(ForgetPasswordModel).subscribe({
      next: (r) =>
      {
        this.ServerResponse.GeneralSuccessResponse_Swal(r.message);
        this.dialogHandler.CloseDialog();
        this.loading = false;
      },
      error: (e) =>
      {
        this.ValidationErrors = [];
        this.loading = false;
        this.ValidationErrors = this.ServerResponse.GetServerSideValidationErrors(e);
      }
    });
  }
  // CheckIfEmailIsNotFound()
  // {
  //   this.ValidationErrors = [];
  //   this.accountService.IsUserFoundByEmail(this.ForgetPassworForm.get(Constants.AuthConstants.email)?.value)?.subscribe(
  //     {
  //       next: r => { },
  //       error: e =>
  //       {
  //         this.ValidationErrors = [];
  //         if (e.error)
  //           this.ValidationErrors.push({ key: e.error.status, message: e.error.message });
  //         console.log(e);
  //       }
  //     }
  //   );
  // }
}
