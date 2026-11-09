# CampusConnect API Specification (v1)

Base URL (local): `http://localhost:3000`

This document is the contract between the React front end and the Express backend.
The three endpoints in Section 1 are fixed and must not change.

## Conventions

- Addresses name **things** (nouns), never actions. The HTTP method is the verb.
- Every address starts with `/api/v1` so a future version can live next to it.
- Requests and responses use JSON (`Content-Type: application/json`).
- Errors always look like `{ "error": "<message>" }` and never include passwords, hashes or stack traces.
- Logged-in requests send `Authorization: Bearer <token>`. A token expires after 1 hour.

## 1. Required endpoints (built)

| Method | Endpoint | Purpose | Success | Errors |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/health` | Checks that the API is running. | 200 OK | none |
| POST | `/api/v1/sessions` | Logs in. A *session* is the thing you create when you log in. | 200 OK | 400, 401 |
| GET | `/api/v1/users/me` | Returns the logged-in user. Needs a token. | 200 OK | 401 |

Any other address returns `404` with `{ "error": "Not found." }`.
An unexpected crash returns `500` with `{ "error": "Something went wrong." }`.

### GET /api/v1/health

`200 OK`

```json
{ "status": "ok" }
```

### POST /api/v1/sessions

Request body:

```json
{ "email": "student@campusconnect.test", "password": "Campus26" }
```

`200 OK` (login succeeded)

```json
{
  "token": "<a long token text>",
  "user": { "id": 1, "name": "Demo Student", "email": "student@campusconnect.test" }
}
```

`400 Bad Request` (email or password missing or badly formed)

```json
{ "error": "Email and password are required." }
```

`401 Unauthorized` (wrong password OR unknown email, same message for both)

```json
{ "error": "Invalid email or password." }
```

Why the same message? If the API said "email not found", an attacker could discover which emails exist.

### GET /api/v1/users/me

Request header:

```
Authorization: Bearer <token>
```

`200 OK`

```json
{ "id": 1, "name": "Demo Student", "email": "student@campusconnect.test" }
```

`401 Unauthorized` (token missing, wrong, or expired)

```json
{ "error": "Not logged in." }
```

### Demo account

| Email | Password | Name |
| --- | --- | --- |
| `student@campusconnect.test` | `Campus26` | Demo Student |

Passwords are stored hashed with bcryptjs.

## 2. Events (design only, not built)

Events are the school events from the Week 10 examples. All endpoints below need a valid token.
Reading is allowed for any logged-in user. Writing would be limited to organizers in a later version.

| Task | Method | Endpoint | Success | Errors |
| --- | --- | --- | --- | --- |
| List all events | GET | `/api/v1/events` | 200 OK | 401 |
| Filter by month | GET | `/api/v1/events?month=11` | 200 OK | 400 (bad month), 401 |
| Get one event | GET | `/api/v1/events/{id}` | 200 OK | 401, 404 |
| Add an event | POST | `/api/v1/events` | 201 Created | 400, 401 |
| Change part of an event | PATCH | `/api/v1/events/{id}` | 200 OK | 400, 401, 404 |
| Delete an event | DELETE | `/api/v1/events/{id}` | 204 No Content | 401, 404 |

Design notes:

- The address uses the plural noun `events`. There are no verbs such as `/getEvents` or `/deleteEvent`.
- `PATCH` changes only the fields that are sent. `PUT` would replace the whole event.
- The filter is a **query string** (`?month=11`) because it narrows a list instead of naming one thing.
- `POST` returns `201 Created` with the new event. `DELETE` returns `204` with an empty body.

Example event:

```json
{
  "id": 7,
  "title": "CBIT Tech Talk",
  "date": "2026-11-20",
  "place": "MSU-Naawan Gym",
  "college": "CBIT"
}
```

Example `POST /api/v1/events` body (all four fields required):

```json
{ "title": "CBIT Tech Talk", "date": "2026-11-20", "place": "MSU-Naawan Gym", "college": "CBIT" }
```

Example `PATCH /api/v1/events/7` body (only what changes):

```json
{ "place": "Covered Court" }
```

Example errors:

```json
{ "error": "Title and date are required." }
{ "error": "Event not found." }
```