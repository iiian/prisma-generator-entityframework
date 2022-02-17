using Microsoft.VisualStudio.TestTools.UnitTesting;
using MysqlTest;
using System;
using System.Linq;

namespace unit_tests {
  [TestClass]
  public class MysqlTests {
    [TestMethod]
    public void it_should_be_able_create_read_and_delete() {
      MysqlClient client = new MysqlClient();
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
      var client = new MysqlClient();
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
      MysqlClient client = new MysqlClient();
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

    [TestMethod]
    public void it_should_support_multi_field_primary_keys() {
      MysqlClient client = new MysqlClient();
      var shard = client.ShardMap.Add(new ShardMap {
        country = "India",
        route = "/users/me",
        shard_index = 7
      });
      client.SaveChanges();
      Assert.IsTrue(client.ShardMap.First().country == "India" && client.ShardMap.First().route == "/users/me" && client.ShardMap.First().shard_index == 7);
      Assert.ThrowsException<InvalidOperationException>(() => {
        client.ShardMap.Add(new ShardMap{
          country = "India",
          route = "/users/me",
          shard_index = 7
        });
        client.SaveChanges();
      });
    }
  }
}