using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Logic;
using Clave.Platformer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Clave.Platformer.Functions
{
    public class GetLeaderboard
    {
        private DataContext _dataContext;
        private ScoreService _scoreService;
        public GetLeaderboard(DataContext dataContext, ScoreService scoreService)
        {
            _dataContext = dataContext;
            _scoreService = scoreService;
        }

        [FunctionName("GetLeaderboard")]
        public async Task<IActionResult> Run(
                    [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
                    ILogger log)
        {
            string requestedMap = req.Query["map"];
            List<SafeLeaderboardItem> leaderboard = await _scoreService.GetLeaderboardPerMap(requestedMap);
            return (new OkObjectResult(leaderboard));
        }
    }

}
