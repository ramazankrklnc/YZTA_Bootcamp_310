namespace Backend.Models
{
    public class ChatResponse
    {
        public int SessionId { get; set; }

        public string Answer { get; set; } = string.Empty;

        public int Score { get; set; }

        public bool IsValid { get; set; }
    }
}
