using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Clave.Platformer.Function
{
    public class GetLeaderboard
    {
        private Container _scoresContainer;
        public GetLeaderboard()
        {
            // Dependency injection
            var cosmosClient = new CosmosClient(Environment.GetEnvironmentVariable("COSMOS_CONNECTION_STRING"));
            _scoresContainer = cosmosClient.GetContainer("ClavePlatformer", "Scores");
        }

        [FunctionName("GetLeaderboard")]
        public async Task<IActionResult> Run(
                    [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
                    ILogger log)
        {
            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);

            var rawLeaderboard = new List<ClavePlatformerScoreDocument>();
            var feedIterator = _scoresContainer.GetItemLinqQueryable<ClavePlatformerScoreDocument>().OrderBy(x => x.Time).Take(10).ToFeedIterator();

            while (feedIterator.HasMoreResults)
            {
                var feedResponse = await feedIterator.ReadNextAsync();
                foreach (var item in feedResponse)
                {
                    rawLeaderboard.Add(item);
                }
            }

            var publicSafeDocunents = new List<SafeLeaderboard>();

            foreach (var item in rawLeaderboard)
            {
                var safeItem = new SafeLeaderboard();
                safeItem.Name = item.Name;
                safeItem.Time = item.Time;
                publicSafeDocunents.Add(safeItem);
            }
            return new OkObjectResult(publicSafeDocunents);
        }
    }

}
