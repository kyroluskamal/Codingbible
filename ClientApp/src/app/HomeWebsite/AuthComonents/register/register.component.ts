import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthRoutes } from '../../../../Helpers/router-constants';
import { DialogHandlerService } from '../../../../CommonServices/dialog-handler.service';
import
{
  ClientUrl, defaultFormAppearance, FormConstants, FormControlNames,
  FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, PASSWORD_MINLENGTH, validators
} from '../../../../Helpers/constants';
import { CustomErrorStateMatcher } from '../../../../Helpers/custom-error-state-matcher';
import { ClientSideValidationService } from '../../../../CommonServices/client-side-validation.service';
import { CustomValidators } from '../../../../Helpers/custom-validators';
import { RegisterViewModel } from 'src/models.model';
import { Store } from '@ngrx/store';
import { selectIsInProgress, selectValidationErrors } from 'src/State/AuthState/auth.reducer';
import { IsInProgress, Register } from 'src/State/AuthState/auth.actions';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit
{
  RegisterForm: FormGroup = new FormGroup({});
  customErrorStateMatcher: CustomErrorStateMatcher = new CustomErrorStateMatcher();
  ValidationErrors = this.store.select(selectValidationErrors);
  FormControlNames = FormControlNames;
  InputFieldTypes = InputFieldTypes;
  FormFieldsNames = FormFieldsNames;
  defaultFormAppearance = defaultFormAppearance;
  FormValidationErrorsNames = FormValidationErrorsNames;
  FormValidationErrors = FormValidationErrors;
  FormConstants = FormConstants;
  AuthRoutes = AuthRoutes;
  PASSWORD_MINLENGTH = PASSWORD_MINLENGTH;
  loading = this.store.select(selectIsInProgress);
  constructor(public formBuilder: FormBuilder, public store: Store,
    private ClientSideValidationService: ClientSideValidationService,
    public dialogHandler: DialogHandlerService) { }
  @Input() CloseIconHide: boolean = false;
  @Input() ShowCardFooter: boolean = true;

  ngOnInit(): void
  {
    this.RegisterForm = this.formBuilder.group({
      email: [null,
        [validators.required, validators.email]
      ],
      password: [null, [validators.required, validators.password, validators.PASSWORD_MIN_LENGTH]],
      confirmpassword: [null,
        [validators.required, validators.PASSWORD_MIN_LENGTH]
      ],
      username: [null,
        [validators.required]
      ],
      firstname: [null,
        [validators.required]
      ],
      lastname: [null,
        [validators.required]
      ],
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
    registerObj.clientUrl = ClientUrl(AuthRoutes.emailConfirmation);
    this.store.dispatch(IsInProgress({ isLoading: true }));
    this.store.dispatch(Register(registerObj));
  }
}
