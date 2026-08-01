using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MessageController : ControllerBase
    {

        private readonly IMessageService _messageService;


        public MessageController(
            IMessageService messageService
        )
        {
            _messageService = messageService;
        }





        [HttpGet("session/{sessionId}")]
        public async Task<IActionResult> GetMessages(
            int sessionId
        )
        {

            try
            {

                var result =
                    await _messageService
                    .GetMessagesAsync(
                        sessionId
                    );


                return Ok(result);

            }
            catch (Exception ex)
            {

                return BadRequest(new
                {
                    message = ex.Message
                });

            }

        }

    }

}