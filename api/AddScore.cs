using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.Cosmos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;


namespace Clave.Platformer.Function
{
    public class AddScore
    {
        private Container _scoresContainer;
        public AddScore()
        {
            // Dependency injection
            var cosmosClient = new CosmosClient(Environment.GetEnvironmentVariable("COSMOS_CONNECTION_STRING"));
            _scoresContainer = cosmosClient.GetContainer("ClavePlatformer", "Scores");
        }

        [FunctionName("AddScore")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            string name = req.Query["name"];
            // Skriv om til å bruke tryParse()
            float time = float.Parse(req.Query["time"]);

            var phoneNumber = req.Query["phoneNumber"];

            var item = new ClavePlatformerScoreDocument { Name = name, Time = time, PhoneNumber = phoneNumber, Id = Guid.NewGuid().ToString() };
            var itemResponse = await _scoresContainer.UpsertItemAsync(item, new PartitionKey(item.Id));

            string responseMessage = string.IsNullOrEmpty(name)
                ? "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
                : $"Hello, {name}. This HTTP triggered function executed successfully.";

            return new OkObjectResult(responseMessage);
        }

    }
}
