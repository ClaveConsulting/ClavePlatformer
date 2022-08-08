using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Models;
using Clave.Platformer.Scores;
using MediatR;
using Microsoft.Azure.Cosmos.Linq;

namespace Clave.Platformer.MediatorLogic.GetSingleUser;

public class GetSingleUserHandler : IRequestHandler<GetSingleUserQuery, ClavePlatformerScoreDocument>
{
    private readonly DataContext _dataContext;    

    public GetSingleUserHandler(DataContext dataContext)
    {
        _dataContext = dataContext;
    }


    public async Task<ClavePlatformerScoreDocument> Handle(GetSingleUserQuery request, CancellationToken cancellationToken)
    {
        
        var searchResult =
            await _dataContext.scoresContainer.GetSingle<ClavePlatformerScoreDocument>(x => (x.Id == request.Id));

        return searchResult;
    }
}