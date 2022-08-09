using Clave.Platformer.Models;
using FluentValidation;
using MediatR;

namespace Clave.Platformer.MediatorLogic.Commands.DeleteScore;

public class DeleteScoreCommand : IRequest<SafeLeaderboardItem>
{
    public string Id { get; set; }

    public class Validator : AbstractValidator<DeleteScoreCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Id).NotEmpty();
        }
    }
}