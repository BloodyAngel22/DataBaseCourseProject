# DataBaseCourseProject

## About the Project

**DataBaseCourseProject** is a course project that implements a database for organizing the university exam session process. The project uses PostgreSQL for data storage, .NET for the backend, and React (Next.js) for the frontend.

## Dependencies

Before running the project, ensure the following dependencies are installed:

- [PostgreSQL](https://www.postgresql.org/download/) — Database
- [.NET SDK](https://dotnet.microsoft.com/en-us/download) — Backend
- [Yarn](https://yarnpkg.com/lang/en/) / [npm](https://www.npmjs.com/) — Frontend package manager

## Running the Project

### 1. Import the Database

Before starting the server, the database needs to be imported. This can be done in one of the following ways:

**Using an SQL Script:**

```sh
psql -U postgres -d session_test -f backup.sql
```

**Using a Dump File:**

```sh
pg_restore -U postgres -d session_test -v backup.dump
```

> ⚠️ **Important!** Make sure the `session_test` database is created in PostgreSQL before importing.

### 2. Start the Server

Once the database is successfully restored, you can start the server in one of the following ways:

**Via Script:**

```sh
./projectStart.sh
```

**Or Manually via .NET:**

```sh
dotnet run --project Host/Host.csproj
```

## Project Structure

- `Host/` — Entry point for the application, managing the startup of both the backend (API) and frontend (React/Next.js) using .NET Aspire.
- `ServiceDefaults/` — General settings and configurations for services (.NET Aspire).
- `backend/` — Backend of the application, implementing the API (Web API using .NET).
- `frontend/` — Frontend of the application, built with React (Next.js).
- `projectStart.sh` — Script for starting the entire application.