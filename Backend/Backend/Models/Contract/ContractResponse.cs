namespace Backend.Models.Contract
{
    public class ContractResponse
    {
        public bool Success { get; set; }

        public int RiskScore { get; set; }

        public object Analysis { get; set; }

    }
}