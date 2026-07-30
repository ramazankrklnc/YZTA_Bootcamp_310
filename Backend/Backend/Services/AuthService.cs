using Backend.Entities;
using Backend.Helpers;
using Backend.Interfaces;
using Backend.Models;

namespace Backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;

        public AuthService(
            IUserRepository userRepository
        )
        {
            _userRepository = userRepository;
        }


        public async Task<AuthResponse> RegisterAsync(
            RegisterRequest request
        )
        {

            var user =
                await _userRepository.GetByEmailAsync(
                    request.Email
                );


            if (user != null)
            {
                throw new Exception(
                    "Bu email adresi zaten kayıtlı."
                );
            }


            var newUser = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = PasswordHasher.HashPassword(
                    request.Password
                ),
                CreatedAt = DateTime.UtcNow
            };


            await _userRepository.AddAsync(
                newUser
            );

            await _userRepository.SaveAsync();


            return new AuthResponse
            {
                UserId = newUser.Id,
                FullName = newUser.FullName,
                Email = newUser.Email,
                Token = ""
            };
        }



        public async Task<AuthResponse> LoginAsync(
            LoginRequest request
        )
        {

            var user =
                await _userRepository.GetByEmailAsync(
                    request.Email
                );


            if (user == null)
            {
                throw new Exception(
                    "Email veya şifre hatalı."
                );
            }


            bool isCorrect =
                PasswordHasher.VerifyPassword(
                    request.Password,
                    user.PasswordHash
                );


            if (!isCorrect)
            {
                throw new Exception(
                    "Email veya şifre hatalı."
                );
            }


            return new AuthResponse
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Token = ""
            };

        }

    }
}