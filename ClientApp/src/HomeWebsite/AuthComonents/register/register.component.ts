import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Routes from '../../../Helpers/router-constants';
import { DialogHandlerService } from '../../../CommonServices/dialog-handler.service';
import * as Constants from '../../../Helpers/constants';
import { CustomErrorStateMatcher } from '../../../Helpers/custom-error-state-matcher';
import { ClientSideValidationService } from '../../../CommonServices/client-side-validation.service';
import { CustomValidators } from '../../../Helpers/custom-validators';
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
  Constants = Constants;
  RegisterForm: FormGroup = new FormGroup({});
  customErrorStateMatcher: CustomErrorStateMatcher = new CustomErrorStateMatcher();
  ValidationErrors = this.store.select(selectValidationErrors);
  loading = this.store.select(selectIsInProgress);
  Routes = Routes;
  constructor(public formBuilder: FormBuilder, private store: Store,
    private ClientSideValidationService: ClientSideValidationService,
    public dialogHandler: DialogHandlerService) { }
  @Input() CloseIconHide: boolean = false;
  @Input() ShowCardFooter: boolean = true;

  ngOnInit(): void
  {
    this.RegisterForm = this.formBuilder.group({
      email: [null,
        [Validators.required, Validators.email, Validators.pattern(Constants.ConstRegex.EmailRegex)]
      ],
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
      username: [null,
        [Validators.required]
      ],
      firstname: [null,
        [Validators.required]
      ],
      lastname: [null,
        [Validators.required]
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
    registerObj.clientUrl = Constants.ClientUrl(Routes.AuthRoutes.emailConfirmation);
    this.store.dispatch(IsInProgress({ isLoading: true }));
    this.store.dispatch(Register(registerObj));
  }
}
