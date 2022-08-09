using System;
using System.Security.Cryptography;
using System.Text;
using System.Xml.Schema;
using Clave.Platformer.Data;
using Clave.Platformer.Models;
using FluentValidation;
using MediatR;

namespace Clave.Platformer.MediatorLogic.AddScore;

public class AddScoreQuery : IRequest<SafeLeaderboardItem>
{
    public string Name { get; set; }
    public string PhoneNumber { get; set; }
    public float Time { get; set; }
    public string Map { get; set; }
    public string Tournament { get; set; }
    public string Signature { get; set; }

    public class Validator : AbstractValidator<AddScoreQuery>
    {
        public Validator()
        {
            RuleFor(x => x.GenerateSignature()).Equal(x=>x.Signature);
        }
    }
}