using Backend.Interfaces;
using Backend.Models.Contract;
using Backend.Models.Petition;
using Backend.Models.Python;
using System.Text;
using System.Text.Json;

namespace Backend.Services
{
    public class PythonAgentService : IPythonAgentService
    {

        private readonly HttpClient _httpClient;


        public PythonAgentService(
            HttpClient httpClient
        )
        {
            _httpClient = httpClient;
        }



        public async Task<PythonAgentResponse> AskQuestionAsync(
            string sessionId,
            string question
        )
        {

            var body = new
            {
                session_id = sessionId,
                user_question = question
            };


            var json =
                JsonSerializer.Serialize(body);


            var content =
                new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json"
                );


            var response =
                await _httpClient.PostAsync(
                    "/sor",
                    content
                );


            response.EnsureSuccessStatusCode();


            var result =
                await response.Content.ReadAsStringAsync();



            return JsonSerializer.Deserialize<PythonAgentResponse>(
                result,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }
            )!;

        }





        public async Task<PetitionResponse> CreatePetitionAsync(
            string problem
        )
        {

            var body = new
            {
                user_problem = problem
            };


            var json =
                JsonSerializer.Serialize(body);



            var content =
                new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json"
                );



            var response =
                await _httpClient.PostAsync(
                    "/petition",
                    content
                );



            response.EnsureSuccessStatusCode();



            var result =
                await response.Content.ReadAsStringAsync();



            return JsonSerializer.Deserialize<PetitionResponse>(
                result,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }
            )!;

        }

        public async Task<ContractResponse> AnalyzeContractAsync(
    string contractText
)
        {

            var body = new
            {
                contract_text = contractText
            };


            var json =
                JsonSerializer.Serialize(body);



            var content =
                new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json"
                );



            var response =
                await _httpClient.PostAsync(
                    "/contract/analyze",
                    content
                );


            response.EnsureSuccessStatusCode();



            var result =
                await response.Content.ReadAsStringAsync();



            return JsonSerializer.Deserialize<ContractResponse>(
                result,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }
            )!;

        }

    }
}