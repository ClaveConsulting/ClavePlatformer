using System.Threading.Tasks;
using Clave.Platformer.MediatorLogic.Commands.EditScore;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;

namespace Clave.Platformer.Functions;

public class EditScore
{
    private readonly IMediator _mediator;

    public EditScore(IMediator mediator)
    {
        _mediator = mediator;
    }

    [FunctionName("EditScore")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
        EditScoreCommand editScoreCommand)
    {
        var response = await _mediator.Send(editScoreCommand);
        return new OkObjectResult(response);
    }
}