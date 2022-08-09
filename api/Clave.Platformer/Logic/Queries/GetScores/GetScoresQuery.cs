using System.Collections.Generic;
using Clave.Platformer.Models;
using FluentValidation;
using MediatR;

namespace Clave.Platformer.Logic.Queries.GetScores;

public class GetScoresQuery : IRequest<IEnumerable<ClavePlatformerScoreDocument>>
{
    public string Name { get; set; }
    public string Map { get; set; }
    public string Tournament { get; set; }
    public string PhoneNumber { get; set; }

    public class Validator : AbstractValidator<GetScoresQuery>
    {
        public Validator()
        {
            RuleFor(x => x).NotEmpty();
        }
    }
}