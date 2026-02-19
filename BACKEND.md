# EventStaff Pro Backend Specification

This document outlines the required backend architecture and API endpoints to support the **EventStaff Pro** high-end staff management and access control system.

## 1. High-Level Architecture
The backend should be built using a modern, scalable stack to handle high-concurrency scanning during large-scale events.

- **Engine:** Node.js with Express or Fastify.
- **Real-time:** Socket.io for live dashboard updates and staff presence.
- **Database:** PostgreSQL (Relational data) + Redis (High-speed scan caching & rate limiting).
- **Authentication:** JWT (JSON Web Tokens) with short TTL for staff sessions.

---

## 2. Core Entities (Database Schema)

### `Staff`
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password_hash`: String
- `name`: String
- `role`: Enum (`SUPERVISOR`, `GATEKEEPER`, `SECURITY`)
- `status`: Enum (`online`, `offline`)
- `current_gate_id`: UUID (FK to Gates)
- `last_active_at`: Timestamp

### `Attendees`
- `id`: UUID (Primary Key)
- `bracelet_uid`: String (Unique, QR Hash)
- `name`: String
- `tier`: Enum (`VIP`, `GA`, `STAFF`, `BACKSTAGE`)
- `photo_url`: String
- `total_scans_allowed`: Integer
- `scans_remaining`: Integer

### `AccessLogs`
- `id`: UUID (Primary Key)
- `bracelet_id`: String (FK to Attendees)
- `staff_id`: UUID (FK to Staff)
- `gate_id`: UUID (FK to Gates)
- `status`: Enum (`SUCCESS`, `FAILED`, `DUPLICATE`)
- `error_type`: String (e.g., "Expired", "Wrong Gate")
- `timestamp`: Timestamp

---

## 3. API Endpoints

### Authentication
- `POST /api/auth/login`: Authenticates staff and returns a JWT.
- `POST /api/auth/logout`: Invalidates the session.

### Gates & Assignments
- `GET /api/gates`: Returns all gates and their current staff occupancy.
- `POST /api/gates/assign`: Assigns a staff member to a specific gate for their current shift.

### Scanning & Validation
- `POST /api/scan/verify`: 
    - **Input:** `bracelet_uid`, `gate_id`, `staff_id`.
    - **Logic:** Checks if UID exists, checks tier against gate permissions, checks for duplicates (Redis lookup).
    - **Output:** Returns full attendee profile and success/failure status.

### Monitoring & Analytics
- `GET /api/dashboard/stats`: Returns aggregate data (Total check-ins, entry rate, tier breakdown).
- `GET /api/logs`: Paginated access logs with filtering by status/gate.
- `GET /api/staff`: Returns list of all active staff and their locations.

---

## 4. Real-time Integration (WebSockets)

To support the **"Live Updating"** feature in the `AccessLogs` and `Dashboard` views:
- **Event `new_scan`**: Broadcasted to all Supervisors when any gate records a scan.
- **Event `stats_update`**: Emitted every 15 seconds with fresh entry rates and capacity percentages.
- **Event `staff_presence`**: Updates when a staff member toggles online/offline or changes gates.

---

## 5. Security Protocols

1. **Rate Limiting:** Implement strict rate limiting on `/verify` to prevent "brute-force" scanning of generated QR codes.
2. **QR Signing:** Bracelet UIDs should be signed hashes to prevent spoofing.
3. **Audit Trail:** Every scan failure (especially `FAILED` attempts) should trigger a high-priority log for Security roles.
4. **Idempotency:** Ensure the same scan processed twice (due to network lag) is handled as a single event via idempotency keys.

---

## 6. Implementation Notes for Frontend
- The frontend expects `process.env.API_BASE_URL` to be configured.
- Socket listeners should be initialized in a custom hook (e.g., `useLiveStats`).
- Ensure the `max-w-[430px]` constraint is respected even during heavy data loading states.
