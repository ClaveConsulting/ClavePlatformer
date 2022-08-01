using Clave.Platformer.Data;
using Clave.Platformer.Models;

namespace Clave.Platformer.Tests;

public class ExtensionsTests
{
    [Fact]
    public void toSafeLeaderboardItem_Should_Work()
    {
        // Set-up
        var a = new ClavePlatformerScoreDocument();

        // Act
        var b = a.toSafeLeaderboardItem();

        // Verify
        Assert.NotNull(b);
    }

    [Fact]
    public void toSafeLeaderboardItem_Should_Not_Be_Unsafe()
    {
        // Set-up
        var a = new ClavePlatformerScoreDocument();
        a.Id = new Guid().ToString();
        a.Map = "map";
        a.Name = "name";
        a.PhoneNumber = "12345678";
        a.Time = 1.23f;


        // Act
        var b = a.toSafeLeaderboardItem();

        // Verify
        Assert.NotSame(a, b);
        Assert.Equal(a.Map, b.Map);
        Assert.Equal(a.Name, b.Name);
        Assert.Equal(a.Time, b.Time);
        Assert.Equal(a.Id, b.Id);
        Assert.IsNotType<ClavePlatformerScoreDocument>(b);
    }
}