// PaperClips API Server for ThyroidAI
// Läser agentdefinitioner från agents/*.md och serverar via REST API
// Port: 3100 (localhost)

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import frontMatter from 'front-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

const app = express();
const PORT = process.env.PORT || 3100;
const COMPANY_ID = 'thyroidai-medical-team';

// Middleware
app.use(cors());
app.use(express.json());

// Läs alla agent-filer från agents/-mappen
function loadAgents() {
  const agentsDir = path.join(__dirname, 'agents');
  const agents = [];

  try {
    const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
      const filePath = path.join(agentsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = frontMatter(content);

      const agent = {
        id: file.replace('.md', ''),
        name: parsed.attributes.name || 'Unknown',
        role: parsed.attributes.role || '',
        model: parsed.attributes.model || 'claude-opus-4.6',
        preferredLLM: parsed.attributes.preferredLLM || 'claude',
        description: parsed.body.substring(0, 200),
        fullDescription: parsed.body,
        attributes: parsed.attributes,
      };

      agents.push(agent);
    }

    return agents;
  } catch (err) {
    console.error('Error loading agents:', err);
    return [];
  }
}

// Cacha agenter
let cachedAgents = [];
let lastLoadTime = 0;

function getAgents() {
  const now = Date.now();
  // Ladda om agenter var 30:e sekund
  if (now - lastLoadTime > 30000) {
    cachedAgents = loadAgents();
    lastLoadTime = now;
  }
  return cachedAgents;
}

// === Routes ===

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PaperClips', timestamp: new Date().toISOString() });
});

// Hämta company info
app.get('/api/companies/:companyId', (req, res) => {
  const { companyId } = req.params;

  if (companyId !== COMPANY_ID) {
    return res.status(404).json({ error: 'Company not found' });
  }

  const agents = getAgents();
  res.json({
    id: companyId,
    name: 'ThyroidAI Medical Team',
    description: 'AI-läkarteam för sköldkörtelsjuka — 7 specialister dygnet runt',
    status: 'active',
    budgetMonthlyCents: 500000, // 5000 SEK
    agents: agents,
    agentCount: agents.length,
  });
});

// Hämta agents lista
app.get('/api/companies/:companyId/agents', (req, res) => {
  const { companyId } = req.params;

  if (companyId !== COMPANY_ID) {
    return res.status(404).json({ error: 'Company not found' });
  }

  const agents = getAgents();
  res.json({
    data: agents,
    total: agents.length,
  });
});

// Hämta agent details
app.get('/api/companies/:companyId/agents/:agentId', (req, res) => {
  const { companyId, agentId } = req.params;

  if (companyId !== COMPANY_ID) {
    return res.status(404).json({ error: 'Company not found' });
  }

  const agents = getAgents();
  const agent = agents.find(a => a.id === agentId);

  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  res.json(agent);
});

// Hämta dashboard data
app.get('/api/companies/:companyId/dashboard', (req, res) => {
  const { companyId } = req.params;

  if (companyId !== COMPANY_ID) {
    return res.status(404).json({ error: 'Company not found' });
  }

  const agents = getAgents();

  res.json({
    company: {
      id: companyId,
      name: 'ThyroidAI Medical Team',
    },
    agents: agents.map(a => ({
      id: a.id,
      name: a.name,
      role: a.role,
      status: 'online',
      preferredLLM: a.preferredLLM,
      model: a.model,
    })),
    stats: {
      activeAgents: agents.length,
      totalSessions: 0,
      budgetUsedCents: 0,
      budgetTotalCents: 500000,
    },
  });
});

// Simulera agent interaction (för testing)
app.post('/api/companies/:companyId/agents/:agentId/message', (req, res) => {
  const { companyId, agentId } = req.params;
  const { message } = req.body;

  if (companyId !== COMPANY_ID) {
    return res.status(404).json({ error: 'Company not found' });
  }

  const agents = getAgents();
  const agent = agents.find(a => a.id === agentId);

  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  // Returnera mock response
  res.json({
    agentId: agentId,
    message: 'Message received (mock response in development)',
    llm: agent.model,
    preferredLLM: agent.preferredLLM,
    timestamp: new Date().toISOString(),
  });
});

