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
    title: string = "";
    slug: string = "";
    description: string = "";
    level: number = 0;
    postCount: number = 0;
    parentKey: number | null = null;
    parent: any;
    postsCategories: PostsCategory[] = [];
}

export class PostsCategory
{
    postId: number = 0;
    posts?: Post = new Post();
    categoryId: number = 0;
    categories?: Category = new Category();
}

export class Post
{
    id: number = 0;
    title: string = "";
    slug: string = "";
    htmlContent: string = "";
    authorId: number | null = 0;
    author: any;
    dateCreated: Date = new Date();
    lasModified: Date = new Date();
    publishedDate: Date = new Date();
    status: number = 0;
    excerpt: string = "";
    description: string = "";
    commentStatus: boolean = false;
    commentCount: number = 0;
    featureImageUrl: string = "";
    editFrequency: string = "";
    priority: number = 0;
    categories: number[] = [];
    postsCategories: PostsCategory[] = [];
    attachments: PostAttachments[] = [];
}

export class Attachments
{
    id: number = 0;
    fileName: string = "";
    fileUrl: string = "";
    thumbnailUrl: string = "";
    fileType: string = "";
    fileExtension: string = "";
    caption: string = "";
    title: string = "";
    altText: string = "";
    description: string = "";
    fileSize: number = 0;
    createdDate: Date = new Date();
    width: string = "";
    height: string = "";
    posts: PostAttachments[] = [];
}

export class PostAttachments
{
    postId: number = 0;
    post: Post = new Post();
    attachmentId: number = 0;
    attachment: Attachments = new Attachments();
}
