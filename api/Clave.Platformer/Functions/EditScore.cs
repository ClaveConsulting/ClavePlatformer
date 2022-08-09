using System.Threading.Tasks;
using Clave.Platformer.Data;
using Clave.Platformer.Logic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace Clave.Platformer.Functions;

public class EditScore
{
    private DataContext _dataContext;
    private readonly EditService _editService;

    public EditScore(DataContext dataContext, EditService editService)
    {
        _dataContext = dataContext;
        _editService = editService;
    }

    [FunctionName("EditScore")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)]
        HttpRequest req,
        ILogger log)
    {
        string id = req.Query["id"];
        string name = req.Query["name"];
        var time = decimal.Parse(req.Query["time"]);
        string phoneNumber = req.Query["phoneNumber"];
        string map = req.Query["map"];
        string tournament = req.Query["tournament"];

        var response = await _editService.EditScoreByIdAsync(id,name, time, phoneNumber, map, tournament);

        return new OkObjectResult(response);
    }

}