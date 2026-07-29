using Backend.Data;
using Backend.Entities;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ChatRepository : IChatRepository
    {
        private readonly AppDbContext _context;

        public ChatRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddMessageAsync(ChatMessage message)
        {
            await _context.ChatMessages.AddAsync(message);
        }

        public async Task AddSessionAsync(ChatSession session)
        {
            await _context.ChatSessions.AddAsync(session);
        }

        public async Task<List<ChatMessage>> GetMessagesAsync(int sessionId)
        {
            return await _context.ChatMessages.Where(x => x.Id == sessionId).OrderBy(x => x.Id).ToListAsync();
        }

        public async Task<ChatSession?> GetSessionAsync(int sessionId)
        {
            return await _context.ChatSessions.Include(x=> x.Messages).FirstOrDefaultAsync(x=>x.Id == sessionId);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
