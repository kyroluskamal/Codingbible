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
    isActive: boolean = false;
    rememberMe: boolean = true;
    clientUrl: string = "";
}
export class HttpResponsesObject
{
    status: string = "";
    message: any;
}

export class ForgetPasswordModel
{
    email: string = "";
    clientUrl: string = "";
}