using Backend.Interfaces;
using Backend.Models.Petition;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PetitionController : ControllerBase
    {

        private readonly IPythonAgentService _pythonAgentService;


        public PetitionController(
            IPythonAgentService pythonAgentService
        )
        {
            _pythonAgentService = pythonAgentService;
        }



        [HttpPost("create")]
        public async Task<IActionResult> Create(
            PetitionRequest request
        )
        {

            try
            {

                var result =
                    await _pythonAgentService.CreatePetitionAsync(
                        request.Problem
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