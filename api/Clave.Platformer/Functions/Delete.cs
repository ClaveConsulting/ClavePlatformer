using System.Threading.Tasks;
using Clave.Platformer.Logic.Commands.DeleteScore;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;

namespace Clave.Platformer.Functions;

public class Delete
{
    private readonly IMediator _mediator;

    public Delete(IMediator mediator)
    {
        _mediator = mediator;
    }

    [FunctionName("Delete")]
    public async Task<IActionResult> Delete_Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
        DeleteScoreCommand deleteScoreCommand
    )
    {
        var result = await _mediator.Send(deleteScoreCommand);
        return new OkObjectResult(result);
    }
}