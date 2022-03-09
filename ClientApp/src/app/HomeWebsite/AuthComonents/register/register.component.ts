import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthRoutes } from '../../../../Helpers/router-constants';
import { DialogHandlerService } from '../../../../CommonServices/dialog-handler.service';
import
{
  ClientUrl, defaultFormAppearance, FormConstants, FormControlNames,
  FormFieldsNames, FormValidationErrors, FormValidationErrorsNames, InputFieldTypes, Password_minlength, validators
} from '../../../../Helpers/constants';
import { CustomErrorStateMatcher } from '../../../../Helpers/custom-error-state-matcher';
import { ClientSideValidationService } from '../../../../CommonServices/client-side-validation.service';
import { CustomValidators } from '../../../../Helpers/custom-validators';
import { IconNamesEnum } from 'ngx-bootstrap-icons';
import { RegisterViewModel } from 'src/models.model';
import { Store } from '@ngrx/store';
import { selectIsInProgress, selectValidationErrors } from 'src/State/AuthState/auth.reducer';
import { IsInProgress, Register } from 'src/State/AuthState/auth.actions';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit
{
  BootstrapIcons = IconNamesEnum;
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
  Password_minlength = Password_minlength;
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
      password: [null, [validators.required, validators.password, validators.minLength_8]],
      confirmpassword: [null,
        [validators.required, validators.minLength_8]
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
