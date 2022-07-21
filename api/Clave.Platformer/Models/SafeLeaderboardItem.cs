namespace Clave.Platformer.Models
{
    using Newtonsoft.Json;
    public class SafeLeaderboardItem
    {
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "time")]
        public float Time { get; set; }

        [JsonProperty(PropertyName = "map")]
        public string Map { get; set; }

        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        public SafeLeaderboardItem(string name, float time, string map, string id)
        {
            Name = name;
            Time = time;
            Map = map;
            Id = id;
        }
        public SafeLeaderboardItem() { }
    }
}
