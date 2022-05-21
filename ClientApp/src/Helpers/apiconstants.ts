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
            ChangStatus: "ChangStatus",
            GetAllCategories: "GetAllCategories",
            GetCategoryBySlug: "GetCategoryBySlug",
            AddCategory: "AddCategory",
            UpdateCategory: "UpdateCategory",
            DeleteCategory: "DeleteCategory",
            IsCatSlug_NOT_Unique: "IsCatSlug_NOT_Unique",
        }
    },
    media: {
        name: "Media",
        Actions: {
            Upload: "Upload",
            GetAll: "GetAll",
            Delete: "Delete",
            Update: "Update",
            BindAttachmentToPost: "BindAttachmentToPost",
            DeleteFromPost: "DeleteFromPost",
        }
    },
    menus: {
        name: "Menu",
        Actions: {
            GetMenus: "GetMenus",
        }
    },
    Courses: {
        name: "Courses",
        Actions: {
            GetAllCourses: "GetAllCourses",
            GetAllCategories: "GetAllCategories",
            GetCategoryBySlug: "GetCategoryBySlug",
            AddCategory: "AddCategory",
            UpdateCategory: "UpdateCategory",
            DeleteCategory: "DeleteCategory",
            IsCatSlug_NOT_Unique: "IsCatSlug_NOT_Unique",
            AddCourse: "AddCourse",
            UpdateCourse: "UpdateCourse",
            DeleteCourse: "DeleteCourse",
            ChangStatus: "ChangStatus",
            IsSlugUnique: "IsSlugUnique",
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
    GetAllCategories: getApiUrl(version, controllers.posts.name, controllers.posts.Actions.GetAllCategories),
    GetCategoryBySlug: getApiUrl(version, controllers.posts.name, controllers.posts.Actions.GetCategoryBySlug),
    AddCategory: getApiUrl(version, controllers.posts.name, controllers.posts.Actions.AddCategory),
    UpdateCategory: getApiUrl(version, controllers.posts.name, controllers.posts.Actions.UpdateCategory),
    DeleteCategory: getApiUrl(version, controllers.posts.name, controllers.posts.Actions.DeleteCategory),
    IsCatSlug_NOT_Unique: getApiUrl(version, controllers.posts.name, controllers.posts.Actions.IsCatSlug_NOT_Unique),
};
export const MediaController = {
    Upload: getApiUrl(version, controllers.media.name, controllers.media.Actions.Upload),
    GetAll: getApiUrl(version, controllers.media.name, controllers.media.Actions.GetAll),
    Delete: getApiUrl(version, controllers.media.name, controllers.media.Actions.Delete),
    Update: getApiUrl(version, controllers.media.name, controllers.media.Actions.Update),
    BindAttachmentToPost: getApiUrl(version, controllers.media.name, controllers.media.Actions.BindAttachmentToPost),
    DeleteFromPost: getApiUrl(version, controllers.media.name, controllers.media.Actions.DeleteFromPost),
};
export const MenusController = {
    GetMenus: getApiUrl(version, controllers.menus.name, controllers.menus.Actions.GetMenus),
};

export const CoursesController = {
    GetAllCourses: getApiUrl(version, controllers.Courses.name, controllers.Courses.Actions.GetAllCourses),
    GetAllCategories: getApiUrl(version, controllers.Courses.name, controllers.Courses.Actions.GetAllCategories),
    GetCategoryBySlug: getApiUrl(version, controllers.Courses.name, controllers.Courses.Actions.GetCategoryBySlug),
    AddCategory: getApiUrl(version, controllers.Courses.name, controllers.Courses.Actions.AddCategory),
    UpdateCategory: getApiUrl(version, controllers.Courses.name, controllers.Courses.Actions.UpdateCategory),
    DeleteCategory: getApiUrl(version, controllers.Courses.name, controllers.Courses.Actions.DeleteCategory),
    IsCatSlug_NOT_Unique: getApiUrl(version, controllers.Courses.name, controllers.Courses.Actions.IsCatSlug_NOT_Unique),
    AddCourse: getApiUrl(version, controllers.Courses.name, controllers.Courses.Actions.AddCourse),
    UpdateCourse: getApiUrl(version, controllers.Courses.name, controllers.Courses.Actions.UpdateCourse),
    DeleteCourse: getApiUrl(version, controllers.Courses.name, controllers.Courses.Actions.DeleteCourse),
    ChangStatus: getApiUrl(version, controllers.Courses.name, controllers.Courses.Actions.ChangStatus),
    IsSlugUnique: getApiUrl(version, controllers.Courses.name, controllers.Courses.Actions.IsSlugUnique),
};

function getApiUrl(version: string, controller: string, action: string): string
{
    return `https://localhost:5001/api/${version}/${controller}/${action}`;
}