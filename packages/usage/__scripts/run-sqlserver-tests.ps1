docker run --name sqlserver -e MSSQL_PID=Developer -e ACCEPT_EULA=Y -e SA_PASSWORD=iStH1sGooDeNouGhMicroSoFt -p 1433:1433 -d mcr.microsoft.com/mssql/server:2019-latest
start-sleep -s 10;
npm run migrate-sqlserver-tests
cd csharp-integration-tests\unit-tests
dotnet restore
dotnet test --filter unit_tests.SqlServerTests
cd ..\..
docker stop sqlserver
docker rm sqlserver