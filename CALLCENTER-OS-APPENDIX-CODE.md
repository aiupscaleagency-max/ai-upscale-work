# APPENDIX A — Kod-nivå integration (fungerande referens)
### Hör ihop med `CALLCENTER-OS-MASTERPROMPT.md`

> Detta är **referensimplementation** av de svåra delarna: telefoni-adapter (Twilio/Vonage/Telnyx) ↔ Gemini Live (AI-röst) ↔ Firestore ↔ live-lyssning i frontend. Stack: **Python 3.12 + FastAPI på Cloud Run** (matchar ADK), `google-genai`, `google-cloud-firestore`, `twilio`. Frontend: vanilla JS (agent-os). Allt anpassat för white-label/multi-tenant (`tenantId` överallt).

---

## A1. ARKITEKTUR-FLÖDE (ett samtal, ände-till-ände)

```
[Ringlista/Lead]                           [Golvchef i agent-os]
      │ start call                                │ "lyssna live"
      ▼                                            ▼
 Cloud Run: caller-service ───── WebSocket /monitor ───► Frontend live-vägg
      │  (TwiML <Connect><Stream>)                 ▲
      ▼                                            │ broadcast transkript+audio
 Twilio/Vonage/Telnyx ──media stream(WS /telephony)┤
   (telefonnätet)                                  │
      ▲  AI-röst ut                                ▼
      └──────────── Gemini Live (Vertex AI) ◄──► transcript
                          │
                          ▼
                     Firestore (calls, transcript, result)  +  Cloud Storage (inspelning)
```

**Tre WebSocket-kanaler i caller-service:**
1. `/telephony/{call_id}` — talnätet (Twilio Media Stream) ↔ tjänsten (mulaw 8 kHz).
2. Intern bidir-stream till **Gemini Live** (pcm 16 kHz in / 24 kHz ut).
3. `/monitor/{tenant_id}` — frontend prenumererar på live-status + transkript + (valfritt) audio för listen-in.

---

## A2. TELEFONI-ADAPTER (abstrakt — byt provider per tenant)

`telephony/base.py`
```python
from abc import ABC, abstractmethod

class TelephonyAdapter(ABC):
    """Samma API oavsett provider. Tenant väljer Twilio/Vonage/Telnyx."""
    @abstractmethod
    def start_call(self, *, to: str, from_: str, stream_ws_url: str, tenant_id: str) -> str:
        """Ringer upp. Returnerar provider-call-id. Kopplar media → stream_ws_url."""

    @abstractmethod
    def end_call(self, provider_call_id: str) -> None: ...

    @abstractmethod
    def parse_media_frame(self, msg: dict) -> bytes | None:
        """Plockar ut rå-audio (mulaw 8k) ur providerns WS-meddelande."""

    @abstractmethod
    def encode_media_frame(self, audio_mulaw_8k: bytes, stream_sid: str) -> dict:
        """Packar AI-audio till providerns WS-format."""
```

`telephony/twilio_adapter.py`
```python
import json, base64
from twilio.rest import Client
from .base import TelephonyAdapter

class TwilioAdapter(TelephonyAdapter):
    def __init__(self, account_sid: str, auth_token: str):
        self.client = Client(account_sid, auth_token)

    def start_call(self, *, to, from_, stream_ws_url, tenant_id):
        twiml = f'''<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="{stream_ws_url}">
      <Parameter name="tenant_id" value="{tenant_id}"/>
    </Stream>
  </Connect>
</Response>'''
        call = self.client.calls.create(twiml=twiml, to=to, from_=from_, record=True)
        return call.sid

    def end_call(self, provider_call_id):
        self.client.calls(provider_call_id).update(status="completed")

    def parse_media_frame(self, msg):
        if msg.get("event") == "media":
            return base64.b64decode(msg["media"]["payload"])  # mulaw 8 kHz
        return None

    def encode_media_frame(self, audio_mulaw_8k, stream_sid):
        return {"event": "media", "streamSid": stream_sid,
                "media": {"payload": base64.b64encode(audio_mulaw_8k).decode()}}
```

