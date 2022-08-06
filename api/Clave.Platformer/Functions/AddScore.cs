using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Logic;
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

    public AddScore(DataContext dataContext, ScoreService scoreService)
    {
        _dataContext = dataContext;
        _scoreService = scoreService;
    }

    [FunctionName("AddScore")]
    public async Task<IActionResult> AddScore_Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
        HttpRequest req,
        ILogger log)
    {
        string name = req.Query["name"];
        // Skriv om til å bruke tryParse()
        var time = float.Parse(req.Query["time"]);

        string phoneNumber = req.Query["phoneNumber"];
        string map = req.Query["map"];
        string tournament = req.Query["tournament"];

        var response = await _scoreService.AddScoreToDatabaseAsync(name, time, phoneNumber, map, tournament);

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
        var time = float.Parse(req.Query["time"]);

        string phoneNumber = req.Query["phoneNumber"];
        string map = req.Query["map"];
        string tournament = req.Query["tournament"];
        

        var response = await _scoreService.AddScoreToDatabaseAsync(name, time, phoneNumber, map, tournament);

        return new OkObjectResult(response);
    }
}