using Backend.Entities;
using Backend.Interfaces;


namespace Backend.Services
{
    public class MessageService : IMessageService
    {

        private readonly IMessageRepository _messageRepository;


        public MessageService(
            IMessageRepository messageRepository
        )
        {
            _messageRepository = messageRepository;
        }




        public async Task<List<ChatMessage>> GetMessagesAsync(
            int sessionId
        )
        {

            return await _messageRepository
                .GetBySessionIdAsync(
                    sessionId
                );

        }

    }
}