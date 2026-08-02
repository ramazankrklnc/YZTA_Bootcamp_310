namespace Backend.Models.Petition
{
    public class PetitionResponse
    {
        public string Petition { get; set; } = string.Empty;

        public List<string> MissingFields { get; set; } = new();
    }
}