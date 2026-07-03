# KDF Connect — Field Workforce Management Platform

> A purpose-built mobile + web platform that replaced paper timesheets and verbal crew briefings for a field services company — GPS route tracking, QR-based clock-in/out, geotagged photos, and weekly sign-off with digital signature, all synced through a single ASP.NET Core API on Azure.

---

## Overview

|  |  |
|---|---|
| **Client / Company** | KDF (Field Services) |
| **Industry** | Field Services · Workforce Management |
| **Type** | `Tojii` (Fixed-price engagement — branded as Tojii by Alvaro) |
| **Role** | Technical Lead · Full-Stack Engineer |
| **Team** | 1 PM · 2 Developers · 2 QA |
| **Period** | 2021 (Live: August 29, 2021) |
| **Engagement Value** | $26,000 fixed-price |
| **Status** | `Delivered` — launched to production |
| **Visibility** | `Source-of-truth doc` — derivatives (LinkedIn, website, deck) to be spun off once brand guide is finalized |

---

## Context

KDF ran field crews across multiple sites. Supervisors tracked hours on paper timesheets, crew check-in and check-out happened verbally, and route coverage was documented after the fact — if at all. There was no structured way to capture what happened in the field during a shift: where crews went, what they photographed, or whether the week's hours had been formally reviewed and approved.

The business needed a system that worked on iPads in the field, handled spotty connectivity gracefully, and gave the back-office team visibility they didn't have — without requiring a change to existing workflows beyond switching from paper to tablet.

The constraint: build for iPad-first, offline-capable, and manageable by a non-technical admin team.

---

## My Contribution

### Architecture & Technical Lead

Designed a four-component system — mobile app, admin web dashboard, REST API, and design system — deployed fully on Azure, with a shared data model and a single authentication layer across all clients.

Made the key architectural calls: Expo managed workflow for faster iPad deployment without native tooling overhead; Redux Persist + offline queue for the field's connectivity reality; RTK Query as the data layer for both clients so that cache invalidation, token refresh, and loading states were handled consistently.

### Mobile App (React Native / Expo)

Built the field-facing iPad app across four feature modules:

**Daily Timesheet** — Supervisors see assigned projects, tap into a project, and check crew members in and out via QR barcode scanner. Each scan resolves to an employee by ID from the encoded string and fires a check-in or check-out mutation against the API. Error states (already checked in, employee not found, no check-in to close) handled with on-screen feedback.

**Route Tracker** — The live tracking screen combines a full-screen map with the crew's current GPS trail, a side panel listing captured photos and comments, and bottom-bar actions (Take Picture, Add Comment, End Route). Each photo is uploaded with its GPS coordinate attached, stored to Azure Blob Storage under a per-route folder, and immediately appears as a map marker. When the route is ended, the Haversine formula calculates total distance from the accumulated waypoints.

**Weekly Sign-Off** — At end of week, supervisors review per-employee hours against each project, approve individual rows, and submit a final sign-off with a captured digital signature. The modal shows total hours, overtime, and employee count for the week as a summary before locking the record.

**Offline-First Architecture** — GPS coordinates, photos, and comments are queued locally when the device has no connection (`offlineRequestAdded` to a Redux slice). On reconnect, a `useOfflineQueueFlush` hook drains the queue in dependency order (`addCoordinate` → `addComment` → `addImage`) so the server always receives data in a consistent state. Markers appear on the map immediately from local state — the user never sees a gap.

### Admin Web Dashboard (React / TypeScript)

Built the back-office web application with 29+ pages covering the full operational picture:

- Timesheet dashboard with filters by employee, position, and date range; per-employee editing with Regular / OT / Double-Time hour breakdown and per-diem adjustments
- Circuit map gallery — every geotagged photo from every route plotted on a single Google Maps view, filterable by date and circuit name; click any marker to see the image
- Circuit detail view — full route replay with map, crew metadata, duration, and side-by-side image list
- Employee management (roster, onboarding, asset tracking), project / job / position CRUD
- Report export (CSV download, print-ready layouts via `react-to-print`)
- QR code generation for field use

### Backend API (.NET Core 3.1)

Designed and built a 28+ controller ASP.NET Core REST API with a multi-project layered architecture (Controllers → Core → Infrastructure). Key design decisions:

- **Custom fields system** — a 3-tier schema (field definition → measurement unit → job mapping → timesheet value) that lets admins track arbitrary production metrics (cubic yards, equipment codes, quality scores) per job per employee without schema changes
- **JWT auth** — 50-minute access tokens + 100-minute refresh tokens; custom middleware for validation; Azure AD B2C integration; SMTP templates for password reset and new user notifications
- **GPS + image endpoints** — batch coordinate upload (`InsertMany`) for efficient flush from the mobile offline queue; image upload as multipart/form-data tied to GPS coordinate + route, stored to Azure Blob in per-route folder structure
- **Haversine distance calculation** — server-side total distance computed on `FinishRoute` from the accumulated GPS waypoints
- **Azure SignalR** wired for real-time communication where needed

