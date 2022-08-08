using System.Security.AccessControl;
using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Logic;
using Clave.Platformer.Scores;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace Clave.Platformer.Functions;

public class GetUserData
{
    private DataContext _dataContext;
    private readonly SearchService _searchService;
    private readonly IMediator _mediator;

    public GetUserData(DataContext dataContext, SearchService searchService, IMediator mediator)
    {
        _dataContext = dataContext;
        _searchService = searchService;
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
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
        HttpRequest req,
        ILogger log)
    {
        string id = req.Query["id"];

        var searchResult = await _searchService.GetScoreById(id);
        return new OkObjectResult(searchResult);
    }
}