# CodingBible

A full-stack blog and CMS platform: an ASP.NET Core backend serving an Angular
single-page application from the same host.

Developed 2022–2024. No longer actively developed — kept as the record of the original
monolithic implementation.

## Stack

- **Backend** — ASP.NET Core, Entity Framework Core, SQL Server
- **Frontend** — Angular, TypeScript, SCSS (`ClientApp/`)
- **Patterns** — Repository / Unit of Work, service layer, view models

## Layout

| Path | Contents |
| --- | --- |
| `ClientApp/` | Angular single-page application |
| `Controllers/` | MVC and API controllers |
| `Data/` | EF Core `DbContext` and seeding |
| `Migrations/` | EF Core migrations |
| `Models/` | Domain entities |
| `Services/` | Application services |
| `UnitOfWork/` | Repository and unit-of-work implementations |
| `ViewModels/` | DTOs and view models |
| `wwwroot/` | Static assets |

## Running locally

Requires the .NET SDK and Node.js.

```bash
dotnet restore
dotnet ef database update      # applies migrations
dotnet run
```

Connection strings and application settings live in `appsettings.Development.json`.

## Security

See [SECURITY.md](SECURITY.md) for the vulnerability reporting policy.
