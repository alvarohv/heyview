# KDF Connect — Technical Summary

## Overview

KDF Connect is an enterprise field workforce management platform consisting of four components:

| Repo | Role | Stack |
|---|---|---|
| `kdf-connect-api-main` | Backend REST API | C# / .NET Core 3.1 + SQL Server on Azure |
| `kdf-connect-admin-main` | Admin Web Dashboard | React 17 + TypeScript + Redux Toolkit |
| `kdf-connect-mobile-main` | Field Employee Mobile App | React Native + Expo 44 |
| `kdf-connect-frontend-master` | Design System / Pattern Library | Pattern Lab + Tailwind CSS |

The system enables field employees (on iPad/mobile) to record timesheets, clock in/out via QR barcode, track GPS routes with geotagged photos, and submit weekly sign-offs — while administrators manage all of that data through a web dashboard.

---

## 1. Backend API (`kdf-connect-api-main`)

### Framework & Language
- **C# / ASP.NET Core 3.1**
- Multi-project layered architecture:
  - `KDF-timesheet-api` — controllers, middleware, routing, request factories
  - `KDF-Timesheet.Core` — domain models, DTOs, business logic, interfaces, AutoMapper profiles
  - `KDF-Timesheet.Infrastructure` — data access (EF Core), authentication, external service integrations

### Database
- **Microsoft SQL Server** hosted on Azure (`kdf-timesheet.database.windows.net`)
- Entity Framework Core 5.0.7 as ORM
- 199+ migrations tracking schema evolution

### Key Dependencies
| Library | Version | Purpose |
|---|---|---|
| Entity Framework Core | 5.0.7 | ORM / data access |
| AutoMapper | 10.1.1 | Entity ↔ DTO mapping |
| FluentValidation | 10.2.3 | Request validation |
| Azure SignalR | 1.8.2 | Real-time communications |
| Azure Blob Storage SDK | 12.10.0 | Image/signature file storage |
| Azure Application Insights | 2.17.0 | Monitoring & telemetry |
| Swashbuckle / Swagger | 6.1.4 | API documentation |
| JWT Bearer Auth | 3.1.16 | Token-based authentication |
| Newtonsoft.Json | 13.0.1 | JSON serialization |

### Authentication
- JWT access tokens (50-minute expiry) + refresh tokens (100-minute expiry)
- Custom auth middleware for token validation
- Azure AD B2C integration configured
- SMTP email templates for password reset and new user notifications

### Controllers & Endpoints (28+)

**Timesheet Management**
- `TimesheetController` — CRUD (Get, GetAll, GetDate, Add, Update, Delete)
- `TimesheetJobsController` — Job tasks within timesheets (Add, Update, Delete, Get)
- `TimesheetEmployeesController` — Employee-timesheet assignments
- `TimesheetSignOffController` — Weekly approval workflow (query by project + date range, Add, Update, Delete)
- `TimesheetTimeTypeController` — Labor hour classifications (Regular, Overtime, Double Time)
- `PerDiemController` — Daily allowance entries (Add, Update, Delete, Get, bulk AddList)
- `WeeklyPerdiemController` — Weekly per diem aggregation and admin adjustment
- `AdminTimeSheetsController` — Admin-level override operations

**GPS & Route Tracking**
- `RouteByUserController`
  - `StartNewRoute` (POST) — creates route with start GPS, circuit name, crew list
  - `FinishRoute` (PATCH) — ends route with end GPS, calculates total distance via Haversine formula
  - `GetToday` — today's routes
  - Week counters: all / in-progress / finished routes by user
- `GpsCoordinateByRouteByUserController`
  - `Insert` — single GPS waypoint (lat/long/description)
  - `InsertMany` — batch coordinate upload
  - `GetTodayCoordinatesByUser`, `GetCoordinatesByRoute`

**Image Capture & Storage**
- `ImageByGpsCoordinateByRouteByUsersController`
  - `AddImage` (POST, multipart/form-data) — photo upload tied to GPS coordinate + route, stored to Azure Blob in `RouteByUserId_{id}/` folder structure
  - `AddComment` — text annotation at a coordinate
  - `GetTodayImagesByUser`, `GetTodayImagesCommentsByUser`, `GetImagesCommentsByRoute`
  - `DeleteImage(s)`, `DeleteComment`

**Custom Fields System**
- `CustomFieldsController` — base field definitions (name, type)
- `CustomFieldsByFieldMeasurementsController` — measurement units per field
- `CustomFieldsByFieldMeasurementsByJobsController` — field mappings to jobs
- `CustomFieldsByFieldMeasurementsByJobsByTimesheetJobController` — actual values during timesheet entry

