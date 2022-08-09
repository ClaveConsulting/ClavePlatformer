using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Models;
using MediatR;
using Microsoft.Azure.Cosmos.Linq;

namespace Clave.Platformer.Logic.Queries.GetLeaderboard;

public class GetLeaderboardHandler : IRequestHandler<GetLeaderBoardQuery, IEnumerable<SafeLeaderboardItem>>
{
    private readonly DataContext _dataContext;

    public GetLeaderboardHandler(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<IEnumerable<SafeLeaderboardItem>> Handle(GetLeaderBoardQuery request,
        CancellationToken cancellationToken)
    {
        var rawLeaderboard = new List<ClavePlatformerScoreDocument>();
        var feedIterator = _dataContext.scoresContainer
            .GetItemLinqQueryable<ClavePlatformerScoreDocument>()
            .Where(x => x.Map == request.Map)
            .Where(x => x.Tournament == request.Tournament)
            .OrderBy(x => x.Time)
            .Take(10)
            .ToFeedIterator();

        while (feedIterator.HasMoreResults)
        {
            var feedResponse = await feedIterator.ReadNextAsync(cancellationToken);
            rawLeaderboard.AddRange(feedResponse);
        }

        return rawLeaderboard
            .Select(item => new SafeLeaderboardItem(item.Name, item.Time, item.Map, item.Id, item.Tournament)).ToList();
    }
}