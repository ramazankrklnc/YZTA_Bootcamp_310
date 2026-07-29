using Backend.Models;

namespace Backend.Interfaces
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(RegisterRequest request);
        Task<string?> LoginAsync(LoginRequest request); 
    }
}
