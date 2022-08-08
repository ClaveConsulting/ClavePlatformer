using System.Collections.Generic;
using Clave.Platformer.Models;
using MediatR;

namespace Clave.Platformer.Scores;

public class GetScoresQuery : IRequest<IEnumerable<ClavePlatformerScoreDocument>>
{
    public string Name { get; set; }
    public string Map { get; set; }
    public string Tournament { get; set; }
    public string PhoneNumber { get; set; }
};