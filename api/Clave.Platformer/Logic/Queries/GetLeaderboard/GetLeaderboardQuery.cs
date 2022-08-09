using System.Collections.Generic;
using Clave.Platformer.Models;
using FluentValidation;
using MediatR;

namespace Clave.Platformer.Logic.Queries.GetLeaderboard;

public class GetLeaderBoardQuery : IRequest<IEnumerable<SafeLeaderboardItem>>
{
    public string Map { get; set; }
    public string Tournament { get; set; }

    public class Validator : AbstractValidator<GetLeaderBoardQuery>
    {
        public Validator()
        {
            RuleFor(x => x.Map).NotEmpty();
        }
    }
}