using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Models;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;

namespace Clave.Platformer.Logic;

public class EditService
{
    private readonly DataContext _dataContext;

    public EditService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }
    
    public async Task<ClavePlatformerScoreDocument> DeleteScoreByIdAsync(string id)
    {
        return await _dataContext.scoresContainer.DeleteItemAsync<ClavePlatformerScoreDocument>(id,new PartitionKey(id));
    }
    
}