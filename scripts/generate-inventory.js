#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════
// generate-inventory.js
// Skannar HELA Mikes Claude-arsenal (skills, agenter, kommandon —
// egna + plugin) och bygger en komplett katalog.
//
// VIKTIGT: Skriver INGET förrän användaren svarar "y" på ACCEPT-frågan.
//
// Output (efter ACCEPT):
//   - ~/ai_upscale_work/inventory.json   (maskinläsbar full katalog)
//   - AGENTS_REGISTRY.md                  (auto-genererat katalog-block)
//
// Körs: node scripts/generate-inventory.js
// ════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const HOME = os.homedir();
const CLAUDE = path.join(HOME, '.claude');
const WORK = path.join(HOME, 'ai_upscale_work');
const REGISTRY = path.join(WORK, 'AGENTS_REGISTRY.md');
const INVENTORY = path.join(WORK, 'inventory.json');

// ── Hjälpare: läs en fil säkert (krascha aldrig) ──
function readSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); }
  catch (e) { return ''; }
}

// ── Hjälpare: parsa YAML-frontmatter (enkel, inga deps) ──
function parseFrontmatter(content) {
  const m = content.match(/^---\s*\n([\s\S]*?)\n---/);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (kv) out[kv[1].trim()] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

// ── Hjälpare: rekursiv glob efter ett filnamn under en rot ──
function findFiles(root, filename, results = [], depth = 0) {
  if (depth > 6) return results; // skydda mot djupa träd
  let entries;
  try { entries = fs.readdirSync(root, { withFileTypes: true }); }
  catch (e) { return results; }
  for (const e of entries) {
    const full = path.join(root, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      findFiles(full, filename, results, depth + 1);
    } else if (e.name === filename) {
      results.push(full);
    }
  }
  return results;
}

// ── 1. SKILLS ──
function scanSkills() {
  const skills = [];
  // Egna skills: ~/.claude/skills/*/SKILL.md (endast toppnivå)
  const skillsDir = path.join(CLAUDE, 'skills');
  try {
    for (const dir of fs.readdirSync(skillsDir)) {
      const sk = path.join(skillsDir, dir, 'SKILL.md');
      if (fs.existsSync(sk)) {
        const fm = parseFrontmatter(readSafe(sk));
        skills.push({ name: fm.name || dir, description: fm.description || '', source: 'egen' });
      }
    }
  } catch (e) { console.error('⚠️  Kunde ej läsa egna skills:', e.message); }

  // Plugin-skills: ~/.claude/plugins/**/SKILL.md
  const pluginSkills = findFiles(path.join(CLAUDE, 'plugins'), 'SKILL.md');
  for (const sk of pluginSkills) {
    const fm = parseFrontmatter(readSafe(sk));
    const plugin = sk.replace(path.join(CLAUDE, 'plugins') + path.sep, '').split(path.sep)[1] || 'plugin';
    skills.push({ name: fm.name || path.basename(path.dirname(sk)), description: fm.description || '', source: 'plugin:' + plugin });
  }
  return skills;
}

// ── 2. AGENTER ──
function scanAgents() {
  const agents = [];
  // Egna: ~/.claude/agents/*.md
  const agentsDir = path.join(CLAUDE, 'agents');
  try {
    for (const f of fs.readdirSync(agentsDir)) {
      if (!f.endsWith('.md')) continue;
      const fm = parseFrontmatter(readSafe(path.join(agentsDir, f)));
      agents.push({ name: fm.name || f.replace('.md', ''), description: fm.description || '', tools: fm.tools || '', source: 'egen' });
    }
  } catch (e) { console.error('⚠️  Kunde ej läsa egna agenter:', e.message); }

  // Plugin-agenter: ~/.claude/plugins/**/agents/*.md
  let pluginAgentFiles = [];
  (function walk(root, depth = 0) {
    if (depth > 6) return;
    let entries;
    try { entries = fs.readdirSync(root, { withFileTypes: true }); } catch (e) { return; }
    for (const e of entries) {
      const full = path.join(root, e.name);
      if (e.isDirectory()) {
        if (e.name === 'node_modules' || e.name === '.git') continue;
        walk(full, depth + 1);
      } else if (e.isFile() && e.name.endsWith('.md') && path.basename(path.dirname(full)) === 'agents') {
        pluginAgentFiles.push(full);
      }
    }
  })(path.join(CLAUDE, 'plugins'));
  for (const f of pluginAgentFiles) {
    const fm = parseFrontmatter(readSafe(f));
    const plugin = f.replace(path.join(CLAUDE, 'plugins') + path.sep, '').split(path.sep)[1] || 'plugin';
    agents.push({ name: fm.name || path.basename(f, '.md'), description: fm.description || '', tools: fm.tools || '', source: 'plugin:' + plugin });
  }
  return agents;
}

// ── 3. KOMMANDON ──
function scanCommands() {
  const cmds = [];
  // Egna: ~/.claude/commands/*.md
  const cmdDir = path.join(CLAUDE, 'commands');
  try {
    for (const f of fs.readdirSync(cmdDir)) {
      if (!f.endsWith('.md')) continue;
      const first = readSafe(path.join(cmdDir, f)).split('\n').find(l => l.trim()) || '';
      cmds.push({ name: f.replace('.md', ''), summary: first.replace(/^#+\s*/, '').slice(0, 80), source: 'egen' });
    }
  } catch (e) { console.error('⚠️  Kunde ej läsa egna kommandon:', e.message); }

  // Plugin-kommandon: ~/.claude/plugins/**/commands/*.md
  let pluginCmdFiles = [];
  (function walk(root, depth = 0) {
    if (depth > 6) return;
    let entries;
    try { entries = fs.readdirSync(root, { withFileTypes: true }); } catch (e) { return; }
    for (const e of entries) {
      const full = path.join(root, e.name);
      if (e.isDirectory()) {
        if (e.name === 'node_modules' || e.name === '.git') continue;
        walk(full, depth + 1);
      } else if (e.isFile() && e.name.endsWith('.md') && path.basename(path.dirname(full)) === 'commands') {
        pluginCmdFiles.push(full);
      }
    }
  })(path.join(CLAUDE, 'plugins'));
  for (const f of pluginCmdFiles) {
    const plugin = f.replace(path.join(CLAUDE, 'plugins') + path.sep, '').split(path.sep)[1] || 'plugin';
    cmds.push({ name: path.basename(f, '.md'), summary: '', source: 'plugin:' + plugin });
  }
  return cmds;
}

// ── Bygg markdown-tabell ──
function mdTable(rows, cols) {
  let out = '| ' + cols.join(' | ') + ' |\n';
  out += '|' + cols.map(() => '---').join('|') + '|\n';
  for (const r of rows) out += '| ' + cols.map(c => String(r[c.toLowerCase()] || r[c] || '').replace(/\|/g, '\\|').replace(/\n/g, ' ')).join(' | ') + ' |\n';
  return out;
}

// ── Skriv AGENTS_REGISTRY.md auto-block ──
function writeRegistry(skills, agents, cmds) {
  const START = '<!-- AUTO-GENERERAT:START -->';
  const END = '<!-- AUTO-GENERERAT:SLUT -->';
  const stamp = new Date().toISOString().slice(0, 10);

  let block = `${START}\n`;
  block += `## 📦 KOMPLETT KATALOG (auto-genererad ${stamp})\n\n`;
  block += `> Genererad av \`scripts/generate-inventory.js\`. Maskinläsbar källa: \`inventory.json\`.\n\n`;
  block += `**Totalt:** ${skills.length} skills · ${agents.length} agenter · ${cmds.length} kommandon\n\n`;

  block += `### Skills (${skills.length})\n\n`;
  block += mdTable(skills.sort((a, b) => a.name.localeCompare(b.name)), ['Name', 'Source', 'Description']);
  block += `\n### Agenter (${agents.length})\n\n`;
  block += mdTable(agents.sort((a, b) => a.name.localeCompare(b.name)), ['Name', 'Source', 'Description']);
  block += `\n### Kommandon (${cmds.length})\n\n`;
  block += mdTable(cmds.sort((a, b) => a.name.localeCompare(b.name)), ['Name', 'Source', 'Summary']);
  block += `\n${END}\n`;

  let content = readSafe(REGISTRY);
  if (content.includes(START) && content.includes(END)) {
    // Ersätt befintligt block
    content = content.replace(new RegExp(START + '[\\s\\S]*?' + END), block.trim());
  } else {
    // Lägg till före "## 7. REGLER" om det finns, annars i slutet
    const marker = '## 7. REGLER FÖR DETTA REGISTRY';
    if (content.includes(marker)) content = content.replace(marker, block + '\n---\n\n' + marker);
    else content += '\n\n' + block;
  }
  fs.writeFileSync(REGISTRY, content);
}

// ════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════
function main() {
  console.log('\n🔍 Skannar Claude-arsenalen...\n');
  const skills = scanSkills();
  const agents = scanAgents();
  const cmds = scanCommands();

  const ownSkills = skills.filter(s => s.source === 'egen').length;
  const ownAgents = agents.filter(a => a.source === 'egen').length;
  const ownCmds = cmds.filter(c => c.source === 'egen').length;

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  SKILLS:    ${skills.length}  (egna: ${ownSkills}, plugin: ${skills.length - ownSkills})`);
  console.log(`  AGENTER:   ${agents.length}  (egna: ${ownAgents}, plugin: ${agents.length - ownAgents})`);
  console.log(`  KOMMANDON: ${cmds.length}  (egna: ${ownCmds}, plugin: ${cmds.length - ownCmds})`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Kommer skriva:');
  console.log(`  → ${INVENTORY}`);
  console.log(`  → ${REGISTRY} (auto-block)\n`);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question('✅ Skriva detta? (y/N) ', (answer) => {
    if (answer.trim().toLowerCase() === 'y') {
      const inventory = {
        generated: new Date().toISOString(),
        totals: { skills: skills.length, agents: agents.length, commands: cmds.length },
        skills, agents, commands: cmds,
      };
      fs.writeFileSync(INVENTORY, JSON.stringify(inventory, null, 2));
      writeRegistry(skills, agents, cmds);
      console.log('\n✅ Klart! inventory.json + AGENTS_REGISTRY.md uppdaterade.\n');
    } else {
      console.log('\n🚫 Avbrutet. Inget skrevs.\n');
    }
    rl.close();
  });
}

main();