**Employee & User Management**
- `EmployeeController` — CRUD, soft enable/disable, active count
- `EmployeeTypeController` — employee classifications
- `EmployeeRouteByUserController` — employee-route assignments
- `UserController` — user account management
- `RoleController` / `UsersRolesController` — role definitions and assignments
- `AuthenticateController` — login, refresh, logout

**Project & Job Management**
- `ProjectController`, `JobController`, `PositionController` — full CRUD

**Reporting**
- `ReportsController`
  - `GetTimeSheetsEmployeesHours` — hours by employee + date range
  - `GetTodayTimeSheetsEmployeesHours` — daily hours snapshot

### Custom Fields Architecture (3-Tier)
```
CustomFields (base definition: name, type)
  └── CustomFieldsByFieldMeasurements (measurement unit: e.g. "Cubic Yards")
        └── CustomFieldsByFieldMeasurementsByJobs (mapped to specific jobs)
              └── CustomFieldsByFieldMeasurementsByJobsByTimesheetJobs (actual value entered)
```
Enables tracking of production metrics, material quantities, equipment codes, and quality assessments — all per job per employee per timesheet.

### Deployment
- Azure DevOps CI/CD pipeline
- Azure App Service (production: `foresttryapidev`)
- Artifacts packaged as single ZIP for deployment

---

## 2. Admin Web Dashboard (`kdf-connect-admin-main`)

### Framework & Language
- **React 17.0.2** + **TypeScript 4.0.3**
- Express.js server for production static serving

### State Management
- Redux Toolkit with 14+ slices: `auth`, `timeSheets`, `employees`, `positions`, `jobs`, `projects`, `users`, `notifications`, `mapView`, `circuits`, `customFields`
- RTK Query (Redux Query) for normalized API data fetching
- Redux Persist for auth state persistence
- Redux Logger for development debugging

### Key Dependencies
| Library | Version | Purpose |
|---|---|---|
| Material-UI (MUI) | 5.4.1 | Primary UI component library |
| Tailwind CSS | 2.1.2 | Utility-first styling |
| React Router DOM | v6 | Client-side routing |
| React Hook Form | 7.4.2 | Form state management |
| Axios | 0.21.1 | HTTP client |
| date-fns | 2.22.1 | Date utilities |
| Moment.js | 2.29.1 | Date formatting |
| Emotion | 11.7.1 | CSS-in-JS |
| react-to-print | 2.12.6 | Print-ready timesheet views |
| react-csv | 2.0.3 | CSV export |
| react-qr-code | 1.1.1 | QR code generation |
| react-dropzone | 12.0.5 | File upload input |
| RSuite | 4.10.2 | Supplemental component library |

### Pages & Features (29+)

