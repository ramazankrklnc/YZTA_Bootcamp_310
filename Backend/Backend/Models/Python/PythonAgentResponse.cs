using System.Text.Json.Serialization;
namespace Backend.Models.Python
{
    public class PythonAgentResponse
    {
        [JsonPropertyName("session_id")]
        public string SessionId { get; set; } = string.Empty;
        [JsonPropertyName("answer")]

        public string Answer { get; set; } = string.Empty;
        [JsonPropertyName("score")]

        public int Score { get; set; }
        [JsonPropertyName("is_succes")]

        public bool IsSucces { get; set; }
        [JsonPropertyName("memory_cache")]

        public int MemoryCache { get; set; }
    }
}
