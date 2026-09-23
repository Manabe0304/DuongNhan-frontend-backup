# DuongNhan.Web — Rebuilt Frontend

This version rebuilds the customer-facing UI from `duongnhan-project2 (1)` as Blazor components inside the existing `DuongNhan.Web` project.

## What was changed

- Rebuilt the main Dưỡng Nhan UI using Bootstrap 5 + custom CSS in `wwwroot/app.css`.
- Added public pages:
  - `/`
  - `/login`
  - `/register`
  - `/scan` and `/upload`
  - `/doctors`
  - `/products`
  - `/pricing`
  - `/contact`
- Added customer pages:
  - `/dashboard`
  - `/profile`
  - `/history`
  - `/diagnosis/{id}`
  - `/recommendations`
  - `/subscription/current`
  - `/subscription/usage`
- Added C# application service layer:
  - `Services/DuongNhanApiService.cs`
  - `Services/AuthHeaderHandler.cs`
  - `Services/UiSessionService.cs`
  - `Services/DoctorCatalogService.cs`
- Existing `Api`, `Constants`, `Extensions`, and service infrastructure are kept and wired into the rebuilt frontend.
- Refit clients now attach the stored bearer token automatically to API requests.
- Skin upload uses `ISkinApi`, product pages use `IProductApi`, subscription pages use `ISubscriptionApi`, user data uses `IUserApi`, and authentication uses `IAuthApi`.
- The doctor booking UI is preserved from the React version as a frontend workflow because the supplied `Api` folder does not contain a doctor-booking API.

## Important integration note

`DuongNhan.Web.csproj` references `DuongNhan.Shared` and `DuongNhan.ServiceDefaults`. Those projects were not included as source projects in the supplied `DuongNhan.Web.zip`; only their compiled DLLs were present. Therefore this archive intentionally keeps the original project references. Put this rebuilt `DuongNhan.Web` folder back into the original solution containing those projects.

The API service-discovery URL remains `https+http://apiservice`, matching the supplied `Extensions/RefitExtensions.cs`.

## Run

From the full solution root:

```bash
dotnet restore
dotnet run --project DuongNhan.Web
```

For Aspire/service discovery, start the solution through the existing AppHost so `apiservice` resolves correctly.
