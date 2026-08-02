namespace Backend.Entities
{
    public class ChatMessage
    {
        public int Id { get; set; }


        public int SessionId { get; set; }


        public string Role { get; set; }


        public string Content { get; set; }


        public DateTime CreatedAt { get; set; }



        public ChatSession ChatSession { get; set; }
    }
}
