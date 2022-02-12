export interface LoginViewModel
{
    email: string;
    password: string;
    rememberMe: boolean;
}
export class RegisterViewModel
{
    email: string = "";
    username: string = "";
    password: string = "";
    confirmpassword: string = "";
    firstname: string = "";
    lastname: string = "";
    isActive: boolean = true;
    rememberMe: boolean = false;
    clientUrl: string = "";
}
export class HttpResponsesObject
{
    status: string = "";
    message: any;
    data: any;
}

export class ForgetPasswordModel
{
    email: string = "";
    clientUrl: string = "";
}

export class ResetPasswordModel
{
    email: string = "";
    token: string = "";
    password: string = "";
    confirmPassword: string = "";
}

export interface ApplicationUser
{
    id: number;
    userName: string;
    Firstname: string;
    Lastname: string;
    email: string;
}