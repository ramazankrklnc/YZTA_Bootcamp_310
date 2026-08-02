using Backend.Entities;

namespace Backend.Interfaces
{
    public interface IChatMessageRepository
    {
        Task<List<ChatMessage>> GetMessagesAsync(int sessionId);

        Task AddAsync(ChatMessage message);

        Task SaveAsync();
    }
}
