using Backend.Data;
using Backend.Entities;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class ChatSessionRepository : IChatSessionRepository
    {
        private readonly AppDbContext _context;

        public ChatSessionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ChatSession?> GetByIdAsync(int id)
        {
            return await _context.ChatSessions
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<ChatSession>> GetUserSessionsAsync(int userId)
        {
            return await _context.ChatSessions
                .Where(x => x.UserId == userId)
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task AddAsync(ChatSession session)
        {
            await _context.ChatSessions.AddAsync(session);
        }

        public Task UpdateAsync(ChatSession session)
        {
            _context.ChatSessions.Update(session);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(ChatSession session)
        {
            _context.ChatSessions.Remove(session);
            return Task.CompletedTask;
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
