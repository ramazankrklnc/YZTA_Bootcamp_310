using Backend.Entities;

namespace Backend.Interfaces
{
    public interface ISessionService
    {
        Task<ChatSession> CreateSessionAsync(
            int userId
        );


        Task<List<ChatSession>> GetUserSessionsAsync(
            int userId
        );


        Task<bool> DeleteSessionAsync(
            int sessionId,
            int userId
        );
    }
}