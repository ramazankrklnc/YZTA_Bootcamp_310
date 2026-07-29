using Backend.Entities;
using Backend.Interfaces;

namespace Backend.Services
{
    public class SessionService : ISessionService
    {

        private readonly IChatSessionRepository _sessionRepository;


        public SessionService(
            IChatSessionRepository sessionRepository
        )
        {
            _sessionRepository = sessionRepository;
        }



        public async Task<ChatSession> CreateSessionAsync(
            int userId
        )
        {

            var session = new ChatSession
            {
                UserId = userId,

                Title = "Yeni Sohbet",

                CreatedAt = DateTime.UtcNow
            };


            await _sessionRepository.AddAsync(
                session
            );


            await _sessionRepository.SaveAsync();


            return session;
        }



        public async Task<List<ChatSession>> GetUserSessionsAsync(
            int userId
        )
        {

            return await _sessionRepository
                .GetUserSessionsAsync(
                    userId
                );

        }



        public async Task<bool> DeleteSessionAsync(
            int sessionId,
            int userId
        )
        {

            var session =
                await _sessionRepository.GetByIdAsync(
                    sessionId
                );


            if (session == null)
            {
                return false;
            }



            if (session.UserId != userId)
            {
                return false;
            }



            await _sessionRepository.DeleteAsync(
                session
            );


            await _sessionRepository.SaveAsync();


            return true;
        }

    }
}