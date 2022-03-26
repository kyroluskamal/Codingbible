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
    },
    posts: {
        name: "Posts",
        Actions: {
            GetPosts: "GetPosts",
            AddPost: "AddPost",
            IsSlugUnique: "IsSlugUnique",
            DeletePost: "DeletePost",
            UpdatePost: "UpdatePost",
            GetPostById: "GetPostById",
            ChangStatus: "ChangStatus"
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
export const PostsController = {
    GetPosts: getApiUrl(version, controllers.posts.name, controllers.posts.Actions.GetPosts),
    AddPost: getApiUrl(version, controllers.posts.name, controllers.posts.Actions.AddPost),
    IsSlugUnique: getApiUrl(version, controllers.posts.name, controllers.posts.Actions.IsSlugUnique),
    DeletePost: getApiUrl(version, controllers.posts.name, controllers.posts.Actions.DeletePost),
    UpdatePost: getApiUrl(version, controllers.posts.name, controllers.posts.Actions.UpdatePost),
    GetPostById: getApiUrl(version, controllers.posts.name, controllers.posts.Actions.GetPostById),
    ChangStatus: getApiUrl(version, controllers.posts.name, controllers.posts.Actions.ChangStatus),
};

function getApiUrl(version: string, controller: string, action: string): string
{
    return `https://localhost:5001/api/${version}/${controller}/${action}`;
}