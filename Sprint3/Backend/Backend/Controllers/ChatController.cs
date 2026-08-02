using Backend.Interfaces;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {

        private readonly IChatService _chatService;


        public ChatController(
            IChatService chatService
        )
        {
            _chatService = chatService;
        }



        // Kullanıcı soru sorar

        [HttpPost("ask")]
        public async Task<IActionResult> AskQuestion(
            [FromBody] AskQuestionRequest request
        )
        {

            try
            {

                // JWT entegrasyonundan sonra token içerisinden alınacak

                int userId = 1;



                var result =
                    await _chatService.AskQuestionAsync(
                        request,
                        userId
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




        // Sohbet geçmişi getir

        [HttpGet("history/{sessionId}")]
        public async Task<IActionResult> GetHistory(
            int sessionId
        )
        {

            try
            {

                var result =
                    await _chatService.GetChatHistoryAsync(
                        sessionId
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