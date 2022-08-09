using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Logic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace Clave.Platformer.Functions;

public class GetLeaderboard
{
    private DataContext _dataContext;
    private readonly ScoreService _scoreService;

    public GetLeaderboard(DataContext dataContext, ScoreService scoreService)
    {
        _dataContext = dataContext;
        _scoreService = scoreService;
    }
    // TODO: CHange to Mediator
    [FunctionName("GetLeaderboard")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
        HttpRequest req,
        ILogger log)
    {
        string requestedMap = req.Query["map"];
        string tournament = req.Query["tournament"];
        var leaderboard = await _scoreService.GetLeaderboardPerMap(requestedMap, tournament);
        return new OkObjectResult(leaderboard);
    }
}