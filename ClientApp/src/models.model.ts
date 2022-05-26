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
    post?: Post | null = null;
    attachmentId: number = 0;
    attachment?: Attachments | null = null;
}

export class Menu
{
    id: number = 0;
    name: string = "";
    menuPositionsId: number = 0;
    menuPositions: MenuPositions | null = null;
    menuItems: MenuItem[] = [];
}
export class MenuItem
{
    id: number = 0;
    name: string = "";
    url: string = "";
    level: number = 0;
    orderWithinParent: number = 0;
    parentKey: number | null = null;
    parent: MenuItem | null = null;
    associatedMenus: MenuMenuItems[] = [];
    orderInMenu: number = 0;

}
export class MenuMenuItems
{
    menuItemId: number = 0;
    menuItem: MenuItem | null = null;
    menuId: number = 0;
    menu: Menu | null = null;
}
export class MenuPositions
{
    id: number = 0;
    name: string = "";
}

export class Course
{
    id: number = 0;
    name: string = "";
    title: string = "";
    slug: string = "";
    status: number = 0;
    numberOfStudents: number = 0;
    max_NumberOfStudents: number = 0;
    needsEnrollment: boolean = false;
    hasQASection: boolean = false;
    description: string = "";
    whatWillYouLearn: string = "";
    targetAudience: string = "";
    requirementsOrInstructions: string = "";
    courseFeatures: string = "";
    difficultyLevel: number = 0;
    featureImageUrl: string = "";
    dateCreated: Date = new Date();
    lastModified: Date = new Date();
    introductoryVideoUrl: string = "";
    authorId: number = 0;
    categories: number[] = [];
    author: ApplicationUser | null = null;
    coursesPerCategories: CoursesPerCategory[] = [];
    students: StudentsPerCourse[] = [];
}

export class CourseCategory
{
    id: number = 0;
    name: string = "";
    slug: string = "";
    title: string = "";
    description: string = "";
    level: number = 0;
    courseCount: number = 0;
    parentKey: number | null = null;
    parent: CourseCategory | null = null;
    coursesPerCategories: CoursesPerCategory[] = [];
}
export class CoursesPerCategory
{
    courseId: number = 0;
    course: Course | null = null;
    courseCategoryId: number = 0;
    courseCategory: CourseCategory | null = null;
}

export class StudentsPerCourse
{
    courseId: number = 0;
    course: Course | null = null;
    studentId: number = 0;
    student: ApplicationUser | null = null;
}

export class Lesson
{
    id: number = 0;
    name: string = "";
    title: string = "";
    slug: string = "";
    description: string = "";
    vedioUrl: string = "";
    status: number = 0;
    orderWithinSection: number = 0;
    htmlContent: string = "";
    sectionId: number = 0;
    section: Section | null = null;
}
export class Section
{
    id: number = 0;
    name: string = "";
    title: string = "";
    description: string = "";
    slug: string = "";
    courseId: number = 0;
    course: Course | null = null;
    order: number = 0;
    level: number = 0;
    status: number = 0;
    featureImageUrl: string = "";
    whatWillYouLearn: string = "";
    isLeafSection: boolean = false;
    introductoryVideoUrl: string = "";
    parentKey: number | null = null;
    parent: Section | null = null;
}