namespace Clave.Platformer.Models
{
    using Newtonsoft.Json;
    public class ClavePlatformerScoreDocument
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "time")]
        public float Time { get; set; }

        [JsonProperty(PropertyName = "phoneNumber")]
        public string PhoneNumber { get; set; }

        [JsonProperty(PropertyName = "map")]
        public string Map { get; set; }
    }
}
