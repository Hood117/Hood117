const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'assets');
fs.mkdirSync(OUT, { recursive: true });

const ICONS = JSON.parse(fs.readFileSync(path.join(__dirname, 'icons.json'), 'utf8').replace(/^\uFEFF/, ''));
const AVATAR = fs.readFileSync(path.join(__dirname, 'avatar.jpg')).toString('base64');

const F = "Consolas,'JetBrains Mono','Fira Code','Cascadia Mono','Courier New',monospace";
const C = {
  bg: '#0d1117', panel: '#161b22', border: '#30363d', line: '#21262d',
  text: '#e6edf3', soft: '#c9d1d9', muted: '#8b949e', faint: '#6e7681',
  lime: '#a3e635', cyan: '#22d3ee', violet: '#a78bfa', amber: '#f0b429',
  blue: '#58a6ff', ts: '#60a5fa', pbi: '#f2c811',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function text(x, y, str, o = {}) {
  let a = `x="${x}" y="${y}" font-family="${F}" font-size="${o.size || 16}" fill="${o.fill || C.text}"`;
  if ((o.weight || 400) !== 400) a += ` font-weight="${o.weight}"`;
  if ((o.anchor || 'start') !== 'start') a += ` text-anchor="${o.anchor}"`;
  if (o.ls) a += ` letter-spacing="${o.ls}"`;
  if ((o.op || 1) !== 1) a += ` opacity="${o.op}"`;
  return `<text ${a}>${esc(str)}</text>`;
}

function textTspans(x, y, parts, o = {}) {
  let a = `x="${x}" y="${y}" font-family="${F}" font-size="${o.size || 20}" fill="${o.fill || C.text}"`;
  if ((o.weight || 400) !== 400) a += ` font-weight="${o.weight}"`;
  if ((o.anchor || 'start') !== 'start') a += ` text-anchor="${o.anchor}"`;
  const inner = parts.map((p) => `<tspan fill="${p.fill}"${p.weight ? ` font-weight="${p.weight}"` : ''}>${esc(p.t)}</tspan>`).join('');
  return `<text ${a}>${inner}</text>`;
}

function rect(x, y, w, h, fill, o = {}) {
  let a = `x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"`;
  if (o.rx !== undefined) a += ` rx="${o.rx}"`;
  if (o.stroke) a += ` stroke="${o.stroke}" stroke-width="${o.sw || 1}"`;
  if ((o.op || 1) !== 1) a += ` opacity="${o.op}"`;
  return `<rect ${a}/>`;
}

function line(x1, y1, x2, y2, stroke, sw = 1) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"/>`;
}

function svg(w, h, body, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">\n${body}\n</svg>\n`;
}

function winHeader(w, title, right, h = 46) {
  return [
    rect(0, 0, w, h, C.panel),
    line(0, h, w, h, C.line),
    rect(20, h / 2 - 5, 10, 10, C.lime),
    text(40, h / 2 + 5, title, { size: 14, fill: C.text, weight: 700 }),
    text(w - 20, h / 2 + 5, right, { size: 14, fill: C.muted, anchor: 'end' }),
  ].join('\n');
}

