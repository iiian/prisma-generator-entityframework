using Microsoft.VisualStudio.TestTools.UnitTesting;
using SqliteTest;
using System.Linq;

namespace unit_tests {
  [TestClass]
  public class SqliteTests {
    [TestMethod]
    public void it_should_be_able_create() {
      var client = new SqliteClient();
      client.User.Add(new User {
        name = "Don Jones",
        email = "don.jones@gmail.com"
      });
      client.SaveChanges();

      Assert.AreEqual("don.jones@gmail.com", client.User.First(user => user.name == "Don Jones").email);
    }

    [TestMethod]
    public void it_should_be_able_create_relational_graphs() {
      var client = new SqliteClient();
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
    }
  }
}