`telephony/factory.py` — väljer adapter från tenantens inställning (provider-nyckeln hämtas från **Secret Manager**, aldrig hårdkodad):
```python
from .twilio_adapter import TwilioAdapter
# from .vonage_adapter import VonageAdapter
# from .telnyx_adapter import TelnyxAdapter
from secrets_helper import get_secret  # läser Secret Manager

def make_adapter(provider: str, tenant_id: str) -> "TelephonyAdapter":
    if provider == "twilio":
        return TwilioAdapter(get_secret(f"{tenant_id}_TWILIO_SID"),
                             get_secret(f"{tenant_id}_TWILIO_TOKEN"))
    # if provider == "vonage": return VonageAdapter(...)
    # if provider == "telnyx": return TelnyxAdapter(...)
    raise ValueError(f"Okänd provider: {provider}")
```
> **Vonage/Telnyx:** samma mönster — Vonage använder NCCO `connect`→`websocket`, Telnyx använder Media Streaming (`stream_url`). Audio är L16/PCMU; implementera `parse/encode_media_frame` per provider. UI:t rör aldrig provider-detaljer.

---

## A3. SECRET MANAGER-HJÄLPARE

`secrets_helper.py`
```python
from google.cloud import secretmanager
_client = secretmanager.SecretManagerServiceClient()
PROJECT = "cyber-guardian-32596"

def get_secret(name: str) -> str:
    path = f"projects/{PROJECT}/secrets/{name}/versions/latest"
    return _client.access_secret_version(name=path).payload.data.decode()
```

---

## A4. GEMINI LIVE-BRYGGA (AI-rösten på samtalet)

`gemini_live.py` — bidir-stream mot Vertex AI Gemini Live. Twilio är mulaw 8 kHz; Gemini vill ha PCM 16 kHz in och ger PCM 24 kHz ut → konvertera med `audioop`.
```python
import audioop
from google import genai
from google.genai import types

client = genai.Client(vertexai=True, project="cyber-guardian-32596", location="europe-north1")
MODEL = "gemini-2.0-flash-live-preview-04-09"  # verifiera senaste live-modell

def mulaw8k_to_pcm16k(mulaw: bytes) -> bytes:
    pcm8k = audioop.ulaw2lin(mulaw, 2)                 # mulaw → PCM16 8k
    pcm16k, _ = audioop.ratecv(pcm8k, 2, 1, 8000, 16000, None)
    return pcm16k

def pcm24k_to_mulaw8k(pcm24k: bytes, state=None):
    pcm8k, state = audioop.ratecv(pcm24k, 2, 1, 24000, 8000, state)
    return audioop.lin2ulaw(pcm8k, 2), state

async def open_live_session(system_prompt: str, on_text, on_audio):
    """Öppnar Gemini Live. on_text(transkript), on_audio(mulaw8k) callbacks."""
    config = types.LiveConnectConfig(
        response_modalities=["AUDIO"],
        system_instruction=system_prompt,
        input_audio_transcription={},   # få transkript av kund
        output_audio_transcription={},  # få transkript av AI
    )
    rate_state = [None]
    async with client.aio.live.connect(model=MODEL, config=config) as session:
        async def pump_in(audio_mulaw_8k: bytes):
            await session.send_realtime_input(
                audio=types.Blob(data=mulaw8k_to_pcm16k(audio_mulaw_8k),
                                 mime_type="audio/pcm;rate=16000"))
        async def receive_loop():
            async for resp in session.receive():
                if resp.data:  # AI-audio (PCM 24k)
                    mulaw, rate_state[0] = pcm24k_to_mulaw8k(resp.data, rate_state[0])
                    await on_audio(mulaw)
                if resp.server_content and resp.server_content.output_transcription:
                    await on_text("ai", resp.server_content.output_transcription.text)
                if resp.server_content and resp.server_content.input_transcription:
                    await on_text("kund", resp.server_content.input_transcription.text)
        return session, pump_in, receive_loop
```

---

## A5. CALLER-SERVICE (knyter ihop allt — FastAPI på Cloud Run)

