using Backend.Data;
using Backend.Entities;
using Backend.Interfaces;
using Backend.Models;

namespace Backend.Services
{
    public class ChatService : IChatService
    {

        private readonly IChatSessionRepository _sessionRepository;
        private readonly IChatMessageRepository _messageRepository;
        private readonly IPythonAgentService _pythonAgentService;
        public ChatService(
            IChatSessionRepository sessionRepository,
            IChatMessageRepository messageRepository,
            IPythonAgentService pythonAgentService
        )
        {
            _sessionRepository = sessionRepository;
            _messageRepository = messageRepository;
            _pythonAgentService = pythonAgentService;
        }

        public async Task<ChatResponse> AskQuestionAsync(
            AskQuestionRequest request,
            int userId
        )
        {

            // Session kontrolü

            var session =
                await _sessionRepository.GetByIdAsync(
                    request.SessionId
                );


            if (session == null)
            {
                throw new Exception(
                    "Chat session bulunamadı."
                );
            }



            // Kullanıcı mesajını kaydet

            var userMessage = new ChatMessage
            {
                SessionId = session.Id,
                Role = "user",
                Content = request.Question,
                CreatedAt = DateTime.UtcNow
            };


            await _messageRepository.AddAsync(
                userMessage
            );


            await _messageRepository.SaveAsync();



            // Python Agent çağır

            var agentResult =
                await _pythonAgentService.AskQuestionAsync(
                    session.Id.ToString(),
                    request.Question
                );



            // AI cevabını kaydet

            var assistantMessage = new ChatMessage
            {
                SessionId = session.Id,
                Role = "assistant",
                Content = agentResult.Answer,
                CreatedAt = DateTime.UtcNow
            };


            await _messageRepository.AddAsync(
                assistantMessage
            );


            await _messageRepository.SaveAsync();



            // Response dön

            return new ChatResponse
            {
                SessionId = session.Id,

                Answer = agentResult.Answer,

                Score = agentResult.Score,

                IsValid = agentResult.IsSucces
            };

        }



        public async Task<List<ChatResponse>> GetChatHistoryAsync(
            int sessionId
        )
        {

            var messages =
                await _messageRepository.GetMessagesAsync(
                    sessionId
                );


            var response = new List<ChatResponse>();


            foreach (var message in messages)
            {

                response.Add(
                    new ChatResponse
                    {
                        SessionId = sessionId,

                        Answer = message.Content,

                        Score = 0,

                        IsValid = true
                    }
                );

            }


            return response;

        }

    }
}
