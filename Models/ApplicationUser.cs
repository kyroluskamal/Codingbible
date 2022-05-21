﻿using CodingBible.Models.Posts;
using CodingBible.Models.Courses;
using Microsoft.AspNetCore.Identity;

namespace CodingBible.Models
{
    public class ApplicationUser : IdentityUser<int>
    {
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public bool IsActive { get; set; }
        public bool RememberMe { get; set; }
        public virtual ICollection<Post> Post { get; set; }
        public virtual ICollection<Course> Course { get; set; }
        public virtual ICollection<StudentsPerCourse> Courses { get; set; }
    }
}