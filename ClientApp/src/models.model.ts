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
    tokenExpire: string = "";
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
    firstname: string;
    lastname: string;
    email: string;
}

export class Category
{
    id: number = 0;
    name: string = "";
    sulg: string = "";
    description: string = "";
    postCount: number = 0;
    parentKey: number = 0;
    parent: any;
    postsCategories: PostsCategory[] = [];
}

export class PostsCategory
{
    postId: number = 0;
    posts: Post = new Post();
    categoryId: number = 0;
    categories: Category = new Category();
}

export class Post
{
    id: number = 0;
    title: string = "";
    slug: string = "";
    htmlContent: string = "";
    authorId: number = 0;
    author: any;
    dateCreated: Date = new Date();
    lasModified: Date = new Date();
    publishedDate: Date = new Date();
    status: number = 0;
    excerpt: string = "";
    description: string = "";
    commentStatus: boolean = false;
    commentCount: number = 0;
    postsCategories: PostsCategory[] = [];
}