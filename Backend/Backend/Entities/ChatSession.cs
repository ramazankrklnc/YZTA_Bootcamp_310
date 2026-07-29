namespace Backend.Entities
{
    public class ChatSession
    {
        public int Id { get; set; }


        public int UserId { get; set; }


        public string Title { get; set; }


        public DateTime CreatedAt { get; set; }



        public User User { get; set; }


        public ICollection<ChatMessage> Messages { get; set; }
    }
}
