using Backend.Models.Petition;
using Backend.Models.Python;
using Backend.Models.Contract;

namespace Backend.Interfaces
{
    public interface IPythonAgentService
    {

        Task<PythonAgentResponse> AskQuestionAsync(
            string sessionId,
            string question
        );


        Task<PetitionResponse> CreatePetitionAsync(
            string problem
        );

        Task<ContractResponse> AnalyzeContractAsync(
    string contractText
);

    }
}