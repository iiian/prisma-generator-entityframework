using Microsoft.VisualStudio.TestTools.UnitTesting;
using SqlServerTest;
using System.Linq;

namespace unit_tests {
  [TestClass]
  public class SqlServerTests {
    [TestMethod]
    public void it_should_be_able_create_read_and_delete() {
      SqlServerClient client = new SqlServerClient();
      client.User.Add(new User {
        name = "Don Jones",
        email = "don.jones@gmail.com"
      });
      client.SaveChanges();
      Assert.AreEqual("don.jones@gmail.com", client.User.First(user => user.name == "Don Jones").email);
      client.User.Remove(client.User.First(user => user.name == "Don Jones"));
      client.SaveChanges();
      Assert.AreEqual(client.User.Count(), 0);
    }

    [TestMethod]
    public void it_should_be_able_create_relational_graphs_with_cascading_deletions() {
      var client = new SqlServerClient();
      var user = client.User.Add(new User {
        name = "John Doe",
        email = "john.doe@gmail.com",
        posts = new Post[] {
          new Post {
            content = "Hey, this seems like a really great idea!",
          }
        }
      });
      client.SaveChanges();

      Assert.AreEqual("John Doe", client.Post.First(post => post.creatorId == user.Entity.id).createdBy.name);

      client.User.Remove(user.Entity);
      client.SaveChanges();

      Assert.AreEqual(client.Post.Count(), 0);
    }

    [TestMethod]
    public void it_should_be_able_to_update() {
      SqlServerClient client = new SqlServerClient();
      var donJonesUser = client.User.Add(new User {
        name = "Don Jones",
        email = "don.jones@gmail.com"
      });
      client.SaveChanges();
      Assert.AreEqual("don.jones@gmail.com", client.User.First(user => user.name == "Don Jones").email);
      donJonesUser.Entity.email = "don.jones42@gmail.com";
      client.SaveChanges();
      Assert.IsTrue(client.User.Any(user => user.name == "Don Jones"));
      Assert.IsFalse(client.User.Any(user => user.email == "don.jones@gmail.com"));
      client.User.Remove(donJonesUser.Entity);
      client.SaveChanges();
    }
  }
}