### Design System (Pattern Lab)

Set up a Pattern Lab 5 atomic design library — atoms, molecules, organisms — as the single visual source of truth for both the Admin and Mobile apps. Served from Firebase Hosting; built with Tailwind CSS, SASS, PostCSS, and Gulp.

---

## Tools & Deliverables

| Category | Detail |
|---|---|
| **Mobile** | React Native 0.64 · Expo 44 · TypeScript · Redux Toolkit + RTK Query · Redux Persist |
| **Admin Web** | React 17 · TypeScript · Redux Toolkit · MUI 5 · Tailwind CSS · React Router v6 · React Hook Form |
| **API** | C# · ASP.NET Core 3.1 · Entity Framework Core 5 · AutoMapper · FluentValidation · JWT Bearer Auth · Swagger |
| **Design System** | Pattern Lab 5 · Tailwind CSS · Handlebars · Gulp · SASS |
| **Infrastructure** | Azure App Service · Azure SQL Server · Azure Blob Storage · Azure SignalR · Azure AD B2C · Azure Application Insights · Azure DevOps CI/CD |
| **Mobile Deployment** | Expo EAS Build (iOS + Android) |
| **GPS** | Haversine formula for route distance · `expo-location` for coordinate capture · React Native Maps |
| **Other** | `expo-barcode-scanner` (QR check-in) · `react-native-signature-canvas` (weekly sign-off) · Detox (E2E) · Storybook |
| **Deliverables** | 4 production repos · Architecture diagram · App screenshots · Proposals |

---

## Results & Impact

- 📱 **Replaced paper timesheets** with a digital system that captures Regular, OT, and Double-Time hours per employee per project — with a weekly sign-off flow that locks the record with a digital signature.
- 📍 **GPS route tracking live** — supervisors record complete field routes with timestamped GPS waypoints and geotagged photos, giving the back-office team a permanent map-based record of every circuit run.
- 📷 **Geotagged photo documentation** — every field photo is pinned to a GPS coordinate and visible on the Admin map gallery, replacing informal after-the-fact photo sharing.
- 🔲 **QR-based clock-in/out** — each employee's check-in and check-out is tied to a barcode scan rather than a verbal acknowledgment, creating a timestamped attendance record per project.
- 🔌 **Offline-first field app** — GPS tracking, photo capture, and comments work without network connectivity; data syncs automatically on reconnect in the correct dependency order.
- ✍️ **Digital weekly sign-off** — supervisors approve hours and sign digitally on the iPad; the approval record is timestamped and locked server-side.
- 🗂️ **Admin visibility** — back-office team can view timesheets across all employees, filter by date and position, adjust per-diem entries, export CSVs, and print reports — without depending on supervisors to deliver paper.
- 🚀 **Delivered on schedule** — fixed-price engagement, live August 29, 2021.

---

## Artifacts

| Type | Location |
|---|---|
| Architecture diagram (SVG) | `KDF-Connect/kdf-connect-architecture.svg` |
| App screenshots (7) | `KDF-Connect/Screenshots/` — admin dashboard, timesheets, new employee; mobile circuit detail/tracking, weekly sign-off, app screen |
| Technical summary | `KDF-Connect/Resources/TECH_SUMMARY.md` |
| Crew roster (XLSX) | `KDF-Connect/Resources/Crew Roster.xlsx` |
| Original proposal (PDF) | `KDF-Connect/Resources/KDF- Proposal .pdf` |
| Proposal deck (PPTX) | `KDF-Connect/Resources/KDF Proposal.pptx` |
| Presentation deck (PPTX) | `KDF-Connect/Resources/KDF Presentation.pptx` |
| Estimates workbook (XLSX) | `KDF-Connect/Resources/KDF.xlsx` |
| Raw footage, RAW photos, meeting recordings | Moved to cold storage — see `KDF-Connect/SOURCE-MEDIA.md` |

---

## Confidentiality

Architecture, technical patterns, and product decisions described here are general software engineering practice and safe to share.

**Do not publish:** any specific client operational data, real employee names, or internal system credentials.

**Safe to reference:** mobile offline-first architecture, React Native + Expo field app design, Azure infrastructure setup, custom fields system, GPS + photo pipeline, QR check-in pattern.

---

## Reusable Content Blocks

> *Pre-formatted building blocks for derivatives. Mix-and-match when the brand guide is ready.*

### Headline variants

