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
import { CustomValidators } from '../../../Helpers/custom-validators';

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
  ValidationErrors: any[] = [];
  loading: boolean = false;
  Routes = Routes;
  FormFieldAppear = new Constants.FormFiledAppearance();
  constructor(public formBuilder: FormBuilder, private accountService: AccountService,
    public ValidationErrorMessage: ValidationErrorMessagesService, private router: Router,
    private ServerResponse: ServerResponseHandelerService, public dialogHandler: DialogHandlerService) { }
  @Input() CloseIconHide: boolean = false;
  ngOnInit(): void
  {
    this.RegisterForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.pattern(Constants.ConstRegex.EmailRegex)]],
      password: [null, Validators.compose([
        Validators.required,
        CustomValidators.patternValidator(/\d/, { hasNumber: true }),
        CustomValidators.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
        CustomValidators.patternValidator(/[a-z]/, { hasSmallCase: true }),
        CustomValidators.patternValidator(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, { hasSpecialCharacters: true }),
        Validators.minLength(8)])
      ],
      confirmpassword: [null, [Validators.required]],
      username: [null, [Validators.required]],
      phonenumber: [null, [Validators.required, Validators.pattern(Constants.ConstRegex.PhoneRegex)]],
    },
      {
        validators: CustomValidators.passwordMatchValidator
      });
  }
  Register()
  {

  }
}
