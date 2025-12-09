# Stamina Service - Nordcurrent Test Project

A backend service for managing a regenerating stamina resource used by games.
Designed as a technical exercise for Nordcurrent.

---

## 1. Overview

The service stores stamina state on the server and updates it based on gameplay events submitted by the client.
Stamina regenerates automatically over time using timestamp-based calculations, without background processing.

This ensures:

* Consistent and authoritative state
* Low network usage
* Persistence across app restarts and connectivity interruptions

---

## 2. Stamina Domain

### 2.1 Model

| Field                 | Description                               |
| --------------------- | ----------------------------------------- |
| `staminaBase`         | Stamina value at the reference moment     |
| `staminaLastUpdateTs` | Reference timestamp (ms)                  |
| `staminaRegenPerSec`  | Regeneration speed                        |
| `staminaMax`          | Maximum allowed stamina                   |
| `stateVersion`        | For conflict prevention                   |

### 2.2 Regeneration Logic

Current stamina is computed as:

```
current = staminaBase + staminaRegenPerSec * elapsedSeconds
current = min(current, staminaMax)
```

where `elapsedSeconds = floor((now - staminaLastUpdateTs) / 1000)`

Therefore, no server-side timers required.

### 2.3 Event Processing

Example supported events:

* `LEVEL_START` - consumes stamina
* `LEVEL_FINISH` - restores stamina

Server:

* Validates resource sufficiency
* Updates stamina state and version
* Returns authoritative view back to client

---

## 3. API Overview

### Health Check

```
GET /health
```

Returns status of the service.

---

### Create User

```
POST /user/create
```

Creates a new user with default stamina configuration.

Response example:

```json
{
  "id": "uuid",
  "status": "ACTIVE",
  "stats": {
    "staminaMax": 10,
    "staminaBase": 10,
    "staminaLastUpdateTs": 1700000000000,
    "stateVersion": 1
  }
}
```

---

### Synchronization

```
POST /sync
```

Client sends recent events and last known state version.

**Request example**

```json
{
  "userId": "uuid",
  "lastStateVersion": 1,
  "events": [
    { "id": "e1", "type": "LEVEL_START", "clientTs": 1700000000 }
  ]
}
```

**Response example**

```json
{
  "serverTime": 1700000100,
  "userStats": {
    "staminaCurrent": 9,
    "staminaMax": 10,
    "status": "ACTIVE",
    "blockedAt": null,
    "stateVersion": 2
  }
}
```

Conflict response (client behind state):

```json
{
  "message": "State version conflict",
  "errorCode": "CONFLICT",
  "data": {
    "serverTime": 1700000200,
    "userStats": {
      "staminaCurrent": 10,
      "staminaMax": 10,
      "stateVersion": 3
    }
  }
}
```

---

## 4. Running the Application

### 4.1 Requirements

* Node.js installed
* PostgreSQL database available

### 4.2 Install dependencies

```
npm install
```

### 4.3 Configure environment

Duplicate `.env.example` → `.env`
Fill database credentials and runtime parameters.

### 4.4 Build application

```
npm run build
```

### 4.5 Run database migrations

```
npm run migrate
```

### 4.6 Start service

```
npm start
```

Verify:

```
curl http://localhost:PORT/health
```

---

## 5. Testing Common Scenarios

1. Create test user
2. Call `/sync` with `LEVEL_START`
3. Confirm stamina decreases
4. Wait a short period
5. Call `/sync` again
6. Confirm stamina regenerated
7. Test rejection on insufficient stamina

Request Example:
```JSON
{
    "userId": "62b6c1ed-386e-4f1c-90d0-e4e0d86e186b",
    "lastStateVersion": 13,
    "events": [
        {
            "id": "11111111-aaaa-4bbb-cccc-222222222222",
            "type": "LEVEL_START",
            "clientTs": 1733600000,
            "payload": {
                "levelId": 1,
                "sessionId": "session-001"
            }
        },
        {
            "id": "33333333-cccc-4ddd-eeee-444444444444",
            "type": "LEVEL_FINISH",
            "clientTs": 1733600500,
            "payload": {
                "levelId": 1,
                "sessionId": "session-001",
                "result": "WIN",
                "score": 12300
            }
        }
    ]
}
```

---

## 6. Potential Enhancements
* Persistent event storage with anti-cheat validation based on previous events and timestamps
* Additional stamina-related events (rewards, bonuses, freeze stamina)
* Authorization for secure player operations