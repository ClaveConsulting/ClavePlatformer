using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Models;
using MediatR;
using Microsoft.Azure.Cosmos.Linq;

namespace Clave.Platformer.Logic.Queries.GetScores;

public class GetScoresHandler : IRequestHandler<GetScoresQuery, IEnumerable<ClavePlatformerScoreDocument>>
{
    private readonly DataContext _dataContext;

    public GetScoresHandler(DataContext dataContext)
    {
        _dataContext = dataContext;
    }


    public async Task<IEnumerable<ClavePlatformerScoreDocument>> Handle(GetScoresQuery request,
        CancellationToken cancellationToken)
    {
        var rawSearchResult = new List<ClavePlatformerScoreDocument>();
        var feedIterator = _dataContext.scoresContainer
            .GetItemLinqQueryable<ClavePlatformerScoreDocument>()
            .Where(x => (request.Name == "" || request.Name == null || x.Name == request.Name) &&
                        (request.PhoneNumber == "" || request.PhoneNumber == null ||
                         x.PhoneNumber == request.PhoneNumber) &&
                        (request.Tournament == "" || request.Tournament == null ||
                         x.Tournament == request.Tournament) &&
                        (request.Map == "" || request.Map == null || x.Map == request.Map))
            .OrderBy(x => x.Time)
            .ToFeedIterator();

        while (feedIterator.HasMoreResults)
        {
            var feedResponse = await feedIterator.ReadNextAsync(cancellationToken);

            rawSearchResult.AddRange(feedResponse);
        }

        return rawSearchResult;
    }
}