**Authentication**
- `LoginPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `LogoutPage`

**Timesheet Management**
- `TimeSheetDashboardPage` — master list with filters by employee name, position, date range, and approved hours
- `TimeSheetEmployeePage` — per-employee editing:
  - `TimeCard` — employee name, position, crew #, truck #, weekly hours summary
  - `TimeSlot` — Regular / OT / Double-Time hours + per diem adjuster
  - `TimeTable` — day-by-day editable hours with job assignments
  - Batch save via `updateTimeByTimesheetEmployeeList`
  - Per diem updates go to `WeeklyPerdiemByPerdiemByTimeSheetEmployee`

**Circuit / Route Management**
- `CircuitsDashboardPage` — all routes with search/filter controls
- `ViewCircuitPage` — full interactive circuit detail:
  - Google Maps integration with all GPS coordinates as markers
  - All geotagged photos overlaid on the map
  - Click marker → `MapImageInfo` panel shows image detail
  - Sidebar with route metadata (name, date, distance, crew)

**Map Gallery**
- `MapGalleryPage` — system-wide image gallery on a single map
  - Filter by date range (defaults to last month) and circuit name
  - Every photo/comment from every route appears as a map marker
  - Click marker → image detail with delete option (confirmation modal) and download

**Employee Management**
- `EmployeesDashboardPage` — full roster
- `RegisterEmployeePage`, `EditEmployeePage` — onboarding and updates
- `AssetManagementPage` — equipment/vehicle tracking per employee

**Project, Job & Position Management**
- Full CRUD pages for each: dashboard → create → edit → view

**User & System Administration**
- `AdminDashboardPage` — system stats overview
- `SystemDashboardPage` — configuration panel
- `CreateNewUserPage`, `EditUserPage` — account management
- Role assignment

**Export & Print**
- Print-ready timesheet layouts via `react-to-print`
- CSV export via `react-csv`
- QR code generation for field use (employee/job identification)

### Project Structure
```
src/
├── components/     — shared UI (SideNav, Layout, Table, Modal, DatePicker, etc.)
├── pages/          — 29+ page components
├── redux/          — 14+ slices + RTK Query API config
├── utils/          — utility functions
├── styles/         — global styles
├── config/         — app configuration (base URL, env)
├── types/          — TypeScript type definitions
├── routers/        — route definitions with auth guards
└── assets/         — static assets
```

### Deployment
- Azure Static Web Apps

---

## 3. Field Employee Mobile App (`kdf-connect-mobile-main`)

### Framework & Language
- **React Native 0.64.3** + **Expo 44.0.1** (managed workflow)
- **TypeScript 4.5.2**

### State Management
- Redux Toolkit + RTK Query with custom base query (handles token refresh transparently)
- Redux Persist for offline-first local storage
- Store migrations system for backward-compatible schema versioning across app updates
- MobX 6.1.8 + mobx-react-lite (dual state management available)

### Key Dependencies
| Library | Version | Purpose |
|---|---|---|
| expo-location | 14.0.1 | GPS location tracking |
| React Native Maps | 0.29.4 | Map display |
| haversine | 1.1.1 | GPS distance calculation |
| expo-camera / expo-image-picker | — | Photo capture |
| react-native-keychain | 6.2.0 | Secure credential storage |
| expo-barcode-scanner | 11.2.0 | QR/barcode scanning |
| react-native-signature-canvas | 4.0.0 | Employee signature capture |
| react-hook-form | 7.3.6 | Form state management |
| apisauce | 2.0.0 | Network-aware HTTP client |
| @react-native-community/netinfo | — | Network status monitoring |
| luxon | 2.0.1 | Date/time handling |
| react-native-calendars | 1.1264.0 | Calendar UI |
| React Navigation | 6.x | Screen routing (native-stack, drawer, tabs) |
| Detox | — | E2E testing on iOS simulator |
| Storybook | 5.3.25 | Component-driven development |

### Feature Modules & Screens

#### Authentication
- Email/password login
- JWT stored in device keychain; persists across restarts
- Token refresh handled transparently by RTK Query custom base query

#### Daily Timesheet
1. **`ProjectsScreen`** — lists today's assigned projects
2. **`ProjectDetailScreen`** — project info + assigned crew; **Check In** and **Check Out** buttons
3. **`ScannerScreen`** — barcode/QR scanner:
   - Camera opened via `expo-barcode-scanner`
   - Parses format: extracts employee ID from `"{id};#;{info}"` delimiter pattern
   - Calls `useCheckInMutation` or `useCheckOutMutation`
   - Error handling: "check-in already done", "employee not found", "no check-in registered"
   - Returns to previous screen with notification on success/failure

#### Route Tracker
1. **`RoutesScreen`** — list of all routes (in-progress and completed)
2. **`RunningRouteScreen`** — active tracking screen:
   - **Map**: Full-screen with current location marker, GPS waypoints, photo/comment markers, selected image highlighted
   - **Route Panel**: Route name, start time, distance traveled, list of captured images/comments
   - **Take Picture** → camera → optional caption → `AddImage` mutation (lat/long + photo + comment)
   - **Add Comment** → modal text entry → `AddComment` mutation (lat/long + text)
   - **End Route** → confirmation → `FinishRoute` mutation (end GPS + total distance)
3. **`RouteDetailScreen`** — historical view of a completed route (map + all images)

#### Weekly Sign-Off
1. **`WeeklyProjectsScreen`** — projects for the selected week
2. **`ProjectSignOffScreen`**:
   - `EmployeeSignOffList` — employee name, hours, status (approved / pending)
   - Tap row → view/edit individual employee hours
   - **Submit** → checks all employees approved; if not, confirms "Continue with unsigned employees?"
   - `SubmitTimesheetModal` → final lock confirmation → sign-off mutation with approval timestamp

### Offline-First Architecture

The `routeSlice` Redux state maintains an `offlineQueue` array. When the device is offline:

```
Offline Request Structure:
{
  endpointName: 'addCoordinate' | 'addComment' | 'addImage',
  requestId: UUID,
  body: { latitude, longitude, ... }
}
```

- GPS coordinates, photos, and comments are dispatched as `offlineRequestAdded` with a UUID
- They appear on the map immediately (merged with API data; UUID used as temporary marker ID)
- `useOfflineQueueFlush` hook monitors `netInfo.isConnected`
- On reconnect: iterates queue in order (`addCoordinate` → `addComment` → `addImage`) and fires each mutation
- Busy/sync spinner shown during flush; queue cleared on success

### Project Structure
```
src/
├── app/
│   ├── store.ts           — Redux store + persist config
│   ├── services/          — RTK Query API service definitions
│   ├── hooks.ts           — typed Redux hooks
│   ├── migrations.ts      — store schema versioning
│   └── RootNavigator.tsx  — main navigation tree
├── features/
│   ├── auth/              — login, authentication screens
│   ├── daily-timesheet/   — clock in/out, time entry, scanner
│   ├── route-tracker/     — GPS tracking, map, photo capture
│   └── weekly-sign-off/   — weekly review, signature, approval
├── common/
│   ├── components/        — reusable UI components
│   ├── types.ts           — shared TypeScript types
│   ├── styles.ts          — Tailwind RN styling
│   ├── utils/             — utilities
│   ├── hooks/             — custom hooks
│   └── i18n/              — internationalization
└── assets/                — images, fonts
```

### Deployment
- Expo EAS Build for iOS and Android
- Detox for E2E testing

---

## 4. Design System / Pattern Library (`kdf-connect-frontend-master`)

### Framework
- **Pattern Lab 5.14.2** — atomic design methodology
- **Handlebars** templating engine
- **Gulp 4.0.2** build pipeline + PostCSS

### Styling
- Tailwind CSS 2.1.2
- SASS + PostCSS (autoprefixer, purgecss for production, nested, imports)
- Line Awesome icon library

### Purpose
Centralized UI component library serving as single source of truth for visual design. Documents atoms, molecules, and organisms that both the Admin and Mobile apps reference for consistency.

### Deployment
- Firebase Hosting (static site)

---

## Cross-Cutting Concerns

### Authentication Flow (All Clients)
```
Login → JWT access token (50 min) + refresh token (100 min)
     → Stored in Redux (Admin) or device keychain (Mobile)
     → Refresh handled transparently by RTK Query base query
     → Logout invalidates token on API