/* ---------------- hero ---------------- */
const hero = () => {
  const W = 1200, H = 320;
  const body = [
    `<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d1117"/><stop offset="1" stop-color="#0f1a15"/></linearGradient><pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="#1b2533"/></pattern><clipPath id="avclip"><circle cx="1010" cy="190" r="80"/></clipPath></defs>`,
    rect(0, 0, W, H, 'url(#bg)'),
    rect(0, 0, W, H, 'url(#dots)'),
    `<image href="data:image/jpeg;base64,${AVATAR}" xlink:href="data:image/jpeg;base64,${AVATAR}" x="930" y="110" width="160" height="160" clip-path="url(#avclip)" preserveAspectRatio="xMidYMid slice"/>`,
    `<circle cx="1010" cy="190" r="81.5" fill="none" stroke="${C.lime}" stroke-width="3"/>`,
    `<circle cx="1066" cy="246" r="12" fill="${C.lime}" stroke="${C.bg}" stroke-width="5"/>`,
    rect(0, 0, W, 44, C.panel),
    line(0, 44, W, 44, C.border),
    `<circle cx="26" cy="22" r="7" fill="#ff5f56"/>`,
    `<circle cx="50" cy="22" r="7" fill="#ffbd2e"/>`,
    `<circle cx="74" cy="22" r="7" fill="#27c93f"/>`,
    text(600, 27, 'hood117@github:~', { size: 15, fill: C.muted, anchor: 'middle' }),
    text(56, 118, 'RAHMATULLAH ZADRAN', { size: 16, fill: C.lime, ls: 5 }),
    text(56, 212, 'HOOD117', { size: 96, weight: 700, fill: C.text }),
    rect(56, 232, 404, 5, C.lime),
    text(56, 282, 'FULL-STACK DEVELOPER \u00b7 DEVOPS \u00b7 AUTOMATE EVERYTHING', { size: 24, fill: C.soft }),
  ].join('\n');
  return svg(W, H, body, 'Hood117 — Rahmatullah Zadran, full-stack developer');
};

/* ---------------- skills ---------------- */
const skills = () => {
  const W = 720, H = 446;
  const cols = [
    {
      x: 40, groups: [
        { cat: 'FRONTEND', color: C.cyan, rows: [['Next.js', 95], ['React', 92], ['TypeScript', 90], ['Tailwind CSS', 88]] },
        { cat: 'BACKEND', color: C.violet, rows: [['Node.js', 90], ['PostgreSQL', 85], ['Prisma', 82], ['Python', 78]] },
      ],
    },
    {
      x: 392, groups: [
        { cat: 'DEVOPS & CLOUD', color: C.lime, rows: [['Linux', 90], ['Docker', 88], ['Git', 92], ['Bash', 85], ['Nginx', 80], ['Kubernetes', 78], ['AWS', 75]] },
        { cat: 'DATA', color: C.amber, rows: [['Apache Hadoop', 70], ['Apache Hive', 68]] },
      ],
    },
  ];
  const parts = [rect(0, 0, W, H, C.bg), rect(0, 0, W, H, C.bg, { stroke: C.border }), winHeader(W, 'TECHNICAL REPORT', 'hood117 --skills')];
  parts.push(line(370, 70, 370, 414, C.line));
  for (const col of cols) {
    let y = 74;
    for (const g of col.groups) {
      parts.push(rect(col.x, y + 2, 10, 10, g.color, { rx: 2 }));
      parts.push(text(col.x + 18, y + 11, g.cat, { size: 13, fill: g.color, ls: 1.5, weight: 700 }));
      y += 32;
      for (const [label, pct] of g.rows) {
        parts.push(text(col.x, y + 19, label, { size: 16, fill: C.soft }));
        parts.push(rect(col.x + 150, y + 9, 110, 10, C.line, { rx: 5 }));
        parts.push(rect(col.x + 150, y + 9, Math.round(pct * 1.1), 10, g.color, { rx: 5 }));
        parts.push(text(col.x + 268, y + 19, String(pct), { size: 13, fill: C.muted }));
        y += 30;
      }
      y += 4;
    }
  }
  parts.push(text(W - 20, H - 14, 'self-assessed \u00b7 scaled by coffee', { size: 11, fill: C.faint, anchor: 'end' }));
  return svg(W, H, parts.join('\n'), 'Skills report');
};

/* ---------------- system log ---------------- */
const syslog = () => {
  const W = 720, H = 226;
  const rows = [
    { tag: 'OK', color: C.lime, msg: 'build passed on first try \u2014 it happens sometimes' },
    { tag: 'OK', color: C.lime, msg: 'infra declared as code, not folklore' },
    { tag: 'WARN', color: C.amber, msg: 'sleep.service failed to start' },
    { tag: '...', color: C.cyan, msg: 'automating the task done twice yesterday' },
  ];
  const parts = [rect(0, 0, W, H, C.bg), rect(0, 0, W, H, C.bg, { stroke: C.border }), winHeader(W, 'SYSTEM LOG', 'tail -f /var/log/hood117.log')];
  let y = 62;
  for (const r of rows) {
    parts.push(rect(20, y + 4, 56, 24, r.color, { rx: 4 }));
    parts.push(text(48, y + 21, r.tag, { size: 13, fill: '#0d1117', weight: 700, anchor: 'middle' }));
    parts.push(text(92, y + 21, r.msg, { size: 15, fill: C.soft }));
    y += 36;
  }
  return svg(W, H, parts.join('\n'), 'System log');
};

