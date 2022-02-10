import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as Routes from '../../../Helpers/router-constants';
import { DialogHandlerService } from '../../../CommonServices/dialog-handler.service';
import { ValidationErrorMessagesService } from '../../../CommonServices/ValidationErrorMessagesService/validation-error-messages.service';
import * as Constants from '../../../Helpers/constants';
import { CustomErrorStateMatcher } from '../../../Helpers/custom-error-state-matcher';
import { LoginViewModel, RegisterViewModel } from '../../../models.model';
import { AccountService } from '../../../Services/account.service';
import { ServerResponseHandelerService } from '../../../CommonServices/server-response-handeler.service';
import { ClientSideValidationService } from '../../../CommonServices/client-side-validation.service';
import { CustomValidators } from '../../../Helpers/custom-validators';
import { ModelStateErrors } from 'src/Interfaces/interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit
{
  Constants = Constants;
  RegisterForm: FormGroup = new FormGroup({});
  customErrorStateMatcher: CustomErrorStateMatcher = new CustomErrorStateMatcher();
  ValidationErrors: ModelStateErrors[] = [];
  loading: boolean = false;
  Routes = Routes;
  FormFieldAppear = new Constants.FormFiledAppearance();
  constructor(public formBuilder: FormBuilder, private accountService: AccountService,
    private ClientSideValidationService: ClientSideValidationService,
    public ValidationErrorMessage: ValidationErrorMessagesService, private router: Router,
    private ServerResponse: ServerResponseHandelerService, public dialogHandler: DialogHandlerService) { }
  @Input() CloseIconHide: boolean = false;
  @Input() ShowCardFooter: boolean = true;

  ngOnInit(): void
  {
    this.RegisterForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.pattern(Constants.ConstRegex.EmailRegex)]],
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
      username: [null, [Validators.required]],
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
    },
      {
        validators: CustomValidators.passwordMatchValidator
      }
    );
  }
  Register()
  {
    let registerObj: RegisterViewModel = new RegisterViewModel();
    this.ClientSideValidationService.FillObjectFromForm(registerObj, this.RegisterForm);
    registerObj.clientUrl = `https://${window.location.host}/${Routes.AuthRoutes.emailConfirmation}`;
    console.log(registerObj);
    this.accountService.Register(registerObj).subscribe({
      next: r => { console.log(r); },
      error: e =>
      {
        this.ValidationErrors = [];
        this.loading = false;
        //add ModelStateErrors
        if (e.error.errors)
          this.ValidationErrors = this.ServerResponse.GetModelStateErrors(e.error.errors);
        else
        {
          this.ValidationErrors.push({ key: e.error.status, message: e.error.message });
        }
        console.log(e);
      }
    });
  }
}
