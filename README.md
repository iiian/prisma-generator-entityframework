# A note of forewarning to the would-be user...

_This was a failure. I'm making a note here: huge regret. It's hard to overstate my **dis**satisfaction._ :cake:

So, I started to build this thinking "man, it really sucks that you can't create an EntityFramework client from a Prisma schema." Except I'm frequently incorrect on things, and oh by the way yes, yes you totally can create an EntityFramework client from Prisma, and without any code in-between. [Here's an article on using prisma migrate to deploy your schema, and using the dotnet cli's entityframework introspection features to much more natively produce a client.](https://dev.to/prisma/database-migrations-for-net-and-entity-framework-with-prisma-49e0).

🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧
-----------------------------------------------------------

> Shout out to @YassinEldeeb for building the awesome bootstrap project [create-prisma-generator](https://github.com/YassinEldeeb/create-prisma-generator). Without it, this would have taken significantly more time to get into a deployable state.

# prisma-generator-entityframework

Prisma. It's great, but if you're from the .NET clan, you're left standing out in the rain. Maybe there's still a way? What if the `prisma.schema` file could generate an [EntityFramework](https://docs.microsoft.com/en-us/ef/ef6/) client?

## Usage

### Step One
In your `schema.prisma` file, add a new generator called `entityframework` (or whatever you like):

```prisma
// + generator entityframework {
// +   provider        = "npx prisma-generator-entityframework"
// +   output          = "../types"
// +   namespace       = "MyNamespace"
// +   clientClassName = "DataDbContext"
// + }

datasource db {
  provider = "postgresql"
  url      = "postgresql://user:password@my_postgres_host.com:5432/initial_db"
}

// Here's some example model code
model User {
  id      Int       @id @default(autoincrement())
  email   String    @unique
  name    String?
  posts   Post[]
  comment Comment[]

  @@map("system_user")
}

...

```

### Step Two

Run `prisma generate` or `npx prisma generate` on your schema.

The `prisma-generator-entityframework` declaration you added will generate a C# `EntityFramework` client interface based on the models you have declared in your schema file.

### Step Three

In your C# project(s), you now should be able to do things like:

```C#
using MyNamespace;

...

var context = new DataDbContext(); // if you're new to EntityFramework, it will come preconfigured with smarts to call your db connection, no batteries required!
context.User.Add(new User {
  email = "john.doe@gmail.com",
  name = "John Doe",
});
context.SaveChanges();

Console.WriteLine(context.User.Where(user => user.name == "John Doe").First().email);
// john.doe@gmail.com
```

## Configuration

Configuration is as simple as providing values for these four properties:

| Property          | Type                                     | Description |
|-------------------|------------------------------------------|-------------|
| `provider`        | `"npx prisma-generator-entityframework"` | Tell `prisma` you want to use this generator.
| `output`          | `string`: relative or absolute path      | Tell `prisma` where you want the source code to be dumped to.
| `namespace`       | `string`                                 | Tell `prisma-generator-entityframework` what namespace to stick your client and model code in.
| `clientClassName` | `string`                                 | Tell `prisma-generator-entityframework` what to name your `DbContext` subclass.

## Compatibility

### .NET support

| Platform       | Version | Support        |
|----------------|---------|----------------|
| .NET core      | 5.0+    |  ✔️            |
| .NET core      | <5.0    | ❔ (unverified) |
| .NET framework | *       | ❌             |

Right now, the primary target is .NET core, version 5.0 and later. If ~~enough~~ _any_ interest is communicated in suppporting .NET framework, it can certainly be prioritized.

### Database support

| Prisma connector  | Supported | .NET core provider mapping                                                                                         |
|-------------------|-----------|--------------------------------------------------------------------------------------------------------------------|
| postgres          | ✔️        | [Npgsql.EntityFrameworkCore.PostgreSQL](https://www.nuget.org/packages/Npgsql.EntityFrameworkCore.PostgreSQL/)     |
| mysql             | ✔️        | [Pomelo.EntityFrameworkCore.MySql](https://www.nuget.org/packages/Pomelo.EntityFrameworkCore.MySql/)               |
| sqlite            | ✔️        | [Microsoft.EntityFrameworkCore.Sqlite](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.Sqlite/)       |
| sqlserver         | ✔️        | [Microsoft.EntityFrameworkCore.SqlServer](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.SqlServer/) |
| cockroachdb       | ❌        | -*                                                                                                                  |
| mongodb           | ❌        | -                                                                                                     


\* *It seems at least plausible to [support CockroachDB](https://www.cockroachlabs.com/docs/stable/build-a-csharp-app-with-cockroachdb.html), and given how compelling a product the CockroachLabs team have created, this should probably prioritized.*

For more information on EntityFramework database provider support, visit the [DbContext configuration guide](https://docs.microsoft.com/en-us/ef/core/dbcontext-configuration/).

For more information on Prisma-supported database connectors, visit the [Prisma database connector documentation](https://www.prisma.io/docs/concepts/database-connectors).

## Feature support

The following table tracks feature availability. It's a good reference for verifying whether your schema will output with the information you need. Drop an issue if you'd like to see a specific feature prioritizied.

| Feature                              | Supported | Description
|--------------------------------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------
| model generation                     | ✔️        | The system can generate basic models.
| client generation                    | ✔️        | The system can generate a basic client (`DbContext` in the `EntityFramework` world).
| .env datasource                      | ✔️        | The system can optionally configure the client from a `.env` file using the `env()` expression
| relation generation                  | ✔️        | The system can generate the code necessary to have object-to-object relations.
| table/field mapping                  | ✔️        | The system can detect `@map` and `@@map` annotations, and apply them accordingly.
| array-type field mapping             | ✔️        | The system can detect whether a particular field is an array type.
| `@id` mapping                        | ✔️        | The system can map a **primary key**.
| multi-field `@id` mapping            | ✔️        | The system can handle multi-field primary keys.
| `@default(uuid())` annotation mapping | ✔️        | The system can specify a limited set of default values for primary key types: integer && string `uuid`.
| `@db.UniqueIdentifier`, `@db.Uuid`   | ✔️        | The system can handle system-specific UUID (aka GUID) types.
| `@db*` annotation mapping (postgres) | ✔️        | The system can tell EntityFramework that your postgres `@db` annotations correspond to important underlying type mappings.
| Basic `Json` type mapping            | ✔️        | The system can retrieve `Json` as a string type.**\***
| `Bytes` type mapping                 | ✔️        | The system can handle the `Bytes` type as a `byte[]`
| `Unsupported` type mapping           | ❌        | " " "
| `@default` annotation mapping        | ❌        | The system cannot yet apply the full range of model annotations based on the `@default` field annotation.
| `@db*` annotation mapping            | ❌        | The system cannot yet apply the full range of model annotations based on the `@db.*` and `@dbgenerated` field annotations, beyond postgres.
| property/class case formating        | ❌        | The system cannot yet massage case conventions, ie `camelCase` to `PascalCase`.
| `@index` annotation mapping          | ❌        | " " "
| `@ignore` annotation mapping         | ❌        | " " "
| `cuid/autoincrement/now`             | ❌        | " " ". Note that `uuid` is implemented for primary keys.
| nuget dependency detection           | ❌        | The system cannot yet autodetect that a nuget dependency is necessary to support the declared db provider.
| enums generation                     | ❌        | The system cannot yet derive `enum`s.
| schema model argument mapping        | ❌        | The system cannot yet handle model argument mapping.


\* *In the future, support may be added for extracting structured types out of `json` & `jsonb` fields.*

## Additional Links

- [EntityFramework 6 documentation](https://docs.microsoft.com/en-us/ef/ef6/)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [DbContext configuration guide](https://docs.microsoft.com/en-us/ef/core/dbcontext-configuration/)
- [Prisma database connector documentation](https://www.prisma.io/docs/concepts/database-connectors)
- [Microsoft.EntityFrameworkCore.SqlServer](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.SqlServer/)
- [Npgsql.EntityFrameworkCore.PostgreSQL](https://www.nuget.org/packages/Npgsql.EntityFrameworkCore.PostgreSQL/)
- [Pomelo.EntityFrameworkCore.MySql](https://www.nuget.org/packages/Pomelo.EntityFrameworkCore.MySql/)
- [Microsoft.EntityFrameworkCore.Sqlite](https://www.nuget.org/packages/Microsoft.EntityFrameworkCore.Sqlite/)
- [Yassin Eldeeb's dev.to](https://dev.to/yassineldeeb)