| Channel | Headline |
|---|---|
| **Long form (website case study, deck cover)** | *Built KDF Connect — a full-stack field workforce platform with GPS route tracking, offline-first mobile, and digital timesheets — from proposal to production in under a year.* |
| **Medium (portfolio card, deck tile)** | *Purpose-built mobile + web platform for field crews — React Native iPad app, ASP.NET Core API, React admin dashboard, deployed on Azure.* |
| **Short (LinkedIn hook, deck subtitle)** | *Paper timesheets → GPS-tracked, QR-clocked, digitally signed. Built end-to-end.* |
| **Tagline (one-pager footer)** | *React Native · .NET Core · Azure · Field Workforce · 2021* |

### Hero stats (use 1–2 per asset)

- **4 production components** — mobile app, admin dashboard, REST API, design system
- **28+ API controllers** — timesheets, GPS, images, employees, projects, reports
- **Offline-first** — Redux queue keeps GPS and photos flowing without connectivity
- **$26,000 fixed-price** — delivered on schedule, live August 29, 2021
- **3 time types** — Regular, OT, and Double-Time tracked per employee per project
- **End-to-end** — from proposal to production with a team of 5

### Pull-quote candidates

- *"The field's connectivity reality was non-negotiable. GPS coordinates, photos, and comments queue locally and flush in dependency order on reconnect — the supervisor never sees a gap."*
- *"A custom fields system with a 3-tier schema means admins can add new production metrics — cubic yards, equipment codes, quality scores — to any job without a schema change."*
- *"QR check-in replaced verbal attendance tracking. Each scan creates a timestamped, server-side record — no disputes, no paper."*
- *"The design system was the quiet multiplier — one source of truth for atoms and molecules meant the admin and mobile apps looked and behaved consistently without coordinating by hand."*

### Story arc (LinkedIn / website narrative shape)

1. **Hook** — Field crews clocked in verbally. Routes were recounted after the fact. Hours lived on paper.
2. **Stakes** — No record of where crews went, what they photographed, or whether the week's hours were correct until the paperwork hit the office.
3. **Constraint** — iPad-first, offline-capable, manageable by a non-technical admin. No enterprise tooling budget.
4. **Move** — Four components, one Azure backend: React Native for the field, React admin for the office, ASP.NET Core API as the single system of record, Pattern Lab for design consistency.
5. **Detail that mattered** — The offline queue. Field apps that assume connectivity fail exactly when you need them most. GPS, photos, and comments are local-first and sync in dependency order on reconnect.
6. **Result** — Timesheets go digital with Regular/OT/Double-Time breakdown and weekly sign-off. Every route is a GPS trail with geotagged photos. Check-in is a QR scan. The admin team has a map gallery of the entire field operation.

### Channel-specific notes

- **LinkedIn**: Lead with the offline-first architecture decision — it's the technical detail that signals field software fluency. The QR check-in and GPS map gallery are strong visual anchors for a carousel.
- **Website case study**: Full narrative + architecture diagram + 2–3 screenshots (Admin Dashboard, Circuit Map, Weekly Sign-Off modal). Hero stats panel. End with a note on mobile-first field tooling for the SMB market.
- **Pitch deck**: Problem / solution split: left side paper timesheets → right side app screenshot. One stat per tile (4 components, offline-first, $26k fixed, live in 2021).
- **Cold email / DM intro**: "For a field services company, I built a full-stack workforce management platform — React Native iPad app for the field, React web admin for the office, all on Azure. Offline-first GPS tracking, QR clock-in, digital timesheets. Happy to walk through the architecture."

### What I'd say in a sales conversation

> "Field workforce tools either ignore connectivity or pretend it's solved. At KDF, the brief was straightforward: replace paper timesheets and informal attendance tracking with something that actually works in the field. The deliverable was four components — a React Native iPad app, a React admin dashboard, a .NET Core API, and a shared design system — all on Azure. The detail that made the field app reliable was the offline queue: GPS coordinates, photos, and comments are local-first, sync in dependency order on reconnect, and appear on the map immediately from local state so the supervisor never notices a gap. Fixed price, delivered on schedule, $26k. That's the kind of engagement I look for — clear scope, real operational problem, measurable outcome."

---

## Portfolio Notes

- **Best for:** Demonstrating full-stack mobile product delivery — React Native field apps, .NET Core API design, React admin dashboards, Azure infrastructure, and offline-first architecture. Shows end-to-end ownership from proposal to production on a fixed-price engagement.
- **Headline:** *Built KDF Connect — a full-stack field workforce management platform — mobile iPad app, admin web dashboard, REST API, and design system — from proposal to production, fixed-price, live August 2021.*
- **Positioning angle:** Use alongside the JnJ SWAV What-if Tool and Capacity Model to show a recurring pattern: Tojii and contractor engagements that take real operational pain (manual processes, paper systems, no field visibility) and replace them with purpose-built software.
- **Tags:** `#tojii` `#react-native` `#expo` `#dotnet` `#azure` `#field-services` `#workforce-management` `#mobile` `#fullstack` `#2021`

---

*Tags: #portfolio #tojii #react-native #dotnet #azure #mobile #fullstack #2021*
