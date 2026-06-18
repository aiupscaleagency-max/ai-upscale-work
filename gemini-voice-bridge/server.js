import 'dotenv/config';
import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Modality } from '@google/genai';
import { mulaw } from 'alawmulaw';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 8080;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-live-2.5-flash';
const GEMINI_VOICE = process.env.GEMINI_VOICE || 'Aoede';

// Enda källan till sanning för agentens prompt — ändra INTE här, ändra i .md-filen.
const PROMPT_FILE = path.join(
  __dirname,
  '..',
  'Customer_Projects',
  'Arbetsmiljocenter',
  'Fast Agent Setup - GLENNS DEMO',
  'glenn-meta-sell-agent-prompt-svenska.md'
);

function extractFencedBlock(markdown, headingPattern) {
  const headingIndex = markdown.search(headingPattern);
  if (headingIndex === -1) throw new Error(`Hittade inte rubriken: ${headingPattern}`);
  const afterHeading = markdown.slice(headingIndex);
  const fenceStart = afterHeading.indexOf('```');
  const fenceEnd = afterHeading.indexOf('```', fenceStart + 3);
  if (fenceStart === -1 || fenceEnd === -1) {
    throw new Error(`Hittade inget kodblock under rubriken: ${headingPattern}`);
  }
  return afterHeading.slice(fenceStart + 3, fenceEnd).trim();
}

function loadSystemInstruction() {
  const markdown = fs.readFileSync(PROMPT_FILE, 'utf-8');
  const systemPrompt = extractFencedBlock(markdown, /## System Prompt/);
  const greeting = extractFencedBlock(markdown, /## Greeting Message/);
  const failure = extractFencedBlock(markdown, /## Failure Message/);

  return (
    `${systemPrompt}\n\n` +
    `# HÄLSNINGSFRAS\n` +
    `Så fort du får meddelandet "<<CALL_CONNECTED>>" ska du OMEDELBART säga denna replik ` +
    `ordagrant som ditt första yttrande i samtalet, och sedan vänta på svar:\n"${greeting}"\n\n` +
    `# OM SAMTALET MÅSTE KOPPLAS VIDARE TILL MIKE\n` +
    `Använd denna replik ordagrant innan du tystnar:\n"${failure}"`
  );
}

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

// ---------------------------------------------------------------------------
// Ljudkonvertering: Twilio (8kHz mulaw) <-> Gemini Live (16kHz in / 24kHz ut, PCM16 LE)
// ---------------------------------------------------------------------------

function resampleLinear(int16, fromRate, toRate) {
  if (fromRate === toRate) return int16;
  const ratio = fromRate / toRate;
  const newLength = Math.max(1, Math.round(int16.length / ratio));
  const out = new Int16Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const srcPos = i * ratio;
    const i0 = Math.floor(srcPos);
    const i1 = Math.min(i0 + 1, int16.length - 1);
    const frac = srcPos - i0;
    out[i] = Math.round(int16[i0] * (1 - frac) + int16[i1] * frac);
  }
  return out;
}

// 24kHz -> 8kHz i två steg (24k->16k->8k) ger mindre aliasing än ett enda 3:1-steg.
function downsample24kTo8k(int16) {
  return resampleLinear(resampleLinear(int16, 24000, 16000), 16000, 8000);
}

function twilioMulawToGeminiPCM16k(base64Mulaw) {
  const mulawBytes = new Uint8Array(Buffer.from(base64Mulaw, 'base64'));
  const pcm8k = mulaw.decode(mulawBytes); // Int16Array @ 8kHz
  const pcm16k = resampleLinear(pcm8k, 8000, 16000);
  return Buffer.from(pcm16k.buffer, pcm16k.byteOffset, pcm16k.byteLength).toString('base64');
}

function geminiPCM24kToTwilioMulaw(base64Pcm24k) {
  const pcmBuffer = Buffer.from(base64Pcm24k, 'base64');
  const pcm24k = new Int16Array(pcmBuffer.buffer, pcmBuffer.byteOffset, pcmBuffer.length / 2);
  const pcm8k = downsample24kTo8k(pcm24k);
  const mulawBytes = mulaw.encode(pcm8k); // Uint8Array
  return Buffer.from(mulawBytes).toString('base64');
}

// ---------------------------------------------------------------------------
// HTTP: TwiML + healthcheck
// ---------------------------------------------------------------------------

const app = express();
app.use(express.urlencoded({ extended: false }));

app.get('/', (_req, res) => res.send('gemini-voice-bridge igång'));

app.post('/twiml/incoming', (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const wsUrl = `wss://${host}/media-stream`;
  res.type('text/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<Response><Connect><Stream url="${wsUrl}" /></Connect></Response>`
  );
});

const server = http.createServer(app);

// ---------------------------------------------------------------------------
// WebSocket: Twilio Media Stream <-> Gemini Live
// ---------------------------------------------------------------------------

const wss = new WebSocketServer({ server, path: '/media-stream' });

wss.on('connection', async (twilioWs) => {
  console.log('Twilio media stream ansluten');
  let streamSid = null;
  let closed = false;
  let geminiSession = null;

  function handleGeminiMessage(message) {
    if (closed) return;

    if (message.serverContent?.interrupted) {
      // Glenn pratade in i agenten — töm Twilios uppspelningskö omedelbart.
      if (streamSid) twilioWs.send(JSON.stringify({ event: 'clear', streamSid }));
      return;
    }

    const parts = message.serverContent?.modelTurn?.parts || [];
    for (const part of parts) {
      const inline = part.inlineData;
      if (inline?.data && inline.mimeType?.startsWith('audio/') && streamSid) {
        const mulawBase64 = geminiPCM24kToTwilioMulaw(inline.data);
        twilioWs.send(
          JSON.stringify({ event: 'media', streamSid, media: { payload: mulawBase64 } })
        );
      }
    }
  }

  try {
    geminiSession = await ai.live.connect({
      model: GEMINI_MODEL,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          languageCode: 'sv-SE',
          voiceConfig: { prebuiltVoiceConfig: { voiceName: GEMINI_VOICE } },
        },
        systemInstruction: { parts: [{ text: loadSystemInstruction() }] },
      },
      callbacks: {
        onopen: () => console.log('Gemini Live-session öppen'),
        onmessage: handleGeminiMessage,
        onerror: (err) => console.error('Gemini-fel:', err?.message || err),
        onclose: (e) => console.log('Gemini-session stängd:', e?.reason || ''),
      },
    });
  } catch (err) {
    console.error('Kunde inte öppna Gemini Live-session:', err);
    twilioWs.close();
    return;
  }

  twilioWs.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    switch (msg.event) {
      case 'start':
        streamSid = msg.start.streamSid;
        console.log('Stream startad:', streamSid);
        // Utgående samtal — Glenn säger inget först, så vi triggar agentens hälsning.
        geminiSession.sendClientContent({
          turns: [{ role: 'user', parts: [{ text: '<<CALL_CONNECTED>>' }] }],
          turnComplete: true,
        });
        break;

      case 'media':
        geminiSession.sendRealtimeInput({
          audio: {
            data: twilioMulawToGeminiPCM16k(msg.media.payload),
            mimeType: 'audio/pcm;rate=16000',
          },
        });
        break;

      case 'stop':
        console.log('Stream stoppad:', streamSid);
        closed = true;
        geminiSession.close();
        break;

      default:
        break;
    }
  });

  twilioWs.on('close', () => {
    closed = true;
    geminiSession?.close();
    console.log('Twilio media stream stängd');
  });
});

server.listen(PORT, () => {
  console.log(`gemini-voice-bridge lyssnar på port ${PORT}`);
});