// === LLM Override-lagring (i minnet, återställs vid restart) ===
const llmOverrides = {}; // { agentId: "claude" | "gemini" | "deepseek" | "auto" }

// LLM-aktivitetslogg (senaste 100 händelser)
const llmActivityLog = [];
function logLLMActivity(agentId, provider, model, task) {
  llmActivityLog.unshift({ agentId, provider, model, task, timestamp: new Date().toISOString() });
  if (llmActivityLog.length > 100) llmActivityLog.pop();
}

// === Endpoint: Hämta LLM-override för en agent ===
app.get('/api/companies/:companyId/agents/:agentId/llm', (req, res) => {
  const { agentId } = req.params;
  const agents = getAgents();
  const agent = agents.find(a => a.id === agentId);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });

  res.json({
    agentId,
    currentLLM: llmOverrides[agentId] || agent.preferredLLM || 'auto',
    defaultLLM: agent.preferredLLM || 'auto',
    isOverridden: !!llmOverrides[agentId],
  });
});

// === Endpoint: Sätt LLM för en agent ===
app.put('/api/companies/:companyId/agents/:agentId/llm', (req, res) => {
  const { agentId } = req.params;
  const { llm } = req.body;
  const validLLMs = ['auto', 'claude', 'gemini', 'deepseek'];

  if (!validLLMs.includes(llm)) {
    return res.status(400).json({ error: `Ogiltigt LLM. Välj: ${validLLMs.join(', ')}` });
  }

  if (llm === 'auto') {
    delete llmOverrides[agentId];
  } else {
    llmOverrides[agentId] = llm;
  }

  console.log(`[LLM-OVERRIDE] Agent: ${agentId} → ${llm}`);
  res.json({ agentId, llm, message: `Agent ${agentId} använder nu ${llm}` });
});

// === Endpoint: LLM-aktivitetslogg ===
app.get('/api/companies/:companyId/activity', (req, res) => {
  res.json({ data: llmActivityLog, total: llmActivityLog.length });
});

// === Endpoint: Logga LLM-anrop från ThyroidAI ===
app.post('/api/companies/:companyId/log', (req, res) => {
  const { agentId, provider, model, task } = req.body;
  logLLMActivity(agentId, provider, model, task);
  res.json({ ok: true });
});

