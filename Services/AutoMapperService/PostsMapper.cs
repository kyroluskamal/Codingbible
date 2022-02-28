using AutoMapper;
using CodingBible.Models.Posts;

namespace CodingBible.Services.AutoMapperService
{
    public class PostsMapper : Profile
    {
        public PostsMapper()
        {
            CreateMap<Post, Post>();
        }
    }
}