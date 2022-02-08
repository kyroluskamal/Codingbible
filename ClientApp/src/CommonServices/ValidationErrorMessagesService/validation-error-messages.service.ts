import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationErrorMessagesService {

  constructor() { }

  getFormControl(controlName: string, formGroup: FormGroup): AbstractControl {
    return formGroup.get(controlName) as FormControl;
  }

  getErrorMessage(controlName: string, errorType: string) {
    switch (controlName) {
      case "Email": {
        if (errorType == "required") return "<strong>Email</strong> is required";
        else if (errorType == "email") return "You have to <strong>enter valid Email</strong>";
        else if (errorType == "pattern") return "You have to <strong>enter valid Email</strong>";
        break;
      }
      case "LastName": {
        if (errorType == "required") return "<strong>Last Name</strong> is required";
        break;
      }
      case "FirstName": {
        if (errorType == "required") return "<strong>First Name</strong> is required";
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
        else if (errorType == "EnglishName") return "Enter Your Company name in English";
        break;
      }
      case "Subdomain": {
        if (errorType == "required") return "<strong>Subdomain</strong> is required";
        if (errorType == "SubdomainExist") return "<strong>Already taken</strong>.Please,Choose another one";
        break;
      }
      case "Username": {
        if (errorType == "required") return "<strong>Username</strong> is required";
        if (errorType == "UserName") return "<strong>Username</strong> is required";
        break;
      }
      case "CatName": {
        if (errorType == "required") return "<strong>Main category name</strong> is required";
        break;
      }
      case "SubCatName": {
        if (errorType == "required") return "<strong>Subcategory name</strong> is required";
        break;
      }
    }
    return "";
  }
}
