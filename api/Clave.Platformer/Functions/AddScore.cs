using System.Threading.Tasks;
using Clave.Platformer.Logic.Commands.AddScore;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;

namespace Clave.Platformer.Functions;

public class AddScore
{
    private readonly IMediator _mediator;

    public AddScore(IMediator mediator)
    {
        _mediator = mediator;
    }

    [FunctionName("AddScore")]
    public async Task<IActionResult> AddScore_Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
        AddScoreCommand addScoreCommand)
    {
        var response = await _mediator.Send(addScoreCommand);
        return new OkObjectResult(response);
    }
}