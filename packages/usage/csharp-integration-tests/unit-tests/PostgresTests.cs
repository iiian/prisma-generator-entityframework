using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using PostgresTest;
using System;
using System.Linq;
using System.Text.RegularExpressions;

namespace unit_tests {
  [TestClass]
  public class PostgresTests {
    [TestMethod]
    public void it_should_be_able_create_read_and_delete() {
      PostgresClient client = new PostgresClient();
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
      var client = new PostgresClient();
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
      PostgresClient client = new PostgresClient();
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
      PostgresClient client = new PostgresClient();
      var shard = client.ShardMap.Add(new ShardMap {
        country = "India",
        route = "/users/me",
        shard_index = 7
      });
      client.SaveChanges();
      Assert.ThrowsException<InvalidOperationException>(() => {
        client.ShardMap.Add(new ShardMap {
          country = "India",
          route = "/users/me",
          shard_index = 7
        });
        client.SaveChanges();
      });
      client = new PostgresClient();
      client.ShardMap.Remove(shard.Entity);
      client.SaveChanges();
      Assert.AreEqual(client.ShardMap.Count(), 0);
    }

    [TestMethod]
    public void it_should_support_guids() {
      var uuid_regex = new Regex(@"[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}");
      PostgresClient client = new PostgresClient();
      var text_uuid = client.TextUuidType.Add(new TextUuidType {
        data = 2_000
      });
      client.SaveChanges();
      Assert.IsNotNull(text_uuid.Entity.id);
      Assert.IsTrue(uuid_regex.IsMatch(text_uuid.Entity.id.ToString()));
      client.TextUuidType.Remove(text_uuid.Entity);
      client.SaveChanges();

      var db_uuid = client.DbUuidType.Add(new DbUuidType {
        data = 42
      });
      client.SaveChanges();
      Assert.IsNotNull(db_uuid.Entity.id);
      Assert.IsTrue(uuid_regex.IsMatch(db_uuid.Entity.id.ToString()));
      client.DbUuidType.Remove(db_uuid.Entity);
      client.SaveChanges();
    }

    [TestMethod]
    public void it_should_support_special_fields() {
      PostgresClient client = new PostgresClient();
      var all_fields_test = client.AllFieldsTest.Add(new AllFieldsTest {
        an_xml = "<xml></xml>",
        a_short = 42,
        a_uint = 43,
        bit_arr = new System.Collections.BitArray(2, true),
        uno_bit = new System.Collections.BitArray(1, false),
        bytes = new byte[] { 0b_1011_1010 },
        guid = Guid.NewGuid(),
        ip_addr = System.Net.IPAddress.Loopback,
        json = "{ \"hello\": \"world!\" }",
        jsonb = "{ \"solution\": \"sell-low, buy-high\" }",
      });
      client.SaveChanges();
      client.Remove(all_fields_test.Entity);
      client.SaveChanges();
    }
  }
}