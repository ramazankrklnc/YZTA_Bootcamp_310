using Backend.Entities;

namespace Backend.Interfaces
{
    public interface IMessageRepository
    {

        Task<List<ChatMessage>> GetBySessionIdAsync(
            int sessionId
        );

    }
}