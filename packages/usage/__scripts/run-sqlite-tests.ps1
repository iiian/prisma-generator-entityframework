npm run migrate-sqlite-tests
cd csharp-integration-tests\unit-tests
dotnet restore
dotnet test --filter unit_tests.SqliteTests
cd ..\..