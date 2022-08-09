using System.Threading.Tasks;
using Clave.Platformer.MediatorLogic.GetScores;
using Clave.Platformer.MediatorLogic.GetSingleUser;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;

namespace Clave.Platformer.Functions;

public class GetUserData
{
    private readonly IMediator _mediator;

    public GetUserData(IMediator mediator)
    {
        _mediator = mediator;
    }

    [FunctionName("GetUserData")]
    public async Task<IActionResult> GetUserData_Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
        GetScoresQuery getScoresQuery
    )
    {
        var response = await _mediator.Send(getScoresQuery);
        return new OkObjectResult(response);
    }

    [FunctionName("GetSingleUserById")]
    public async Task<IActionResult> GetSingleUserById_Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
        GetSingleUserQuery getSingleUserQuery
    )
    {
        var searchResult = await _mediator.Send(getSingleUserQuery);
        return new OkObjectResult(searchResult);
    }
}