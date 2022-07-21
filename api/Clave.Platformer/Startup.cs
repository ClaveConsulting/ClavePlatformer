using System;
using Clave.Platformer.Data;
using Clave.Platformer.Logic;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(Clave.Platformer.Startup))]

namespace Clave.Platformer
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton((s) =>
            {
                var cosmosClient = new CosmosClient(Environment.GetEnvironmentVariable("COSMOS_CONNECTION_STRING"));
                var scoresContainer = cosmosClient.GetContainer("ClavePlatformer", "Scores");
                return new DataContext(scoresContainer);
            });

            builder.Services.AddTransient<ScoreService>();

        }
    }
}