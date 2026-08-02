using Backend.Entities;

namespace Backend.Interfaces
{
    public interface IChatSessionRepository
    {
        Task<ChatSession?> GetByIdAsync(int id);

        Task<List<ChatSession>> GetUserSessionsAsync(int userId);

        Task AddAsync(ChatSession session);

        Task UpdateAsync(ChatSession session);

        Task DeleteAsync(ChatSession session);

        Task SaveAsync();
    }
}
