using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.Cosmos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Clave.Platformer.Data;
using Clave.Platformer.Logic;

namespace Clave.Platformer.Functions
{
    public class AddScore
    {
        private DataContext _dataContext;
        private ScoreService _scoreService;
        public AddScore(DataContext dataContext, ScoreService scoreService)
        {
            _dataContext = dataContext;
            _scoreService = scoreService;
        }

        [FunctionName("AddScore")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            string name = req.Query["name"];
            // Skriv om til å bruke tryParse()
            float time = float.Parse(req.Query["time"]);

            string phoneNumber = req.Query["phoneNumber"];
            string map = req.Query["map"];
            string tournament = req.Query["tournament"];

            var response = await _scoreService.AddScoreToDatabaseAsync(name, time, phoneNumber, map, tournament);

            return new OkObjectResult(response);
        }
    }
}
