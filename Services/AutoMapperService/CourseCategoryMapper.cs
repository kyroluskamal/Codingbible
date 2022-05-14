using AutoMapper;
using CodingBible.Models.Courses;

namespace CodingBible.Services.AutoMapperService;

public class CourseCategoryMapper : Profile
{
    public CourseCategoryMapper()
    {
        CreateMap<CourseCategory, CourseCategory>();
    }
}
