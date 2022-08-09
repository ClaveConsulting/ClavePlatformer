using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Logic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace Clave.Platformer.Functions;

public class Delete
{
    private DataContext _dataContext;
    private readonly EditService _editService;

    public Delete(DataContext dataContext, EditService editService)
    {
        _dataContext = dataContext;
        _editService = editService;
    }
    
    // TODO: Change to Mediator
    [FunctionName("Delete")]
    public async Task<IActionResult> Delete_Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
        HttpRequest req,
        ILogger log)
    {
        string id = req.Query["id"];
        var searchResult = await _editService.DeleteScoreByIdAsync(id);
        return new OkObjectResult(searchResult);
    }
}