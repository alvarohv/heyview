---
lang: en
title: "KDF Connect: Field Workforce Platform"
tag: "FIELD SERVICES   MOBILE + WEB PLATFORM"
summary: A field services company tracked crew hours on paper and routes from memory. We replaced it with an offline-first iPad app, an admin dashboard, and a REST API for GPS route tracking, QR clock-in, and digital weekly sign-off, all on Azure.
cover: /work/kdf-connect/kdf-connect-cover.jpg
client: KDF
industry: Field Services · Workforce Management
services: Full-Stack Development, Mobile App, Cloud Architecture
period: "2021"
team: Technical Lead, 2 Developers, 2 QA
tools: React Native, .NET Core, Azure, React
year: 2021
order: 5
featured: false
context:
  body: >
    KDF ran field crews across multiple sites. Supervisors tracked hours on
    paper timesheets, crew check-in and check-out happened verbally, and
    route coverage was documented after the fact, if at all. There was no
    structured way to capture what happened in the field during a shift:
    where crews went, what they photographed, or whether the week's hours
    had been formally reviewed and approved. The system needed to work on
    iPads in the field, handle spotty connectivity gracefully, and be
    manageable by a non-technical admin team.
solution:
  intro: >
    We designed a four-component system (mobile app, admin dashboard, REST
    API, and shared design system) deployed on Azure, built around the
    field's real constraint: connectivity you can't count on.
  features:
    - title: "Offline-first field app"
      body: >
        GPS coordinates, photos, and comments queue locally when the iPad
        has no connection. A queue-flush hook drains them in dependency
        order on reconnect, so the server always receives consistent data
        and the supervisor never sees a gap.
    - title: "GPS route tracking & geotagged photos"
      body: >
        Supervisors run a live tracking screen with a full-screen map, the
        crew's GPS trail, and photo capture pinned to a coordinate. Total
        route distance is calculated via the Haversine formula on the
        accumulated waypoints.
    - title: "QR-based clock-in/out"
      body: >
        Each crew member's check-in and check-out is tied to a barcode scan
        rather than a verbal acknowledgment, creating a timestamped
        attendance record per project instead of a disputed memory.
    - title: "Admin visibility"
      body: >
        A 29-page back-office dashboard gives the office team a timesheet
        view with Regular / OT / Double-Time breakdown, a map gallery of
        every geotagged photo across every route, and CSV/print export,
        without depending on supervisors to deliver paperwork.
results:
  intro: >
    Four production components (mobile app, admin dashboard, API, and
    design system) shipped on a fixed-price engagement, live in production
    by August 2021. The offline queue held up under real field conditions
    from day one.
stats:
  - { value: "4", label: "Production components: mobile, admin, API, design system" }
  - { value: "28+", label: "REST API controllers, one system of record" }
  - { value: "3", label: "Time types tracked: Regular, OT, Double-Time" }
  - { value: "5", label: "Person team, proposal to production" }
gallery:
  - src: /work/kdf-connect/kdf-connect-architecture.svg
    caption: "System architecture: mobile app, admin dashboard, API, and design system on Azure."
  - src: /work/kdf-connect/kdf-connect-route-tracker-wireframes.png
    caption: Route Tracker wireframes, annotated. Every layout and interaction decision defended in writing before a line of React Native got written.
  - src: /work/kdf-connect/kdf-connect-weekly-signoff-wireframes.png
    caption: Weekly Sign-Off wireframes, annotated. Designing the moment a week of hours becomes an official, signed record.
  - src: /work/kdf-connect/kdf-connect-admin-dashboard.jpg
    caption: "Admin dashboard: timesheets, employees, projects, and jobs at a glance."
  - src: /work/kdf-connect/kdf-connect-circuit-detail.jpg
    caption: "Circuit detail: full route replay with GPS trail, crew, and geotagged photos."
  - src: /work/kdf-connect/kdf-connect-weekly-signoff.png
    caption: "Weekly sign-off: supervisor approval with digital signature."
  - src: /work/kdf-connect/kdf-connect-new-employee.png
    caption: Employee onboarding with auto-generated QR badge for field check-in.
---

## The situation

KDF ran field crews across multiple sites. Supervisors tracked hours on paper timesheets, crew check-in and check-out happened verbally, and route coverage was documented after the fact, if at all. There was no structured way to capture what happened in the field during a shift: where crews went, what they photographed, or whether the week's hours had been formally reviewed and approved.

The constraint was tight: build for iPad-first, offline-capable, and manageable by a non-technical admin team, with no change to existing workflows beyond switching from paper to tablet.

## What we built

We designed a four-component system (mobile app, admin web dashboard, REST API, and a shared design system) deployed on Azure with one authentication layer across all clients. The key call was architectural: Redux Persist plus an offline queue for the field's connectivity reality, and RTK Query as the data layer for both clients so cache invalidation, token refresh, and loading states were handled consistently.

Before a line of React Native got written, the Route Tracker and Weekly Sign-Off screens were wireframed and defended decision by decision: why the map takes two-thirds of the screen, why actions anchor to the thumb zone, why a hard block on submit was rejected in favor of a supervisor's judgment call. That process is in the gallery below.

**Daily Timesheet.** Supervisors see assigned projects, tap into a project, and check crew members in and out via QR barcode scanner. Each scan resolves to an employee by ID and fires a check-in or check-out mutation against the API, with on-screen handling for edge cases like an employee already checked in.

**Route Tracker.** A live tracking screen combines a full-screen map with the crew's current GPS trail, a side panel of captured photos and comments, and actions to take a picture, add a comment, or end the route. Every photo uploads with its GPS coordinate attached and appears as a map marker immediately. Ending a route triggers a Haversine distance calculation across the accumulated waypoints.

**Weekly Sign-Off.** At end of week, supervisors review per-employee hours against each project, approve individual rows, and submit a final sign-off with a captured digital signature that locks the record server-side.

**Offline-first architecture.** GPS coordinates, photos, and comments are queued locally when the device has no connection. On reconnect, a queue-flush hook drains the queue in dependency order: coordinates, then comments, then images, so the server always receives data in a consistent state. Markers appear on the map immediately from local state; the supervisor never notices a gap.

**Admin dashboard.** A 29-page React back-office application covers the full operational picture: a timesheet dashboard with Regular / OT / Double-Time breakdown and per-diem adjustments, a circuit map gallery plotting every geotagged photo from every route, employee and project management, and CSV/print report export.

**Backend API.** A 28+ controller ASP.NET Core REST API with a layered architecture (Controllers → Core → Infrastructure), JWT auth with refresh tokens, batch GPS coordinate upload for efficient offline-queue flushes, and a custom fields system: a 3-tier schema letting admins track arbitrary production metrics per job per employee without a schema change.

## The outcome

The system replaced paper timesheets with a digital record that captures Regular, OT, and Double-Time hours per employee per project, locked weekly by a supervisor's digital signature. GPS route tracking and geotagged photos gave the back-office team a permanent, map-based record of every circuit run, something that previously existed only as memory and informal photo sharing.

Delivered as a fixed-price engagement, live in production by August 2021, with the offline queue holding up under real field conditions from day one.
