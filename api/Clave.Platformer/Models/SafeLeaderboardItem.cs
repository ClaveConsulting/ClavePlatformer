using Newtonsoft.Json;

namespace Clave.Platformer.Models;

public class SafeLeaderboardItem
{
    public SafeLeaderboardItem(string name, decimal time, string map, string id, string tournament)
    {
        Name = name;
        Time = time;
        Map = map;
        Id = id;
        Tournament = tournament;
    }

    public SafeLeaderboardItem()
    {
    }

    [JsonProperty(PropertyName = "name")] public string Name { get; set; }

    [JsonProperty(PropertyName = "time")] public decimal Time { get; set; }

    [JsonProperty(PropertyName = "map")] public string Map { get; set; }

    [JsonProperty(PropertyName = "id")] public string Id { get; set; }

    [JsonProperty(PropertyName = "tournament")]
    public string Tournament { get; set; }
}