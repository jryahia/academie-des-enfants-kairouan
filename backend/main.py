"""Académie des Enfants Kairouan — enrollment API.

POST /api/enrollments  — accepts a form submission, fans it out to every
configured channel (Google Sheets via Apps Script, Gmail via the same script,
Notion API, generic webhook for Slack/Discord/Make/Zapier/Telegram), and always
appends a durable JSONL log line. A failing channel never fails the request —
the lead is always kept locally.

Channels are configured via environment variables (see .env.example):
  SHEETS_WEBAPP_URL   Apps Script web-app URL (appends row + sends Gmail)
  NOTION_API_KEY      Notion integration token (starts with ntn_ or secret_)
  NOTION_DATABASE_ID  Notion database to create the inquiry page in
  WEBHOOK_URL         Generic webhook (Slack/Discord/Make/Zapier/Telegram bot)
  ALLOW_ORIGINS       Comma-separated CORS origins (dev + prod domains)

Run:  uvicorn main:app --host 127.0.0.1 --port 8425
"""
from __future__ import annotations

import json
import logging
import os
import time
from datetime import datetime, timezone
from pathlib import Path

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

LOG = logging.getLogger("enrollments")
LOG_PATH = Path(__file__).resolve().parent / "enrollments.log"


def _env(name: str) -> str:
    return os.environ.get(name, "").strip()


def _origins() -> list[str]:
    raw = _env("ALLOW_ORIGINS") or "http://localhost:5173,http://localhost:4173"
    return [o.strip() for o in raw.split(",") if o.strip()]


app = FastAPI(title="Académie Enfants — enrollment API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins(),
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)


class Enrollment(BaseModel):
    name: str
    child_name: str
    age: str
    phone: str
    message: str = ""
    lang: str = "fr"


def _append_log(entry: dict) -> None:
    try:
        with LOG_PATH.open("a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    except Exception as exc:  # pragma: no cover
        LOG.warning("log write failed: %s", exc)


def _post(url: str, payload: dict, timeout: float = 10.0) -> bool:
    try:
        r = httpx.post(url, json=payload, timeout=timeout)
        LOG.info("%s -> %s", url, r.status_code)
        return r.status_code < 300
    except Exception as exc:
        LOG.warning("post %s failed: %s", url, exc)
        return False


async def _fan_out(lead: dict) -> dict:
    channels = {"sheets": False, "notion": False, "webhook": False}

    # Google Sheets + Gmail — one Apps Script web-app call does both.
    sheets_url = _env("SHEETS_WEBAPP_URL")
    if sheets_url:
        channels["sheets"] = await _async_post(sheets_url, lead)

    # Notion — create a page in the inquiries database.
    notion_key = _env("NOTION_API_KEY")
    notion_db = _env("NOTION_DATABASE_ID")
    if notion_key and notion_db:
        try:
            r = await _async_post(
                "https://api.notion.com/v1/pages",
                {
                    "parent": {"database_id": notion_db},
                    "properties": {
                        "Name": {"title": [{"text": {"content": lead["child_name"]}}]},
                        "Parent": {"rich_text": [{"text": {"content": lead["name"]}}]},
                        "Phone": {"rich_text": [{"text": {"content": lead["phone"]}}]},
                        "Age": {"rich_text": [{"text": {"content": lead["age"]}}]},
                        "Message": {"rich_text": [{"text": {"content": lead["message"]}}]},
                        "Date": {"date": {"start": datetime.now(timezone.utc).date().isoformat()}},
                    },
                },
                headers={"Authorization": f"Bearer {notion_key}", "Notion-Version": "2025-09-03"},
            )
            channels["notion"] = r
        except Exception as exc:
            LOG.warning("notion failed: %s", exc)

    # Generic webhook — Slack/Discord/Make/Zapier/Telegram bot, any of them.
    webhook = _env("WEBHOOK_URL")
    if webhook:
        channels["webhook"] = await _async_post(webhook, lead)

    return channels


async def _async_post(url: str, payload: dict, timeout: float = 10.0, headers: dict | None = None) -> bool:
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            r = await client.post(url, json=payload, headers=headers)
        LOG.info("%s -> %s", url, r.status_code)
        return r.status_code < 300
    except Exception as exc:
        LOG.warning("post %s failed: %s", url, exc)
        return False


@app.get("/api/health")
async def health() -> dict:
    return {
        "status": "ok",
        "channels": {
            "sheets": bool(_env("SHEETS_WEBAPP_URL")),
            "notion": bool(_env("NOTION_API_KEY") and _env("NOTION_DATABASE_ID")),
            "webhook": bool(_env("WEBHOOK_URL")),
        },
    }


@app.post("/api/enrollments")
async def create_enrollment(e: Enrollment) -> dict:
    lead = {
        "name": e.name,
        "child_name": e.child_name,
        "age": e.age,
        "phone": e.phone,
        "message": e.message,
        "lang": e.lang,
        "ts": time.time(),
        "iso": datetime.now(timezone.utc).isoformat(),
    }
    _append_log(lead)
    channels = await _fan_out(lead)
    return {"ok": True, "received": True, "channels": channels}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=int(_env("PORT") or 8425))
