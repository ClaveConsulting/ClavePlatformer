using System.Threading.Tasks;
using Clave.Platformer.Logic;
using Clave.Platformer.MediatorLogic.Commands.AddScore;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace Clave.Platformer.Functions;

public class AddScore
{
    private readonly IMediator _mediator;
    private readonly ScoreService _scoreService;

    public AddScore(ScoreService scoreService, IMediator mediator)
    {
        _scoreService = scoreService;
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


    // TODO: Change to mediator
    [FunctionName("AddScoreAdmin")]
    public async Task<IActionResult> AddScoreAdmin_Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
        HttpRequest req,
        ILogger log)
    {
        string name = req.Query["name"];
        var time = decimal.Parse(req.Query["time"]);

        string phoneNumber = req.Query["phoneNumber"];
        string map = req.Query["map"];
        string tournament = req.Query["tournament"];
        string signature = req.Query["signature"];

        var response = await _scoreService.AddScoreToDatabaseAsync(name, time, phoneNumber, map, tournament, signature);

        return new OkObjectResult(response);
    }
}