using AutoMapper;
using CodingBible.Models.Courses;

namespace CodingBible.Services.AutoMapperService;

public class CoursesMapper : Profile
{
    public CoursesMapper()
    {
        CreateMap<Course, Course>();
    }
}
