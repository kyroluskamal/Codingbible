using AutoMapper;
using CodingBible.Models;
using CodingBible.ViewModels;

namespace CodingBible.Services.AutoMapperService
{
    public class AppUserMapper : Profile
    {
        public AppUserMapper()
        {
            CreateMap<RegisterViewModel, ApplicationUser>();
        }
    }
}
