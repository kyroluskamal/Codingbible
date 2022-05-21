using AutoMapper;
using CodingBible.Models.Courses;

namespace CodingBible.Services.AutoMapperService;

public class LessonMapperService : Profile
{
    public LessonMapperService()
    {
        CreateMap<Lesson, Lesson>();
    }
}
