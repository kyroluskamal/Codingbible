using AutoMapper;
using CodingBible.Models.Courses;

namespace CodingBible.Services.AutoMapperService;

public class CourseSectionMapper : Profile
{
    public CourseSectionMapper()
    {
        CreateMap<Section, Section>();
    }
}