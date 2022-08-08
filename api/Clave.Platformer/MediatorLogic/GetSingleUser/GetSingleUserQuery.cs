using Clave.Platformer.Models;
using MediatR;

namespace Clave.Platformer.MediatorLogic.GetSingleUser;

public class GetSingleUserQuery: IRequest<ClavePlatformerScoreDocument>
{
    public string Id { get; set; }
}