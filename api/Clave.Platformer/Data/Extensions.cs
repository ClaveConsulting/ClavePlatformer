using System;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Clave.Platformer.Logic.Commands.AddScore;
using Clave.Platformer.Models;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;

namespace Clave.Platformer.Data;

public static class Extensions
{
    public static async Task<T> GetSingle<T>(this Container container, Expression<Func<T, bool>> selector)
    {
        var iterator = container.GetItemLinqQueryable<T>().Where(selector).ToFeedIterator();
        while (iterator.HasMoreResults)
        {
            var result = await iterator.ReadNextAsync();
            return result.FirstOrDefault();
        }

        return default;
    }

    public static SafeLeaderboardItem toSafeLeaderboardItem(this ClavePlatformerScoreDocument scoreDocument)
    {
        return new SafeLeaderboardItem
        {
            Name = scoreDocument.Name,
            Map = scoreDocument.Map,
            Id = scoreDocument.Id,
            Time = scoreDocument.Time,
            Tournament = scoreDocument.Tournament
        };
    }

    public static string GenerateSignature(this AddScoreCommand addScoreCommand)
    {
        var keyBytes =
            Encoding.UTF8.GetBytes(
                Environment.GetEnvironmentVariable("NOT_SO_SECRET_SECRET_KEY") + addScoreCommand.Time.ToString());
        using var hmac = new HMACSHA512(keyBytes);
        
        var messageBytes = Encoding.UTF8.GetBytes(addScoreCommand.Time.ToString(CultureInfo.CurrentCulture));
        var computedSignatureBytes = hmac.ComputeHash(messageBytes);
        return Convert.ToHexString(computedSignatureBytes);
    }
}