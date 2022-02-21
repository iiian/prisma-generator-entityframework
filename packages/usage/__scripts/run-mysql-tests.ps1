docker run --name mysql -e MYSQL_ALLOW_EMPTY_PASSWORD=yes -e MYSQL_DATABASE=master -p 3306:3306 -d mysql:latest
DO {
  start-sleep -s 1;
  mysql --user=root --execute='show DATABASES;' > $null;
} UNTIL ($LASTEXITCODE -eq 0)
npm run migrate-mysql-tests
cd csharp-integration-tests\unit-tests
dotnet restore
dotnet test --filter unit_tests.MysqlTests
cd ..\..
docker stop mysql
docker rm mysql