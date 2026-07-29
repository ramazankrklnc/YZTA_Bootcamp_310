using Backend.Models.Python;

namespace Backend.Interfaces
{
    public interface IPythonAgentService
    {
        Task<PythonAgentResponse> AskQuestionAsync(
            string question,
            string sessionId
            );
    }
}
