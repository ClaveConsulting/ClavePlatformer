using System;
using System.Threading;
using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Models;
using MediatR;
using Microsoft.Azure.Cosmos;

namespace Clave.Platformer.Logic.Commands.AddScore;

public class AddScoreHandler : IRequestHandler<AddScoreCommand, SafeLeaderboardItem>
{
    private readonly DataContext _dataContext;

    public AddScoreHandler(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<SafeLeaderboardItem> Handle(AddScoreCommand request, CancellationToken cancellationToken)
    {
        if (request.Tournament == "") request.Tournament = null;
        var existingScoreInDatabase = await _dataContext.scoresContainer
            .GetSingle<ClavePlatformerScoreDocument>(x =>
                x.PhoneNumber == request.PhoneNumber && x.Map == request.Map && x.Tournament == request.Tournament);

        var item = new ClavePlatformerScoreDocument
        {
            Name = request.Name,
            Time = Math.Min(request.Time, existingScoreInDatabase?.Time ?? request.Time),
            PhoneNumber = request.PhoneNumber,
            Map = request.Map,
            Id = existingScoreInDatabase?.Id ?? Guid.NewGuid().ToString(),
            Tournament = request.Tournament
        };

        var itemResponse = await _dataContext.scoresContainer.UpsertItemAsync(item, new PartitionKey(item.Id), cancellationToken: cancellationToken);
        return itemResponse.Resource.toSafeLeaderboardItem();
    }
}