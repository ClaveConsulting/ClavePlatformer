using Clave.Platformer.Models;
using FluentValidation;
using MediatR;

namespace Clave.Platformer.MediatorLogic.Commands.EditScore;

public class EditScoreCommand : IRequest<ClavePlatformerScoreDocument>
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string PhoneNumber { get; set; }
    public decimal Time { get; set; }
    public string Map { get; set; }
    public string Tournament { get; set; }

    public class Validator : AbstractValidator<EditScoreCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Map).NotEmpty();
            RuleFor(x => x.PhoneNumber).NotEmpty();
            RuleFor(x => x.Time).NotEmpty();
            RuleFor(x => x.Id).NotEmpty();
        }
    }
}