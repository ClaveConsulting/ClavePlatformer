using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Logic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace Clave.Platformer.Functions;

public class GetUserData
{
    private DataContext _dataContext;
    private readonly SearchService _searchService;

    public GetUserData(DataContext dataContext, SearchService searchService)
    {
        _dataContext = dataContext;
        _searchService = searchService;
    }

    [FunctionName("GetUserData")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)]
        HttpRequest req,
        ILogger log)
    {
        string name = req.Query["name"];
        string phone = req.Query["phone"];
        string tournament = req.Query["tournament"];
        var searchResult = await _searchService.GetScoresByPropertyAsync(name,phone,"",tournament);
        return new OkObjectResult(searchResult);
    }
}