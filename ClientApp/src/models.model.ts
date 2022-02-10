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