namespace Backend.Models.Python
{
    public class PythonAgentResponse
    {
        public string SessionId { get; set; } = string.Empty;

        public string Answer { get; set; } = string.Empty;

        public int Score { get; set; }

        public bool IsSucces { get; set; }

        public int MemoryCache { get; set; }
    }
}
