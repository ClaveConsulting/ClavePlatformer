using Clave.Platformer.Data;
using Clave.Platformer.Models;
using FluentValidation;
using MediatR;

namespace Clave.Platformer.Logic.Commands.AddScore;

public class AddScoreCommand : IRequest<SafeLeaderboardItem>
{
    public string Name { get; set; }
    public string PhoneNumber { get; set; }
    public decimal Time { get; set; }
    public string Map { get; set; }
    public string Tournament { get; set; }
    public string Signature { get; set; }

    public class Validator : AbstractValidator<AddScoreCommand>
    {
        public Validator()
        {
            RuleFor(x => x.GenerateSignature().ToLower())
                .Must((query, signature) =>
                {
                    var lower = query.Signature.ToLower();
                    return lower == signature;
                });
        }
    }
}