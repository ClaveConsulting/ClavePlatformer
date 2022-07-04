using Microsoft.Azure.Cosmos;

namespace Clave.Platformer.Data;

public record DataContext(Container scoresContainer);