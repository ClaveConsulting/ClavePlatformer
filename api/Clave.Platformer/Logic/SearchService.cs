using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Models;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;

namespace Clave.Platformer.Logic;

public class SearchService
{
    private readonly DataContext _dataContext;

    public SearchService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<List<ClavePlatformerScoreDocument>> GetScoresByPropertyAsync(string name, string phoneNumber,
        string map, string tournament)
    {
        var rawSearchResult = new List<ClavePlatformerScoreDocument>();
        var feedIterator = _dataContext.scoresContainer
            .GetItemLinqQueryable<ClavePlatformerScoreDocument>()
            .Where((x) => ((name == null || x.Name == name) &&
                           (phoneNumber == null || x.PhoneNumber == phoneNumber) &&
                           (tournament == null || x.Tournament == tournament)))
            .OrderBy(x => x.Time)
            .ToFeedIterator();

        while (feedIterator.HasMoreResults)
        {
            var feedResponse = await feedIterator.ReadNextAsync();
            foreach (var item in feedResponse) rawSearchResult.Add(item);
        }

        return rawSearchResult;
    }
}