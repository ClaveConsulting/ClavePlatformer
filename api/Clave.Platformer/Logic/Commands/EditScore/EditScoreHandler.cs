using System.Threading;
using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Models;
using MediatR;
using Microsoft.Azure.Cosmos;

namespace Clave.Platformer.Logic.Commands.EditScore;

public class EditScoreHandler : IRequestHandler<EditScoreCommand, ClavePlatformerScoreDocument>
{
    private readonly DataContext _dataContext;

    public EditScoreHandler(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<ClavePlatformerScoreDocument> Handle(EditScoreCommand request,
        CancellationToken cancellationToken)
    {
        if (request.Tournament == "") request.Tournament = null;

        var item = new ClavePlatformerScoreDocument
        {
            Name = request.Name,
            Time = request.Time,
            PhoneNumber = request.PhoneNumber,
            Map = request.Map,
            Id = request.Id,
            Tournament = request.Tournament
        };

        var response = await _dataContext.scoresContainer.UpsertItemAsync(item, new PartitionKey(request.Id),
            cancellationToken: cancellationToken);
        return response.Resource;
    }
}