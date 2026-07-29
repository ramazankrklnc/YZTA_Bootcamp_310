using Backend.Models;

namespace Backend.Interfaces
{
    public interface IChatService
    {
        Task<ChatResponse> AskQuestionAsync(
            AskQuestionRequest request,
            int userId
            );
        Task<List<ChatResponse>> GetChatHistoryAsync(
            int sessionId
            );
    }
}
