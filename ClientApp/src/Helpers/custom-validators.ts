import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as Constants from '../Helpers/constants';

export class CustomValidators
{
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn
  {
    return (control: AbstractControl): { [key: string]: any; } | null =>
    {
      if (!control.value)
      {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }


  static validateError(error: ValidationErrors): ValidatorFn
  {
    return (control: AbstractControl): { [key: string]: any; } | null =>
    {
      if (!control.value)
      {
        // if control is empty return no error
        return null;
      }

      // if true, return no error (no error), else return error passed in the second parameter
      return control.invalid ? error : null;
    };
  }
  static OnlyTouched(error: ValidationErrors): ValidatorFn
  {
    return (control: AbstractControl): { [key: string]: any; } | null =>
    {
      if (control.touched)
      {
        // if control is empty return no error
        return null;
      }

      // if true, return no error (no error), else return error passed in the second parameter
      return !control.touched ? error : null;
    };
  }

  static ServerErrorValidations(validationError: any, FormGroup: FormGroup)
  {
    if (validationError.length > 0)
    {
      validationError = JSON.stringify(validationError);
      for (let key in validationError)
      {
        FormGroup.get(key)?.setErrors({ key: true });
      }
    }
  }
  static BadRequestCustomValidation(validationError: any, controlName: string,
    error: ValidationErrors): ValidatorFn
  {
    return (control: AbstractControl): { [key: string]: any; } | null =>
    {
      if (!control.value)
      {
        // if control is empty return no error
        return null;
      }
      if (validationError.length != 0)
      {
        control.get(controlName)?.setErrors(error);
      }
      // if true, return no error (no error), else return error passed in the second parameter
      return control.invalid ? error : null;
    };
  }

  static passwordMatchValidator(control: AbstractControl): { [key: string]: boolean; } | null
  {
    const password: string = control.get(Constants.FormControlNames.password)?.value; // get password from our password form control
    const confirmPassword: string = control.get(Constants.FormControlNames.confirmpassword)?.value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword)
    {
      // if they don't match, set an error in our confirmPassword form control
      control.get(Constants.FormControlNames.confirmpassword)?.setErrors({ NoPassswordMatch: true });
      return { 'NoPassswordMatch': true };
    }
    return null;

  }

  getFormControl(controlName: string, formGroup: FormGroup): FormControl
  {
    return formGroup.get(controlName) as FormControl;
  }

  getErrorMessage(controlName: string, errorType: string)
  {
    switch (controlName)
    {
      case "Email": {
        if (errorType == "required") return "<strong>Email</strong> is required";
        else if (errorType == "email") return "You have to <strong>enter valid Email</strong>";
        else if (errorType == "pattern") return "You have to <strong>enter valid Email</strong>";
        break;
      }
      case "Password": {
        if (errorType == "required") return "<strong>Password</strong> is required";
        else if (errorType == "hasNumber") return "Password should have <strong> at least one number</strong>";
        else if (errorType == "hasCapitalCase") return "Password should have <strong> at least one Capital letter</strong>";
        else if (errorType == "hasSmallCase") return "Password should have <strong> at least one Small letter</strong>";
        else if (errorType == "minlength") return "Password should <strong> at least 8 characters long</strong>";
        else if (errorType == "hasSpecialCharacters") return "Password should have <strong> at least one special character</strong>";
        break;
      }
      case "ConfirmPassword": {
        if (errorType == "required") return "<strong>Password Confirmation</strong> is required";
        else if (errorType == "NoPassswordMatch") return "Passowrd do not match";
        break;
      }
      case "CompanyName": {
        if (errorType == "required") return "<strong>Company Name</strong> is required";
        break;
      }
      case "Subdomain": {
        if (errorType == "required") return "<strong>Subdomain</strong> is required";
        if (errorType == "SubdomainExist") return "<strong>Already taken</strong>.Please,Choose another one";
        break;
      }
      case "Username": {
        if (errorType == "required") return "<strong>Username</strong> is required";
        break;
      }
    }
    return "";
  }
}
