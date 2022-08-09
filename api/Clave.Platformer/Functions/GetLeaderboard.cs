using System.Threading.Tasks;
using Clave.Platformer.Logic;
using Clave.Platformer.Logic.Queries.GetLeaderboard;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;

namespace Clave.Platformer.Functions;

public class GetLeaderboard
{
    private readonly IMediator _mediator;

    public GetLeaderboard(IMediator mediator)
    {
        _mediator = mediator;
    }

    [FunctionName("GetLeaderboard")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
        GetLeaderBoardQuery getLeaderBoardQuery
    )
    {
        var leaderboard = await _mediator.Send(getLeaderBoardQuery);
        return new OkObjectResult(leaderboard);
    }
}