`main.py`
```python
import asyncio, json
from fastapi import FastAPI, WebSocket
from telephony.factory import make_adapter
from gemini_live import open_live_session
from firestore_layer import log_call_start, append_transcript, log_call_result
from monitor import monitor_hub  # se A6

app = FastAPI()

@app.websocket("/telephony/{call_id}")
async def telephony_ws(ws: WebSocket, call_id: str):
    await ws.accept()
    stream_sid = None; tenant_id = None; adapter = None; pump_in = None
    transcript_buf = []

    async def on_text(speaker, text):
        transcript_buf.append({"speaker": speaker, "text": text})
        await append_transcript(call_id, speaker, text)
        await monitor_hub.broadcast(tenant_id, {        # live till golvchef
            "type": "transcript", "call_id": call_id, "speaker": speaker, "text": text})

    async def on_audio(mulaw):                            # AI-röst tillbaka till samtalet
        if stream_sid:
            await ws.send_text(json.dumps(adapter.encode_media_frame(mulaw, stream_sid)))
        await monitor_hub.broadcast_audio(tenant_id, call_id, mulaw)  # listen-in

    session = pump_in = receive_loop = None
    async for raw in ws.iter_text():
        msg = json.loads(raw)
        ev = msg.get("event")
        if ev == "start":
            stream_sid = msg["start"]["streamSid"]
            tenant_id = msg["start"]["customParameters"]["tenant_id"]
            adapter = make_adapter(provider="twilio", tenant_id=tenant_id)  # provider från tenant
            await log_call_start(call_id, tenant_id)
            sys_prompt = await get_agent_prompt(tenant_id, call_id)  # agentens persona
            session, pump_in, receive_loop = await open_live_session(sys_prompt, on_text, on_audio)
            asyncio.create_task(receive_loop())
        elif ev == "media" and pump_in:
            audio = adapter.parse_media_frame(msg)
            if audio: await pump_in(audio)
        elif ev == "stop":
            result = derive_result(transcript_buf)       # tagga: intresserad/nej/uppföljning
            await log_call_result(call_id, result, transcript_buf)
            await monitor_hub.broadcast(tenant_id, {"type": "call_ended",
                                                    "call_id": call_id, "result": result})
            break
```

Starta utgående samtal (anropas av dialern/kampanjmotorn):
```python
@app.post("/calls/start")
async def start_call(body: dict):
    adapter = make_adapter(provider=body["provider"], tenant_id=body["tenant_id"])
    ws_url = f"wss://caller-service-xxxx.a.run.app/telephony/{body['call_id']}"
    sid = adapter.start_call(to=body["to"], from_=body["from_"],
                             stream_ws_url=ws_url, tenant_id=body["tenant_id"])
    return {"provider_call_id": sid}
```

---

## A6. LIVE-ÖVERVAKNING (golvchef ser + lyssnar)

`monitor.py` — nav som broadcastar status/transkript/audio till frontend per tenant.
```python
from collections import defaultdict
from fastapi import WebSocket

class MonitorHub:
    def __init__(self):
        self.clients = defaultdict(set)        # tenant_id -> set[WebSocket]
        self.listening = defaultdict(set)      # call_id -> set[WebSocket] (listen-in)

    async def connect(self, tenant_id, ws): await ws.accept(); self.clients[tenant_id].add(ws)
    def disconnect(self, tenant_id, ws): self.clients[tenant_id].discard(ws)

    async def broadcast(self, tenant_id, payload):
        for ws in list(self.clients[tenant_id]):
            try: await ws.send_json(payload)
            except Exception: self.clients[tenant_id].discard(ws)

    async def broadcast_audio(self, tenant_id, call_id, mulaw):
        import base64
        for ws in list(self.listening[call_id]):
            try: await ws.send_json({"type": "audio", "call_id": call_id,
                                     "payload": base64.b64encode(mulaw).decode()})
            except Exception: self.listening[call_id].discard(ws)

monitor_hub = MonitorHub()
```
```python
@app.websocket("/monitor/{tenant_id}")
async def monitor_ws(ws: WebSocket, tenant_id: str):
    await monitor_hub.connect(tenant_id, ws)
    try:
        async for raw in ws.iter_text():
            cmd = json.loads(raw)
            if cmd["action"] == "listen":   monitor_hub.listening[cmd["call_id"]].add(ws)
            elif cmd["action"] == "stop_listen": monitor_hub.listening[cmd["call_id"]].discard(ws)
            elif cmd["action"] == "whisper":  # coach: text → bara agentens Gemini-session
                await inject_whisper(cmd["call_id"], cmd["text"])
            elif cmd["action"] == "barge_in": # människa tar över samtalet
                await human_takeover(cmd["call_id"])
    finally:
        monitor_hub.disconnect(tenant_id, ws)
```

---

## A7. FIRESTORE-LAGER

