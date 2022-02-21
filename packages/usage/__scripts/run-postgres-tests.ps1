docker run --name postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:latest
DO {
  start-sleep -s 1;
  psql -c 'SELECT 1;' postgresql://postgres:password@localhost:5432/postgres > $null;
} UNTIL ($LASTEXITCODE -eq 0)
npm run migrate-postgres-tests
cd csharp-integration-tests\unit-tests
dotnet restore
dotnet test --filter unit_tests.PostgresTests
cd ..\..
docker stop postgres
docker rm postgres