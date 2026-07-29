using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionController : ControllerBase
    {

        private readonly ISessionService _sessionService;


        public SessionController(
            ISessionService sessionService
        )
        {
            _sessionService = sessionService;
        }



        // Yeni sohbet oluştur

        [HttpPost("create")]
        public async Task<IActionResult> CreateSession()
        {
            try
            {

                // JWT gelene kadar test user
                int userId = 1;


                var result =
                    await _sessionService.CreateSessionAsync(
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




        // Kullanıcının sohbetlerini getir

        [HttpGet("list")]
        public async Task<IActionResult> GetSessions()
        {

            try
            {

                int userId = 1;


                var result =
                    await _sessionService
                    .GetUserSessionsAsync(
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




        // Sohbet sil

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSession(
            int id
        )
        {

            try
            {

                int userId = 1;


                var result =
                    await _sessionService
                    .DeleteSessionAsync(
                        id,
                        userId
                    );


                if (!result)
                {
                    return NotFound(
                        new
                        {
                            message =
                            "Session bulunamadı."
                        }
                    );
                }


                return Ok(
                    new
                    {
                        message =
                        "Sohbet silindi."
                    }
                );

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