// === Admin UI — visuell dashboard ===
app.get('/admin', (req, res) => {
  const agents = getAgents();
  const agentRows = agents.map(a => {
    const current = llmOverrides[a.id] || a.preferredLLM || 'auto';
    const icons = { claude: '🟠', gemini: '🔵', deepseek: '🟣', auto: '⚡' };
    const colors = { claude: '#f97316', gemini: '#3b82f6', deepseek: '#8b5cf6', auto: '#6b7280' };
    return `
      <tr>
        <td style="padding:12px;font-weight:500">${a.name}</td>
        <td style="padding:12px;color:#6b7280;font-size:13px">${a.role || a.attributes?.title || ''}</td>
        <td style="padding:12px">
          <span style="background:${colors[current]}20;color:${colors[current]};padding:4px 10px;border-radius:20px;font-size:13px;font-weight:600">
            ${icons[current]} ${current.toUpperCase()}
          </span>
        </td>
        <td style="padding:12px">
          <select onchange="setLLM('${a.id}', this.value)"
            style="border:1px solid #e5e7eb;border-radius:8px;padding:6px 10px;font-size:13px;cursor:pointer">
            <option value="auto" ${current==='auto'?'selected':''}>⚡ Auto</option>
            <option value="claude" ${current==='claude'?'selected':''}>🟠 Claude</option>
            <option value="gemini" ${current==='gemini'?'selected':''}>🔵 Gemini</option>
            <option value="deepseek" ${current==='deepseek'?'selected':''}>🟣 DeepSeek</option>
          </select>
        </td>
      </tr>`;
  }).join('');

  const activityRows = llmActivityLog.slice(0, 10).map(e => {
    const icons = { claude: '🟠', gemini: '🔵', deepseek: '🟣', openrouter: '🟣' };
    return `<tr>
      <td style="padding:8px;font-size:12px;color:#6b7280">${new Date(e.timestamp).toLocaleTimeString('sv-SE')}</td>
      <td style="padding:8px;font-size:13px">${e.agentId}</td>
      <td style="padding:8px;font-size:13px">${icons[e.provider]||'🤖'} ${e.provider}</td>
      <td style="padding:8px;font-size:12px;color:#6b7280">${e.task||'-'}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="4" style="padding:16px;color:#9ca3af;text-align:center">Inga anrop ännu</td></tr>';

  res.send(`<!DOCTYPE html>
<html lang="sv">
<head><meta charset="UTF-8"><title>PaperClips Admin</title>
<meta http-equiv="refresh" content="10">
<style>
  body{font-family:-apple-system,sans-serif;background:#f9fafb;margin:0;padding:24px}
  h1{font-size:22px;font-weight:700;color:#111;margin:0 0 4px}
  .subtitle{color:#6b7280;font-size:14px;margin-bottom:24px}
  .card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:20px}
  .card-header{padding:16px 20px;border-bottom:1px solid #f3f4f6;font-weight:600;font-size:15px}
  table{width:100%;border-collapse:collapse}
  tr:hover{background:#f9fafb}
  .badge{display:inline-block;padding:3px 8px;border-radius:12px;font-size:11px;font-weight:600}
  .online{background:#d1fae5;color:#065f46}
  .status-bar{display:flex;gap:16px;margin-bottom:20px}
  .stat{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:14px 18px;flex:1}
  .stat-val{font-size:24px;font-weight:700;color:#111}
  .stat-label{font-size:12px;color:#6b7280;margin-top:2px}
</style>
</head>
<body>
<h1>🧬 PaperClips Admin</h1>
<p class="subtitle">ThyroidAI Medical Team — LLM-konfiguration · Uppdateras var 10:e sekund</p>

<div class="status-bar">
  <div class="stat"><div class="stat-val">${agents.length}</div><div class="stat-label">Aktiva agenter</div></div>
  <div class="stat"><div class="stat-val">${llmActivityLog.length}</div><div class="stat-label">LLM-anrop (session)</div></div>
  <div class="stat"><div class="stat-val">${Object.keys(llmOverrides).length}</div><div class="stat-label">Manuella overrides</div></div>
</div>

<div class="card">
  <div class="card-header">🤖 Agenter — LLM-inställning</div>
  <table>
    <thead><tr style="background:#f9fafb;font-size:12px;color:#6b7280;text-transform:uppercase">
      <th style="padding:10px 12px;text-align:left">Agent</th>
      <th style="padding:10px 12px;text-align:left">Roll</th>
      <th style="padding:10px 12px;text-align:left">Aktiv LLM</th>
      <th style="padding:10px 12px;text-align:left">Byt LLM</th>
    </tr></thead>
    <tbody>${agentRows}</tbody>
  </table>
</div>

<div class="card">
  <div class="card-header">📊 Senaste LLM-anrop</div>
  <table>
    <thead><tr style="background:#f9fafb;font-size:12px;color:#6b7280;text-transform:uppercase">
      <th style="padding:8px 12px;text-align:left">Tid</th>
      <th style="padding:8px 12px;text-align:left">Agent</th>
      <th style="padding:8px 12px;text-align:left">LLM</th>
      <th style="padding:8px 12px;text-align:left">Uppgift</th>
    </tr></thead>
    <tbody>${activityRows}</tbody>
  </table>
</div>

<script>
async function setLLM(agentId, llm) {
  const r = await fetch('/api/companies/thyroidai-medical-team/agents/'+agentId+'/llm', {
    method:'PUT', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({llm})
  });
  const d = await r.json();
  alert(d.message);
  location.reload();
}
</script>
</body></html>`);
});

// === Error handling ===
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// === Server start ===
app.listen(PORT, () => {
  console.log(`\n🧬 PaperClips API Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📍 Lokalt:       http://localhost:${PORT}`);
  console.log(`🏥 Company:      ${COMPANY_ID}`);
  console.log(`👥 Agents:       ${getAgents().length} loaded`);
  console.log(`🔧 Environment:  ${process.env.NODE_ENV || 'development'}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  // Ladda agenter omedelbar för att verifiera
  getAgents();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] Stänger ner...');
  process.exit(0);
});
