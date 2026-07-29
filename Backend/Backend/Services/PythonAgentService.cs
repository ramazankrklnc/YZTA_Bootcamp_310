using Backend.Interfaces;
using Backend.Models.Python;
using System.Text.Json;
using System.Text;

namespace Backend.Services
{
    public class PythonAgentService : IPythonAgentService
    {
        private readonly HttpClient _httpClient;

        public PythonAgentService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<PythonAgentResponse> AskQuestionAsync(
            string sessionId,
            string question)
        {
            var request = new PythonAgentRequest
            {
                SessionId = sessionId,
                UserQuestion = question
            };

            var json = JsonSerializer.Serialize(request);

            var content = new StringContent(
                json,
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(
                "/sor",
                content
            );

            response.EnsureSuccessStatusCode();

            var responseJson =
                await response.Content.ReadAsStringAsync();

            var result =
                JsonSerializer.Deserialize<PythonAgentResponse>(
                    responseJson,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

            return result!;
        }
    }
}
