namespace Clave.Platformer.Function
{
    using Newtonsoft.Json;
    public class SafeLeaderboard
    {
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "time")]
        public float Time { get; set; }
    }
}