#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════
// add-summaries.js
// Lägger till `summary:` i frontmatter på alla vault-noter.
//
// VARFÖR: Agenter läser EN summary-rad istället för hela filen →
// 70-90% färre tokens när de navigerar Graphify + Obsidian.
//
// Frågar ACCEPT (y/N) innan något skrivs.
// Körs: node scripts/add-summaries.js
// ════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const VAULT = path.join(os.homedir(), 'ai_upscale_work', 'Obsidian-Vaults', 'AI-Upscale-Brain');
// Mappar vi kuraterar (hoppa över genererade dumpar + backuper)
const INCLUDE = ['00-INDEX.md', '01-strategy', '03-agents', '04-projects', '08-memory'];
const SKIP_DIRS = ['.obsidian', '08-memory-backup', '99-graphify-dump'];

// Hitta alla .md-filer under valda sökvägar
function findMd(root, results = []) {
  let entries;
  try { entries = fs.readdirSync(root, { withFileTypes: true }); } catch (e) { return results; }
  for (const e of entries) {
    if (SKIP_DIRS.includes(e.name)) continue;
    const full = path.join(root, e.name);
    if (e.isDirectory()) findMd(full, results);
    else if (e.name.endsWith('.md')) results.push(full);
  }
  return results;
}

// Rensa markdown/länkar → ren en-rads text
function cleanLine(s) {
  return s
    .replace(/^>+\s*/, '')              // blockquote
    .replace(/^#+\s*/, '')              // heading
    .replace(/\*\*?/g, '')              // bold/italic
    .replace(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g, '$1') // wikilinks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')        // md-länkar
    .replace(/`/g, '')
    .trim();
}

// Metadata-rader som INTE duger som summary
const META = /^(Senast uppdaterad|Uppdaterad|Plats|Datum|Ägare|Version|Källa|Syfte)\b/i;

// Härled en kort summary ur notens innehåll
function deriveSummary(body) {
  const lines = body.split('\n');
  // 1) En "Syfte:"-rad är den bästa summaryn — använd texten efter kolon
  for (const l of lines) {
    const c = cleanLine(l);
    const m = c.match(/^Syfte:\s*(.+)/i);
    if (m && m[1].length > 8) return m[1].slice(0, 140);
  }
  // 2) Första blockquote-raden som INTE är metadata
  for (const l of lines) {
    if (!/^>\s*\S/.test(l)) continue;
    const c = cleanLine(l);
    if (c.length > 12 && !META.test(c)) return c.slice(0, 140);
  }
  // 3) Första vanliga paragraf (ej heading/tom/tabell/metadata)
  for (const l of lines) {
    const t = l.trim();
    if (!t || t.startsWith('#') || t.startsWith('|') || t.startsWith('---') || t.startsWith('>') || t.startsWith('-')) continue;
    const c = cleanLine(t);
    if (c.length > 12 && !META.test(c)) return c.slice(0, 140);
  }
  // 4) Fallback: H1-titeln
  const h1 = lines.find(l => /^#\s+\S/.test(l));
  return h1 ? cleanLine(h1).slice(0, 140) : 'Ingen sammanfattning';
}

// Lägg in summary i frontmatter (skapa frontmatter om den saknas)
function withSummary(content) {
  const fm = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (fm) {
    if (/^summary:/m.test(fm[1])) return null; // har redan summary → skippa
    const body = content.slice(fm[0].length);
    const summary = deriveSummary(body);
    const newFm = `---\n${fm[1]}\nsummary: ${summary}\n---\n`;
    return content.slice(0, 0) + newFm + body;
  }
  // Ingen frontmatter → skapa en
  const summary = deriveSummary(content);
  return `---\nsummary: ${summary}\n---\n\n${content}`;
}

function main() {
  console.log('\n🔍 Skannar vault-noter...\n');
  const files = [];
  for (const inc of INCLUDE) {
    const p = path.join(VAULT, inc);
    if (!fs.existsSync(p)) continue;
    if (fs.statSync(p).isDirectory()) findMd(p, files);
    else files.push(p);
  }

  const planned = [];
  for (const f of files) {
    const content = fs.readFileSync(f, 'utf8');
    const updated = withSummary(content);
    if (updated) planned.push({ f, updated, summary: deriveSummary(content.replace(/^---[\s\S]*?---\n?/, '')) });
  }

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  Noter totalt:        ${files.length}`);
  console.log(`  Får ny summary:      ${planned.length}`);
  console.log(`  Har redan summary:   ${files.length - planned.length}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log('Exempel (3 första):');
  planned.slice(0, 3).forEach(p => console.log(`  • ${path.basename(p.f)} → "${p.summary.slice(0, 70)}"`));
  console.log('');

  if (!planned.length) { console.log('✅ Alla noter har redan summary.\n'); return; }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(`✅ Lägg till summary i ${planned.length} noter? (y/N) `, (ans) => {
    if (ans.trim().toLowerCase() === 'y') {
      for (const p of planned) fs.writeFileSync(p.f, p.updated);
      console.log(`\n✅ Klart! summary tillagd i ${planned.length} noter.\n`);
    } else {
      console.log('\n🚫 Avbrutet. Inget skrevs.\n');
    }
    rl.close();
  });
}

main();
