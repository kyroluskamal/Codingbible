using AutoMapper;
using CodingBible.Models;

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
