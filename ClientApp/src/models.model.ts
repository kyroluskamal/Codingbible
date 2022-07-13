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
    isArabic: boolean = false;
    otherSlug: string | null = null;
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
    tempAttach: number[] = [];
    postsCategories: PostsCategory[] = [];
    attachments: PostAttachments[] = [];
    isArabic: boolean = false;
    otherSlug: string | null = null;
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
    menuLocationsId: number = 0;
    menuLocations: MenuLocations | null = null;
    menuItems: MenuItem[] = [];
    menuItemToEdit: MenuItem | null = null;
    menuItemToAdd: MenuItem | null = null;
    menuLocationsName: string = "";
}
export class MenuItem
{
    id?: number = 0;
    enName: string = "";
    enUrl: string = "";
    arName: string = "";
    arUrl: string = "";
    level: number = 0;
    orderWithinParent: number = 0;
    orderWithMenu: number = 0;
    parentKey: number | null = null;
    parent: MenuItem | null = null;
    menuId: number = 0;
    menu: Menu | null = null;
}

export class MenuLocations
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
    isArabic: boolean = false;
    otherSlug: string | null = null;
    categoriesObject: CourseCategory[] = [];
    lessons: Lesson[] = [];
    sections: Section[] = [];
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
    isArabic: boolean = false;
    otherSlug: string | null = null;
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
    nameSlugFragment: string = "";
    featureImageUrl: string = "";
    htmlContent: string = "";
    sectionId: number = 0;
    section: Section | null = null;
    courseId: number = 0;
    dateCreated: Date = new Date();
    lasModified: Date = new Date();
    publishedDate: Date = new Date();
    attachments: LessonAttachments[] = [];
    tempAttach: number[] = [];
    isArabic: boolean = false;
    otherSlug: string | null = null;
}
export class Section
{
    id: number = 0;
    name: string = "";
    nameSlugFragment: string = "";
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
    isArabic: boolean = false;
    otherSlug: string | null = null;
}
export class LessonAttachments
{
    lessonId: number = 0;
    lesson?: Lesson | null = null;
    attachmentId: number = 0;
    attachments?: Attachments | null = null;
}
export class SlugMap_Courses
{
    id: number = 0;
    enSlug: string = "";
    arSlug: string = "";
    CourseId: number = 0;
    Course: Course | null = null;
}
export class SlugMap_Posts
{
    id: number = 0;
    enSlug: string = "";
    arSlug: string = "";
    PostId: number = 0;
    Post: Post | null = null;
}
export class SlugMap_Category
{
    id: number = 0;
    enSlug: string = "";
    arSlug: string = "";
    CategoryId: number = 0;
    Category: Category | null = null;
}
export class SlugMap_CourseCategory
{
    id: number = 0;
    enSlug: string = "";
    arSlug: string = "";
    CourseCategoryId: number = 0;
    CourseCategory: CourseCategory | null = null;
}
export class SlugMap_Sections
{
    id: number = 0;
    enSlug: string = "";
    arSlug: string = "";
    SectionId: number = 0;
    Section: Section | null = null;
}
export class SlugMap_Lessons
{
    id: number = 0;
    enSlug: string = "";
    arSlug: string = "";
    LessonId: number = 0;
    Lesson: Lesson | null = null;
}