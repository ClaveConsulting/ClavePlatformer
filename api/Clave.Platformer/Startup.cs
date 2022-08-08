using System;
using System.Reflection;
using Clave.Platformer;
using Clave.Platformer.Data;
using Clave.Platformer.Logic;
using MediatR;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(Startup))]

namespace Clave.Platformer;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services.AddSingleton(s =>
        {
            var cosmosClient = new CosmosClient(Environment.GetEnvironmentVariable("COSMOS_CONNECTION_STRING"));
            var scoresContainer = cosmosClient.GetContainer("ClavePlatformer", "Scores");
            return new DataContext(scoresContainer);
        });
        
        builder.Services.AddTransient<ScoreService>();
        builder.Services.AddTransient<SearchService>();
        builder.Services.AddTransient<EditService>();
        //builder.Services.AddMediatR(typeof(Ping));
        builder.Services.AddMediatR(Assembly.GetExecutingAssembly());
        //builder.Services.AddScoped(typeof(IRequestHandler<GetScoresQuery, IEnumerable<ClavePlatformerScoreDocument>>), typeof(GetScoresHandler));
        
    }
}