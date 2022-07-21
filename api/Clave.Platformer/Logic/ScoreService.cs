using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Models;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;


namespace Clave.Platformer.Logic;

public class ScoreService
{
    private DataContext _dataContext;
    public ScoreService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<SafeLeaderboardItem> AddScoreToDatabaseAsync(string name, float time, string phoneNumber, string map)
    {
        var existingScoreInDatabase = await _dataContext.scoresContainer
            .GetSingle<ClavePlatformerScoreDocument>(x => (x.PhoneNumber == phoneNumber && x.Map == map));
        var item = new ClavePlatformerScoreDocument
        {
            Name = name,
            Time = Math.Min(time, existingScoreInDatabase?.Time ?? time),
            PhoneNumber = phoneNumber,
            Map = map,
            Id = existingScoreInDatabase?.Id ?? Guid.NewGuid().ToString()
        };
        var itemResponse = await _dataContext.scoresContainer.UpsertItemAsync(item, new PartitionKey(item.Id));
        return itemResponse.Resource.toSafeLeaderboardItem();
    }

    public async Task<List<SafeLeaderboardItem>> GetLeaderboardPerMap(string map)
    {
        var rawLeaderboard = new List<ClavePlatformerScoreDocument>();
        var feedIterator = _dataContext.scoresContainer
            .GetItemLinqQueryable<ClavePlatformerScoreDocument>()
            .Where(x => x.Map == map)
            .OrderBy(x => x.Time)
            .Take(10)
            .ToFeedIterator();

        while (feedIterator.HasMoreResults)

        {
            var feedResponse = await feedIterator.ReadNextAsync();
            foreach (var item in feedResponse)
            {
                rawLeaderboard.Add(item);
            }
        }

        var publicSafeDocuments = new List<SafeLeaderboardItem>();

        foreach (var item in rawLeaderboard)
        {
            SafeLeaderboardItem safeItem = new(item.Name, item.Time, item.Map, item.Id);
            publicSafeDocuments.Add(safeItem);
        }
        return publicSafeDocuments;
    }

}
