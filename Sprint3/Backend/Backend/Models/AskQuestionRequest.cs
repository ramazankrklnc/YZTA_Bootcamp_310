namespace Backend.Models
{
    public class AskQuestionRequest
    {
        public int SessionId { get; set; }
        public string Question { get; set; } = string.Empty;
    }
}