/* ---------------- project cards ---------------- */
const cards = [
  { file: 'card-my-notes-app', name: 'my-notes-app', accent: C.lime, lang: 'TYPESCRIPT', langFill: C.ts, desc: 'Note-taking app \u00b7 React + Supabase', star: null },
  { file: 'card-mini-openclaw', name: 'mini-openclaw', accent: C.lime, lang: 'TYPESCRIPT', langFill: C.ts, desc: 'Small TypeScript playground', star: null },
  { file: 'card-powerbi-sales-dashboard', name: 'powerbi-sales-dashboard', accent: C.amber, lang: 'POWER BI', langFill: C.pbi, desc: 'Interactive sales dashboard', star: '1' },
  { file: 'card-ssh-guide', name: 'ssh-guide', accent: C.cyan, lang: 'SHELL', langFill: C.lime, desc: "Everything about that's in SSH", star: '1' },
];

function cardSvg(c) {
  const W = 640, H = 110;
  const parts = [
    rect(0, 0, W, H, C.bg),
    rect(0, 0, W, H, C.bg, { stroke: C.border }),
    rect(16, 30, 6, 50, c.accent, { rx: 3 }),
    text(38, 48, c.name, { size: 22, weight: 700, fill: C.text }),
    text(W - 24, 48, '\u2197', { size: 18, fill: C.muted, anchor: 'end' }),
    text(38, 80, c.desc, { size: 15, fill: C.muted }),
  ];
  const right = [{ t: c.lang, fill: c.langFill }];
  if (c.star) right.push({ t: ' \u00b7 \u2605 ' + c.star, fill: C.amber });
  parts.push(textTspans(W - 24, 80, right, { size: 13, anchor: 'end' }));
  return svg(W, H, parts.join('\n'), c.name);
}

/* ---------------- social chips ---------------- */
const socials = [
  { file: 'social-linkedin', key: 'linkedin', label: 'LINKEDIN', color: '#0a66c2' },
  { file: 'social-x', key: 'x', label: 'X.COM', color: '#e6edf3' },
  { file: 'social-github', key: 'github', label: 'GITHUB', color: '#e6edf3' },
  { file: 'social-website', key: 'website', label: 'WEBSITE', color: C.lime },
  { file: 'social-gmail', key: 'gmail', label: 'GMAIL', color: '#ea4335' },
  { file: 'social-instagram', key: 'instagram', label: 'INSTAGRAM', color: '#e4405f' },
  { file: 'social-discord', key: 'discord', label: 'DISCORD', color: '#5865f2' },
];

function chipSvg(s) {
  const H = 44;
  const W = 58 + Math.round(s.label.length * 8.4);
  const icon = s.key === 'website'
    ? `<g transform="translate(16,14) scale(0.66667)" fill="none" stroke="${s.color}" stroke-width="2"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><line x1="3" y1="12" x2="21" y2="12"/></g>`
    : `<g transform="translate(16,14) scale(0.66667)" fill="${s.color}"><path d="${ICONS[s.key]}"/></g>`;
  const parts = [
    rect(0, 0, W, H, C.panel, { stroke: C.border, rx: 8 }),
    icon,
    text(42, 27, s.label, { size: 14, fill: C.text }),
  ];
  return svg(W, H, parts.join('\n'), s.label);
}

/* ---------------- write all ---------------- */
const files = {
  'hero.svg': hero(),
  'skills.svg': skills(),
};
for (const s of socials) files[s.file + '.svg'] = chipSvg(s);

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), content, 'utf8');
}
console.log('wrote', Object.keys(files).length, 'files:', Object.keys(files).join(', '));
