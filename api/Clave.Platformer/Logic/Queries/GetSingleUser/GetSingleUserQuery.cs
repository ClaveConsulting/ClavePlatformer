using Clave.Platformer.Models;
using FluentValidation;
using MediatR;

namespace Clave.Platformer.Logic.Queries.GetSingleUser;

public class GetSingleUserQuery : IRequest<ClavePlatformerScoreDocument>
{
    public string Id { get; init; }

    public class Validator : AbstractValidator<GetSingleUserQuery>
    {
        public Validator()
        {
            RuleFor(x => x.Id).NotEmpty();
        }
    }
}