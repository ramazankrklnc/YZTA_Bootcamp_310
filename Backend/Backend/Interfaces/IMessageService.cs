using Backend.Entities;

namespace Backend.Interfaces
{
    public interface IMessageService
    {

        Task<List<ChatMessage>> GetMessagesAsync(
            int sessionId
        );

    }
}