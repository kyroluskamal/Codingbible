const version = "v1";
const controllers = {
    account: {
        name: "Account",
        Actions: {
            Login: "Login",
            Register: "Register",
            emailConfrimation: "EmailConfirmation",
            IsLoggedIn: "IsLoggedIn",
            ForgetPassword: "ForgetPassword",
            ResetPassword: "ResetPassword",
            Logout: "Logout"
        }
    }
};
export const AccountController = {
    Login: getApiUrl(version, controllers.account.name, controllers.account.Actions.Login),
    Register: getApiUrl(version, controllers.account.name, controllers.account.Actions.Register),
    emailConfirm: getApiUrl(version, controllers.account.name, controllers.account.Actions.emailConfrimation),
    IsLoggedIn: getApiUrl(version, controllers.account.name, controllers.account.Actions.IsLoggedIn),
    ForgetPassword: getApiUrl(version, controllers.account.name, controllers.account.Actions.ForgetPassword),
    ResetPassword: getApiUrl(version, controllers.account.name, controllers.account.Actions.ResetPassword),
    Logout: getApiUrl(version, controllers.account.name, controllers.account.Actions.Logout)
};

function getApiUrl(version: string, controller: string, action: string): string
{
    return `/api/${version}/${controller}/${action}`;
}