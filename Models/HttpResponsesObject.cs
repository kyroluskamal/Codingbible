namespace CodingBible.Models
{
    public class HttpResponsesObject
    {
        public HttpResponsesObject(string status, dynamic message)
        {
            Status = status;
            Message = message;
        }

        public string Status { get; set; }
        public dynamic Message { get; set; }
    }
}