```

### Shared Data Model
Core entities consistent across TypeScript types and C# DTOs:
- `Employee`, `EmployeeType`, `Position`
- `Project`, `Job`, `CustomField`
- `Timesheet`, `TimesheetJob`, `PerDiem`
- `Route`, `GpsCoordinate`, `Image`, `Comment`
- `SignOff`

### API Communication Pattern
- Both Admin and Mobile consume the same ASP.NET Core API
- RTK Query for normalized caching and automatic re-fetching
- JWT passed in `Authorization: Bearer` headers
- CORS configured for localhost, Azure, and Firebase origins

### Offline & Sync Strategy
| Client | Offline Capability |
|---|---|
| Mobile | Full offline-first: Redux Persist + request queue, ordered flush on reconnect |
| Admin | Connectivity-required (web browser) |

### Infrastructure & Deployment
| Component | Platform |
|---|---|
| API | Azure App Service (Azure DevOps CI/CD) |
| Database | Azure SQL Server |
| File Storage | Azure Blob Storage (CDN for images/signatures) |
| Admin Frontend | Azure Static Web Apps |
| Design System | Firebase Hosting |
| Mobile App | Expo EAS Build (iOS + Android) |

---

## Technology Stack at a Glance

| Layer | Technology |
|---|---|
| **Backend** | C# / .NET Core 3.1, ASP.NET Core Web API |
| **Database** | Microsoft SQL Server on Azure |
| **ORM** | Entity Framework Core 5.0.7 |
| **File Storage** | Azure Blob Storage |
| **Real-time** | Azure SignalR |
| **Admin Frontend** | React 17, TypeScript, Redux Toolkit, MUI, Tailwind CSS |
| **Mobile Frontend** | React Native (Expo 44), TypeScript, Redux Toolkit, RTK Query |
| **Design System** | Pattern Lab 5, Tailwind CSS, Handlebars |
| **Authentication** | JWT tokens + refresh tokens, Azure AD B2C |
| **CI/CD** | Azure DevOps (API), GitHub Actions (Admin), Expo EAS (Mobile) |
| **Hosting** | Azure (API + Admin), Firebase (Design System), Expo (Mobile) |
| **Monitoring** | Azure Application Insights |