`firestore_layer.py`
```python
from google.cloud import firestore
db = firestore.AsyncClient(project="cyber-guardian-32596")

async def log_call_start(call_id, tenant_id):
    await db.collection("calls").document(call_id).set({
        "tenantId": tenant_id, "status": "active",
        "startedAt": firestore.SERVER_TIMESTAMP, "transcript": []})

async def append_transcript(call_id, speaker, text):
    await db.collection("calls").document(call_id).update({
        "transcript": firestore.ArrayUnion([{"speaker": speaker, "text": text}])})

async def log_call_result(call_id, result, transcript):
    await db.collection("calls").document(call_id).update({
        "status": "done", "result": result, "endedAt": firestore.SERVER_TIMESTAMP})
    # synka till kontakt + pipeline
    call = (await db.collection("calls").document(call_id).get()).to_dict()
    if call.get("contactId"):
        await db.collection("contacts").document(call["contactId"]).update({
            "lastCallResult": result, "lastCallAt": firestore.SERVER_TIMESTAMP,
            "activities": firestore.ArrayUnion([{"type": "call", "result": result}])})
```
**Firestore Security Rules (tenant-isolering):**
```
match /databases/{db}/documents {
  function tenantOf() { return request.auth.token.tenantId; }
  match /{col}/{doc} {
    allow read, write: if request.auth != null
      && (request.auth.token.role == "super_admin"      // Mike ser allt
          || resource.data.tenantId == tenantOf());      // kund bara sin data
  }
}
```

---

## A8. FRONTEND-KOPPLING (agent-os live-vägg + lyssna)

I `agent-os/index.html` (modul: Live Agent-övervakning):
```javascript
const TENANT = window.TENANT_ID || "mike-admin";
const mon = new WebSocket(`wss://caller-service-xxxx.a.run.app/monitor/${TENANT}`);
const audioCtx = new AudioContext({sampleRate: 8000});

mon.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.type === "transcript") appendTranscript(m.call_id, m.speaker, m.text); // live-text
  if (m.type === "call_ended") markEnded(m.call_id, m.result);
  if (m.type === "audio") playMulaw(m.payload);        // listen-in audio
};

// Klicka "lyssna" på en agent
function listenToAgent(call_id){
  mon.send(JSON.stringify({action: "listen", call_id}));
}
function whisperToAgent(call_id, text){               // coacha agenten
  mon.send(JSON.stringify({action: "whisper", call_id, text}));
}
function bargeIn(call_id){                              // ta över samtalet
  mon.send(JSON.stringify({action: "barge_in", call_id}));
}
// mulaw 8k → spelbar audio (avkoda i JS eller låt servern skicka PCM)
function playMulaw(b64){ /* decode μ-law → Float32 → audioCtx buffer */ }
```

---

## A9. DEPLOY (Cloud Run) + HEMLIGHETER

```bash
# Bygg & deploya caller-service
gcloud run deploy caller-service \
  --source . --region europe-north1 \
  --allow-unauthenticated \
  --set-secrets "GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --min-instances 0 --max-instances 10 --concurrency 20

# Per-tenant telefoni-hemligheter (exempel)
echo -n "ACxxxx" | gcloud secrets create mike-admin_TWILIO_SID --data-file=-
echo -n "token"  | gcloud secrets create mike-admin_TWILIO_TOKEN --data-file=-
```
Ge Cloud Run-tjänstkontot `roles/secretmanager.secretAccessor` + `roles/datastore.user` (Firestore).

---

## A10. CHECKLISTA — fungerande ände-till-ände
- [ ] `POST /calls/start` ringer via Twilio → media-stream når `/telephony/{id}`
- [ ] Gemini Live svarar med röst på samtalet (audio tillbaka hörs)
- [ ] Transkript skrivs live till Firestore + broadcastas till `/monitor`
- [ ] Golvchef klickar "lyssna" → hör samtalet live i agent-os
- [ ] Whisper + barge-in fungerar
- [ ] `tenantId` isolerar all data (testa 2 tenants)
- [ ] Inga nycklar i frontend/git — allt via Secret Manager
- [ ] Byt provider (Twilio→Vonage) genom enbart tenant-inställning + adapter

---

*Appendix till CALLCENTER-OS-MASTERPROMPT.md · 2026-06-30 · Python/FastAPI + Gemini Live (Vertex AI) + Firestore + Twilio/Vonage/Telnyx-adapter. Verifiera senaste Gemini Live-modellnamn + audio-format vid implementation.*
