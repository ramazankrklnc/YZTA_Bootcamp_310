using System.Text.Json.Serialization;
namespace Backend.Models.Python
{
    public class PythonAgentRequest
    {
        [JsonPropertyName("session_id")]
        public string SessionId { get; set; } = string.Empty;
        [JsonPropertyName("user_question")]
        public string UserQuestion { get; set; } = string.Empty;
    }
}
