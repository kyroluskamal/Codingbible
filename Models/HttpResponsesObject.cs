namespace CodingBible.Models
{
    public class HttpResponsesObject
    {
        public HttpResponsesObject(string status, dynamic message, dynamic data=null)
        {
            Status = status;
            Message = message;
            Data = data;
        }

        public string Status { get; set; }
        public dynamic Message { get; set; }
        public dynamic Data { get; set; }
    }
}
