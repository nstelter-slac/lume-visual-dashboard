---
icon: lucide/server
---

# Backend API

The dashboard gets all model data from the backend API,
[lume-model-api](https://github.com/slaclab/lume-model-api).
It is an HTTP service that hosts models built on `LUMEModel` from
[lume-base](https://github.com/lume-science/lume-base).

The API does not include a UI. This dashboard is one of its clients.

## What the API does

- It publishes the inputs, outputs, and diagnostic screens of each model as JSON.
- It evaluates a model when a client requests it.
- It streams a live view of the machine with server-sent events.

The API takes everything it publishes from the `supported_variables` of the model.
It has no built-in knowledge of PVs, screens, or units.

## Endpoints

All endpoints are under `/api/v1/`. Models have names. Put the model name in `{name}`.

| Method and path | Purpose |
|---|---|
| `GET /api/v1/models` | List the hosted models. |
| `GET /api/v1/models/{name}/config` | Get the inputs (with ranges, units, and defaults), outputs, and screens of a model. |
| `POST /api/v1/models/{name}/evaluate` | Evaluate a model with changed inputs. Used for interactive mode. |

The API has more endpoints, including the live stream. See the
[lume-model-api README](https://github.com/slaclab/lume-model-api#endpoints)
for the full list.

Example request:

```sh
curl -s -X POST localhost:8000/api/v1/models/demo/evaluate \
  -H 'Content-Type: application/json' \
  -d '{"inputs": {"DEMO:QUAD:1:BCTRL": 3.0}, "screen": "OTR_B"}'
```

## Environments

Clients add `/api/v1/models/...` to the base URL.
You must be on the SLAC network to reach these hosts.
The status can change. Check the
[lume-model-api README](https://github.com/slaclab/lume-model-api#deployments)
for the current state.

| Environment | Base URL |
|---|---|
| Production | `https://ard-modeling-service.slac.stanford.edu/lume-model-api` |
| Development | `https://ad-accel-online-ml-dev.slac.stanford.edu/lume-model-api` |

## Run the API locally

The API repository includes a small `demo` model. It does not need EPICS.

```sh
git clone https://github.com/slaclab/lume-model-api.git
cd lume-model-api
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
LUME_MODELS=demo LUME_LIVE_SOURCE=synthetic uvicorn lume_model_api.api.main:app --port 8000
```

`LUME_LIVE_SOURCE=synthetic` makes the live stream use the default values of the model, not EPICS.

After the server starts, open <http://localhost:8000/docs> for the interactive API documentation.
