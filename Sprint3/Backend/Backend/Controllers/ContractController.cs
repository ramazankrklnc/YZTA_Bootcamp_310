using Backend.Interfaces;
using Backend.Models.Contract;
using Microsoft.AspNetCore.Mvc;


namespace Backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class ContractController : ControllerBase
    {

        private readonly IPythonAgentService _pythonAgentService;


        public ContractController(
            IPythonAgentService pythonAgentService
        )
        {
            _pythonAgentService = pythonAgentService;
        }



        [HttpPost("analyze")]
        public async Task<IActionResult> Analyze(
            ContractRequest request
        )
        {

            try
            {

                var result =
                    await _pythonAgentService
                    .AnalyzeContractAsync(
                        request.ContractText
                    );


                return Ok(result);

            }
            catch (Exception ex)
            {

                return BadRequest(
                    new
                    {
                        message = ex.Message
                    }
                );

            }

        }

    }

}