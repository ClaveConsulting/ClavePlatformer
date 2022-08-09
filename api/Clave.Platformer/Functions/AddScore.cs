using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Logic;
using Clave.Platformer.MediatorLogic.AddScore;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace Clave.Platformer.Functions;

public class AddScore
{
    private DataContext _dataContext;
    private readonly ScoreService _scoreService;
    private readonly IMediator _mediator;

    public AddScore(DataContext dataContext, ScoreService scoreService, IMediator mediator)
    {
        _dataContext = dataContext;
        _scoreService = scoreService;
        _mediator = mediator;
    }

    [FunctionName("AddScore")]
    public async Task<IActionResult> AddScore_Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
        AddScoreQuery addScoreQuery,
        HttpRequest req,
        ILogger log)
    {
        var response = await _mediator.Send(addScoreQuery);
        return new OkObjectResult(response);
    }
    
    [FunctionName("AddScoreAdmin")]
    public async Task<IActionResult> AddScoreAdmin_Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
        HttpRequest req,
        ILogger log)
    {
        string name = req.Query["name"];
        // Skriv om til å bruke tryParse()
        var time = decimal.Parse(req.Query["time"]);

            string phoneNumber = req.Query["phoneNumber"];
            string map = req.Query["map"];
            string tournament = req.Query["tournament"];
            string signature = req.Query["signature"];

            var response = await _scoreService.AddScoreToDatabaseAsync(name, time, phoneNumber, map, tournament, signature);

        return new OkObjectResult(response);
    }
}