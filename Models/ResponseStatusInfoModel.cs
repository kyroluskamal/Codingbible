using System.Net;

namespace CodingBible.Models
{
    public class ResponseStatusInfoModel
    {
        public string Message { get; set; }
        public HttpStatusCode StatusCode { get; set; }
    }
}
