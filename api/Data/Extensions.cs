using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;

namespace Clave.Platformer.Data;

public static class Extensions
{
    public static async Task<T> GetSingle<T>(this Container container, Expression<Func<T, bool>> selector)
    {
        var iterator = container.GetItemLinqQueryable<T>().Where(selector).ToFeedIterator<T>();
        while (iterator.HasMoreResults)
        {
            var result = await iterator.ReadNextAsync();
            return result.FirstOrDefault();
        }

        return default;
    }
}