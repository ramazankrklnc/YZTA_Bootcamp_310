using Backend.Entities;

namespace Backend.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);

        Task<User?> GetByIdAsync(int id);

        Task AddAsync(User user);

        Task<bool> ExistsAsync(string email);

        Task SaveAsync();
    }
}
