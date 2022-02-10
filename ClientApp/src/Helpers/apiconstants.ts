const version = "v1";
const controllers = {
    account: {
        name: "Account",
        Actions: {
            Login: "Login",
            Register: "Register",
            emailConfrimation: "EmailConfirmation",
            IsUserFoundByEmail: "IsUserFoundByEmail"
        }
    }
};
export const AccountController = {
    Login: getApiUrl(version, controllers.account.name, controllers.account.Actions.Login),
    Register: getApiUrl(version, controllers.account.name, controllers.account.Actions.Register),
    emailConfirm: getApiUrl(version, controllers.account.name, controllers.account.Actions.emailConfrimation),
    IsUserFoundByEmail: getApiUrl(version, controllers.account.name, controllers.account.Actions.IsUserFoundByEmail)
};

function getApiUrl(version: string, controller: string, action: string): string
{
    return `/api/${version}/${controller}/${action}`;
}