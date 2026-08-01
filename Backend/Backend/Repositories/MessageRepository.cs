using Backend.Data;
using Backend.Entities;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace Backend.Repositories
{
    public class MessageRepository : IMessageRepository
    {

        private readonly AppDbContext _context;


        public MessageRepository(
            AppDbContext context
        )
        {
            _context = context;
        }




        public async Task<List<ChatMessage>> GetBySessionIdAsync(
            int sessionId
        )
        {

            return await _context.ChatMessages
                .Where(x =>
                    x.SessionId == sessionId
                )
                .OrderBy(x =>
                    x.CreatedAt
                )
                .ToListAsync();

        }

    }
}