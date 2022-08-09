using Newtonsoft.Json;

namespace Clave.Platformer.Models;

public class ClavePlatformerScoreDocument
{
    [JsonProperty(PropertyName = "id")] public string Id { get; set; }

    [JsonProperty(PropertyName = "name")] public string Name { get; set; }

    [JsonProperty(PropertyName = "time")] public decimal Time { get; set; }

    [JsonProperty(PropertyName = "phoneNumber")]
    public string PhoneNumber { get; set; }

    [JsonProperty(PropertyName = "map")] public string Map { get; set; }

    [JsonProperty(PropertyName = "tournament")]
    public string Tournament { get; set; }
}