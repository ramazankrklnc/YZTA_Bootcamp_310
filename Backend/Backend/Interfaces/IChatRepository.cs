using Backend.Entities;

namespace Backend.Interfaces
{
    public interface IChatRepository
    {
        Task<ChatSession?> GetSessionAsync(
         int sessionId
     );


        Task<List<ChatMessage>> GetMessagesAsync(
            int sessionId
        );


        Task AddSessionAsync(
            ChatSession session
        );


        Task AddMessageAsync(
            ChatMessage message
        );


        Task SaveAsync();

    }
}
