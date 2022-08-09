using System.Threading;
using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Models;
using MediatR;
using Microsoft.Azure.Cosmos;

namespace Clave.Platformer.MediatorLogic.Commands.DeleteScore;

public class DeleteScoreHandler : IRequestHandler<DeleteScoreCommand, SafeLeaderboardItem>
{
    private DataContext _dataContext;

    public DeleteScoreHandler(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<SafeLeaderboardItem> Handle(DeleteScoreCommand request, CancellationToken cancellationToken)
    {
        return await _dataContext.scoresContainer.DeleteItemAsync<SafeLeaderboardItem>(request.Id,
            new PartitionKey(request.Id), cancellationToken: cancellationToken);
    }
}