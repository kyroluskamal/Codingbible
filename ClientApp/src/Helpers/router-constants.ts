export const HomeRoutes = {
    Home: "home",
    NotFound: "not-found",
    Courses: {
        Home: "courses",
        Categories: "categories",
        Section: 'section',
        Lesson: 'lesson',
    },
    Blog: {
        Home: "blog",
        Categories: "categories",
    }
};

export const AuthRoutes = {
    account: "account",
    Login: "login",
    Register: "register",
    ForgetPassword: "forget-password",
    ResetPassword: "reset-password",
    emailConfirmation: "emailconfirmation",
};

export const DashboardRoutes = {
    Home: "dashboard",
    Posts: {
        Home: "posts",
        AddPost: "add-post",
        EditPost: "edit-post",
        Categoris: "categories",
    },
    Cateogries: {
        Home: "categories",
    },
    Courses: {
        Home: "courses",
        Categories: "categories",
        Wizard: "wizard",
        Sections: "sections",
        Lessons: {
            Home: "lessons",
            AddLesson: "add-lesson",
            EditLesson: "edit-lesson",
        }
    },
    Appereance: {
        Menus: "menus",
    },

};
export const DashboardRoutesText = {
    DashBoard: "Dashboard",
    Home: "Dashboard",
    Blog: {
        Main: "Blog",
        All: "Posts",
        AddPost: "Add New",
        Categories: "Categories",
    },
    Courses: {
        Main: "LMS",
        All: "Courses",
        Categories: "Categories",
        Wizard: "Wizard",
        Sections: "Sections",
        Lessons: {
            Home: "Lessons",
        }
    },
    Appereance: {
        Main: "Appereance",
        Menus: "Menus",
    }
};