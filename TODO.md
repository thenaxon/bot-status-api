# TODO — naxon-status

## Features

### [ ] Sessions Collector
**Prio:** Mittel
**Datum:** 2026-02-06

Aktive Sessions in der Status API exposen — besonders relevant für Overnight Tasks mit mehreren Sub-Agents.

**Output:**
```json
"sessions": {
  "total": 6,
  "main": 1,
  "cron": 5,
  "spawn": 0,
  "active": [
    { "key": "agent:main:main", "kind": "main", "model": "opus", "tokens": 88856 },
    { "key": "spawn:research-bsk", "kind": "spawn", "model": "sonnet", "task": "BSK Research" }
  ]
}
```

**Umsetzung:**
- Neuer Collector `collectors/sessions.js`
- Ruft `openclaw sessions list --json` auf oder nutzt interne API
- Filtert/gruppiert nach kind (main, cron, spawn)

**Use Case:**
Rene sieht im Dashboard dass gerade 5 Sub-Agents an Overnight Tasks arbeiten.
