namespace CodingBible.Models.Posts{
    public class PostsCategory{
        public int PostId { get; set; }
        public Post Posts { get; set; }
        public int CategoryId { get; set; }
        public Category Categories{get; set;}
    }
}