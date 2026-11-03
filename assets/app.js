"use strict";
/* ================= content ================= */
/* ================= helpers ================= */
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const esc = s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store = {
  get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
};
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const noHover = matchMedia("(hover: none)").matches;
const ACH_KEY="sa.ach2";
const earned=()=>store.get(ACH_KEY,{});
const achAt=(p,sec,i)=>ACH.find(a=>a.where.p===p&&a.where.sec===sec&&a.where.i===i);
const achKey=k=>ACH.find(a=>a.where.key===k);
const openAchIn=(p,sec)=>ACH.filter(a=>a.where.p===p&&(!sec||a.where.sec===sec)&&!earned()[a.id]);
const miniTrophy='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 01-10 0V4z"/><path d="M12 14v4M8 21h8"/></svg>';
function hot(text,a){
  if(!a) return esc(text);
  return earned()[a.id]
    ? `<span class="hot done" data-ach="${a.id}">${esc(text)}<span class="hotg">✓ ${a.g}G</span></span>`
    : `<span class="hot" role="button" tabindex="0" data-nav data-ach="${a.id}" aria-label="${esc(text)} (unlocks ${esc(a.name)}, ${a.g}G)">${esc(text)}<span class="hotg">${miniTrophy}${a.g}G</span></span>`;
}
function whereText(a){
  if(a.where.p) return `Find it in ${P[a.where.p].title} › ${SEC_NAMES[a.where.sec]}`;
  return a.where.tab==="profile" ? "Find it on the Profile page" : "Find it on the Resume page";
}

/* owner-added photos live in data/owner.json, published beside the page */
let OWNER = {photos:SITE_MEDIA.photos||{}, avatar:SITE_MEDIA.avatar||null, videos:SITE_MEDIA.videos||{}, me:SITE_MEDIA.me||[]};
let assetsCap = null, artifactCap = null, downloadsCap = null;

/* ================= sound ================= */
const Sound = {
  ctx:null, muted:store.get("sa.muted",false),
  ensure(){ if(this.ctx) return this.ctx; try{this.ctx=new (window.AudioContext||window.webkitAudioContext)()}catch(e){this.ctx=null} return this.ctx },
  tone(f,dur,{type="sine",vol=.05,at=0,to=null}={}){
    if(this.muted) return; const c=this.ensure(); if(!c) return;
    if(c.state==="suspended") c.resume().catch(()=>{});
    const t=c.currentTime+at, o=c.createOscillator(), g=c.createGain();
    o.type=type; o.frequency.setValueAtTime(f,t); if(to) o.frequency.exponentialRampToValueAtTime(to,t+dur);
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.008); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t+dur+.02);
  },
  move(){this.tone(1500,.045,{type:"triangle",vol:.03})},
  select(){this.tone(620,.08,{type:"triangle",vol:.06});this.tone(930,.12,{type:"triangle",vol:.05,at:.06})},
  back(){this.tone(560,.14,{type:"triangle",vol:.05,to:300})},
  tab(){this.tone(880,.06,{type:"sine",vol:.04,to:1180})},
  unlock(){[523,659,784,1047].forEach((f,i)=>this.tone(f,.32,{type:"triangle",vol:.05,at:i*.07}));this.tone(2093,.5,{type:"sine",vol:.025,at:.3})}
};
function renderMute(){
  const b=$("#muteBtn");
  b.setAttribute("aria-pressed",String(Sound.muted));
  b.innerHTML = (Sound.muted
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>Muted'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/></svg>Sound');
}
function toggleMute(){ Sound.muted=!Sound.muted; store.set("sa.muted",Sound.muted); renderMute(); if(!Sound.muted) Sound.select(); }

/* ================= generated tile art ================= */
function artSVG(kind){
  if(kind==="vortex") return `<svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="vt-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15281f"/><stop offset="1" stop-color="#07100b"/></linearGradient>
    <linearGradient id="vt-tube" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3f8fe0"/><stop offset=".45" stop-color="#cfd8dc"/><stop offset="1" stop-color="#e5574a"/></linearGradient></defs>
    <rect width="320" height="220" fill="url(#vt-bg)"/>
    <g stroke="#2a4436" stroke-width="1">${Array.from({length:12},(_,i)=>`<line x1="${i*28}" y1="0" x2="${i*28}" y2="220"/>`).join("")}</g>
    <rect x="40" y="78" width="240" height="30" rx="15" fill="url(#vt-tube)" opacity=".95"/>
    <rect x="40" y="78" width="240" height="11" rx="6" fill="#ffffff" opacity=".28"/>
    <rect x="138" y="44" width="30" height="40" rx="4" fill="#cfd8dc"/><path d="M153 20v24" stroke="#b8f56c" stroke-width="4"/><path d="M145 30l8-10 8 10" fill="none" stroke="#b8f56c" stroke-width="4"/>
    <g fill="none" stroke="#ffffff" stroke-opacity=".55" stroke-width="2">${Array.from({length:7},(_,i)=>`<ellipse cx="${70+i*30}" cy="93" rx="10" ry="13"/>`).join("")}</g>
    <path d="M30 93h-22" stroke="#6fb3ff" stroke-width="4"/><path d="M14 85l-8 8 8 8" fill="none" stroke="#6fb3ff" stroke-width="4"/>
    <path d="M290 93h22" stroke="#ff8a7d" stroke-width="4"/><path d="M306 85l8 8-8 8" fill="none" stroke="#ff8a7d" stroke-width="4"/>
    <text x="16" y="140" fill="#6fb3ff" font-family="JetBrains Mono,monospace" font-size="12">COLD</text>
    <text x="268" y="140" fill="#ff8a7d" font-family="JetBrains Mono,monospace" font-size="12">HOT</text>
    <text x="118" y="140" fill="#b8f56c" font-family="JetBrains Mono,monospace" font-size="11">P ≈ 33 psi</text>
  </svg>`;
  if(kind==="bode"){
    const pts=(f)=>{let d="";for(let i=0;i<=120;i++){const x=20+i*2.4;const y=f(i/120);d+=(i?"L":"M")+x.toFixed(1)+" "+y.toFixed(1)}return d};
    const base=pts(t=>150-62*Math.exp(-Math.pow((t-.5)/.045,2))-t*10);
    const tuned=pts(t=>150-34*Math.exp(-Math.pow((t-.33)/.04,2))-34*Math.exp(-Math.pow((t-.68)/.04,2))+62*Math.exp(-Math.pow((t-.5)/.03,2))-t*10);
    return `<svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="bd-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15281f"/><stop offset="1" stop-color="#07100b"/></linearGradient></defs>
    <rect width="320" height="220" fill="url(#bd-bg)"/>
    <g stroke="#24402f" stroke-width="1">${Array.from({length:9},(_,i)=>`<line x1="20" y1="${30+i*22}" x2="308" y2="${30+i*22}"/>`).join("")}${Array.from({length:7},(_,i)=>`<line x1="${20+i*48}" y1="30" x2="${20+i*48}" y2="206"/>`).join("")}</g>
    <path d="${base}" fill="none" stroke="#a7b2b7" stroke-width="2" stroke-dasharray="5 4"/>
    <path d="${tuned}" fill="none" stroke="#b8f56c" stroke-width="3"/>
    <path d="M164 92v108" stroke="#e5574a" stroke-width="1.5" stroke-dasharray="3 3"/>
    <text x="172" y="198" fill="#b8f56c" font-family="JetBrains Mono,monospace" font-size="12">−30 dB</text>
    <text x="26" y="22" fill="#a7b2b7" font-family="JetBrains Mono,monospace" font-size="11">|X/F|  dB</text>
  </svg>`;}
  if(kind==="thermal"){
    const blobs=[[90,80,70,"#ffffff"],[90,80,95,"#ffd84a"],[210,140,90,"#ff7a1a"],[150,60,120,"#d42f63"],[250,60,80,"#7b1fa2"],[60,170,110,"#3a0f6b"]];
    return `<svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><filter id="th-b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter></defs>
    <rect width="320" height="220" fill="#12051f"/>
    <g filter="url(#th-b)">${blobs.slice().reverse().map(b=>`<circle cx="${b[0]}" cy="${b[1]}" r="${b[2]}" fill="${b[3]}" opacity=".95"/>`).join("")}<circle cx="96" cy="84" r="26" fill="#ffffff"/></g>
    <g stroke="#000" stroke-opacity=".18">${Array.from({length:32},(_,i)=>`<line x1="${i*10}" y1="0" x2="${i*10}" y2="220"/>`).join("")}${Array.from({length:22},(_,i)=>`<line x1="0" y1="${i*10}" x2="320" y2="${i*10}"/>`).join("")}</g>
    <g fill="none" stroke="#fff" stroke-width="2"><path d="M86 74h20M96 64v20"/><rect x="232" y="16" width="72" height="22" rx="4" fill="#000" fill-opacity=".45" stroke="none"/></g>
    <text x="240" y="31" fill="#fff" font-family="JetBrains Mono,monospace" font-size="11">36.8 °C</text>
  </svg>`;}
  if(kind==="terminal") return `<svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="cd-case" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3f3c"/><stop offset="1" stop-color="#151816"/></linearGradient></defs>
    <rect width="320" height="220" fill="#0a120d"/>
    <rect x="34" y="14" width="252" height="128" rx="14" fill="url(#cd-case)"/>
    <rect x="58" y="30" width="204" height="98" rx="4" fill="#020604" stroke="#2b3a31"/>
    <g font-family="JetBrains Mono,monospace" font-size="10" fill="#8df26a">
      <text x="66" y="48">$ uname -sr</text><text x="66" y="62" fill="#c9d6cf">Linux 6.x deck</text>
      <text x="66" y="78">$ cat notes/todo.md</text><text x="66" y="92" fill="#c9d6cf">- print keyboard tray</text>
      <text x="66" y="106" fill="#c9d6cf">- check cable bend radius</text><text x="66" y="121">$</text>
      <rect x="76" y="113" width="7" height="10" fill="#8df26a"><animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/></rect>
    </g>
    <rect x="34" y="150" width="252" height="58" rx="10" fill="url(#cd-case)"/>
    <g fill="#2c332f">${Array.from({length:30},(_,i)=>`<rect x="${52+(i%10)*22}" y="${158+Math.floor(i/10)*15}" width="18" height="11" rx="2"/>`).join("")}</g>
  </svg>`;
  return "";
}
function artFor(id){
  const p=P[id]; const extra=(OWNER.photos[id]||[]);
  const src=p.tile||(extra[0]&&extra[0].url);
  if(src) return `<img src="${esc(src)}" alt="" loading="lazy">`;
  return artSVG(p.art);
}
function videoFor(id){ const o=OWNER.videos&&OWNER.videos[id]; return (o&&o.url)||P[id].video||null; }
function heroFor(id){
  const p=P[id]; const extra=(OWNER.photos[id]||[]);
  return p.hero||(extra[0]&&extra[0].url)||null;
}
function galleryFor(id){
  const base=P[id].gallery.map(([src,cap])=>({src,cap}));
  const extra=(OWNER.photos[id]||[]).map(x=>({src:x.url,cap:x.cap||"Added photo",owner:x.id}));
  return base.concat(extra);
}

/* ================= tiles ================= */
const trophy = '<svg viewBox="0 0 24 24" fill="none" stroke="#14201a" stroke-width="1.8" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 01-10 0V4z"/><path d="M7 6H4a3 3 0 003 4M17 6h3a3 3 0 01-3 4M12 14v4M8 21h8M9 18h6"/></svg>';
function projectTile(id,{big=false}={}){
  const p=P[id];
  const badge = p.status==="In progress" ? `<span class="badge wip">In progress</span>` : (id==="duck-hunt"?`<span class="badge">Featured · Capstone</span>`:"");
  const vid=videoFor(id);
  const left=openAchIn(id).length;
  const art=artFor(id)+(vid?`<video class="hv" muted loop playsinline preload="metadata" src="${esc(vid)}"></video>`:"");
  const vb=vid?`<span class="vbadge"><svg viewBox="0 0 10 10"><path d="M2 1l7 4-7 4z" fill="currentColor"/></svg>${noHover?"Video":"Hover to play"}</span>`:"";
  const medal=left?`<span class="medal" title="${left} achievement${left>1?"s":""} to find">${left}</span>`:"";
  return `<button class="tile${big?" big":""}" data-nav data-open="${id}" aria-label="${esc(p.title)}${left?`, ${left} achievement${left>1?"s":""} to find`:""}">
    <span class="art">${art}</span>${badge}${vb}
    <span class="label">${medal}<span class="t">${esc(p.title)}</span><span class="m">${esc(big?p.sub:(p.role+" · "+p.dates))}</span></span>
  </button>`;
}
function smallTile(tab,title,meta,glyph){
  return `<button class="tile small" data-nav data-goto="${tab}"><span class="inner"><span class="t">${title}</span><span class="m">${meta}</span></span>${glyph}</button>`;
}

/* ================= views ================= */
function renderHome(){
  const unlocked=Object.keys(earned()).filter(k=>ACH.some(a=>a.id===k)).length;
  const g='<svg class="glyph" viewBox="0 0 48 48" fill="none" stroke="#b8f56c" stroke-width="2.2">';
  let h=`<div class="viewhead"><div><div class="eyebrow">Mechanical engineering portfolio</div><h1>Sebastian Acendra</h1>
    <p>Projects, what I built on each one, and what I took away. Use the arrow keys, a controller, or just click around.</p></div></div>
  <div class="spot">
    ${projectTile("duck-hunt",{big:true})}
    <div class="side">
      ${smallTile("profile","My profile","Contact, skills, about me",g+'<circle cx="24" cy="17" r="8"/><path d="M9 41c2-9 8-13 15-13s13 4 15 13"/></svg>')}
      ${smallTile("resume","Resume","View or download the PDF",g+'<path d="M13 6h16l7 7v29H13z"/><path d="M29 6v7h7M19 22h12M19 28h12M19 34h8"/></svg>')}
      ${smallTile("achievements","Achievements",`${unlocked} of ${ACH.length} unlocked · ${TOTAL_G}G`,g+'<path d="M15 8h18v9a9 9 0 01-18 0V8z"/><path d="M15 11H9a6 6 0 006 7M33 11h6a6 6 0 01-6 7M24 26v7M17 40h14M19 33h10"/></svg>')}
    </div>
  </div>`;
  for(const r of ROWS){
    h+=`<section class="channel" aria-label="${esc(r.name)}"><div class="chead"><h2>${esc(r.name)}</h2><span class="count">${r.items.length} ${r.items.length===1?"project":"projects"}</span></div>
      <div class="strip">${r.items.map(id=>projectTile(id)).join("")}</div></section>`;
  }
  $("#v-home").innerHTML=h;
}

let currentProject=null, currentSection="overview";
function renderProject(id){
  const p=P[id]; currentProject=id;
  const row=ROWS.find(r=>r.items.includes(id));
  const hero=heroFor(id);
  const gal=galleryFor(id);
  const sections=[
    ["overview","Briefing","Overview",(p.overview.length>1?"The problem and the build":"What the project was")],
    ["role","Contributions","My role",p.role],
    ["learned","Debrief","What I learned",`${p.learned.length} takeaways`],
  ];
  if(p.callout) sections.splice(2,0,["field","Field report",p.callout.title,"Results from the trip"]);
  let h=`<div class="crumbs"><button class="backbtn" data-nav data-back><span class="pad b">B</span>Back</button>
    <span>Home</span><span class="sep">›</span><span>${esc(row.name)}</span><span class="sep">›</span><span style="color:var(--ink)">${esc(p.title)}</span></div>
  <div class="hero">
    ${hero?`<button class="heroart" data-nav data-lb="0" aria-label="Open photos"><img src="${esc(hero)}" alt="${esc(p.title)}"></button>`
          :`<div class="heroart static">${artSVG(p.art)}</div>`}
    <div class="info">
      <div class="eyebrow">${esc(row.name)}${p.status?" · "+esc(p.status):""}</div>
      <h1>${esc(p.title)}</h1>
      <p class="sub">${esc(p.sub)}</p>
      <dl class="facts"><dt>Role</dt><dd>${esc(p.role)}</dd><dt>When</dt><dd>${esc(p.dates)}</dd><dt>Team</dt><dd>${esc(p.team)}</dd><dt>Where</dt><dd>${esc(p.where)}</dd></dl>
      <div class="chips">${p.tags.map(t=>`<span class="chip">${esc(t)}</span>`).join("")}</div>
      <div class="stats">${p.stats.map(([v,l])=>`<div class="stat"><span class="v">${esc(v)}</span><span class="l">${esc(l)}</span></div>`).join("")}</div>
    </div>
  </div>
  <section class="channel"><div class="chead"><h2>Briefing</h2></div>
    <div class="strip" id="secStrip">${sections.map(([k,kick,t,m])=>`<button class="tile text" data-nav data-sec="${k}" aria-pressed="false"><span class="spip" title="Achievement inside"${openAchIn(id,k).length?"":" hidden"}>${miniTrophy}</span><span class="inner"><span class="k">${kick}</span><span><span class="t">${esc(t)}</span><br><span class="m">${esc(m)}</span></span></span></button>`).join("")}</div>
    <div class="reader" id="reader" aria-live="polite"></div>
  </section>
  <section class="channel" style="margin-top:30px"><div class="chead"><h2>Gallery</h2><span class="count">${gal.length} ${gal.length===1?"photo":"photos"}</span></div>
    <div class="strip">${gal.map((g,i)=>`<button class="tile" data-nav data-lb="${i}" aria-label="${esc(g.cap)}"><span class="art"><img src="${esc(g.src)}" alt="" loading="lazy"></span><span class="label"><span class="m" style="white-space:normal;color:#24302b">${esc(g.cap)}</span></span></button>`).join("")
      || `<p class="empty">No photos yet. They'll show up here once they're added.</p>`}
      ${assetsCap?`<button class="tile add" data-nav data-addvid="${id}"><span class="inner"><span><span class="plus">▶</span><span class="t" style="display:block;font:600 16px var(--font-display);margin-top:8px">${videoFor(id)?"Replace hover video":"Set hover video"}</span><span class="m" style="font-size:12px;color:var(--ink-dim)">Plays on the thumbnail · up to 20 MB</span></span></span></button>`:""}
      ${assetsCap?`<button class="tile add" data-nav data-add="${id}"><span class="inner"><span><span class="plus">+</span><span class="t" style="display:block;font:600 16px var(--font-display);margin-top:8px">Add photos</span><span class="m" style="font-size:12px;color:var(--ink-dim)">Only you see this button</span></span></span></button>`:""}
    </div>
  </section>`;
  $("#v-project").innerHTML=h;
  showSection(currentSection in {overview:1,role:1,learned:1,field:1} && (currentSection!=="field"||p.callout) ? currentSection : "overview", false);
}
function showSection(k, sound=true){
  const p=P[currentProject]; currentSection=k;
  $$("#secStrip [data-sec]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.sec===k)));
  let h="";
  const id=currentProject, H=(x,i)=>hot(x,achAt(id,k,i));
  if(k==="overview") h=`<h3>Overview</h3>${p.overview.map((x,i)=>`<p>${H(x,i)}</p>`).join("")}`;
  if(k==="role") h=`<h3>My contributions</h3><ul>${p.role_items.map((x,i)=>`<li>${H(x,i)}</li>`).join("")}</ul>`;
  if(k==="learned") h=`<h3>What I learned</h3><ul>${p.learned.map((x,i)=>`<li>${H(x,i)}</li>`).join("")}</ul>`;
  if(k==="field"&&p.callout) h=`<h3>${esc(p.callout.title)}</h3><p>${H("I was one of two team members sent to Oregon to test the first prototype and bring back data.",-1)}</p><div class="callout"><h4>What we found</h4><ul>${p.callout.items.map((x,i)=>`<li>${H(x,i)}</li>`).join("")}</ul></div>`;
  $("#reader").innerHTML=h;
  if(sound) Sound.select();
}

function renderAchievements(){
  const un=earned();
  const got=ACH.filter(a=>un[a.id]); const gotG=got.reduce((s,a)=>s+a.g,0);
  $("#v-achievements").innerHTML=`<div class="viewhead"><div><div class="eyebrow">Achievements</div><h1>${TOTAL_G}G earned on the job</h1>
    <p>Every achievement here is real. Look for the gold-glowing lines inside each project and on the Profile and Resume pages, then select one to unlock it.</p></div></div>
    <div class="achsum"><span class="chip">You've found ${got.length} of ${ACH.length} · ${gotG}G</span><div class="meter" role="progressbar" aria-valuemin="0" aria-valuemax="${ACH.length}" aria-valuenow="${got.length}"><i style="width:${(got.length/ACH.length*100).toFixed(1)}%"></i></div></div>
    <div class="achgrid">${ACH.map(a=>`<button class="ach${un[a.id]?"":" locked"}" data-nav ${a.where.p?`data-open="${a.where.p}" data-opensec="${a.where.sec}"`:`data-goto="${a.where.tab}"`}>
      <span class="trophy">${trophy}</span><span class="body"><span class="n">${esc(a.name)}</span><br><span class="d">${esc(a.d)}</span><span class="where">${esc(whereText(a))}</span></span><span class="g">${a.g}G</span></button>`).join("")}</div>`;
}

function avatarHTML(size){
  return OWNER.avatar ? `<img src="${esc(OWNER.avatar.url)}" alt="Sebastian Acendra">` : `<span class="mono"${size?` style="font-size:${size}px"`:""}>SA</span>`;
}
function renderProfile(){
  $("#v-profile").innerHTML=`<div class="viewhead"><div><div class="eyebrow">Profile</div><h1>Gamercard</h1></div></div>
  <div class="card">
    <div>
      <div class="gamercard">
        <div class="av">${avatarHTML()}</div>
        <h1>Sebastian Acendra</h1>
        <p class="motto">${esc(ME.line)}</p>
        <div class="gcrow"><span>Gamerscore</span><b><span class="gglyph" style="color:#1d6a10">G</span> ${TOTAL_G}</b></div>
        <div class="gcrow"><span>Zone</span><b>Mechanical design</b></div>
        <div class="gcrow"><span>Location</span><b>${esc(ME.city)}</b></div>
        <div class="gcrow"><span>Languages</span><b>${hot("English · Spanish",achKey("lang"))}</b></div>
        ${assetsCap?`<button class="bigbtn" data-nav id="avBtn" style="margin-top:4px">Change picture<small>Only you see this button</small></button>`:""}
      </div>
    </div>
    <div style="min-width:0">
      <div class="panel"><h2>About me</h2>
        <div class="about">${ABOUT.map((x,i)=>`<p>${i===ABOUT.length-1?hot(x,achKey("about")):esc(x)}</p>`).join("")}</div>
        <div class="photos-h"><h3>Photos</h3></div>
        <div class="strip mestrip">${OWNER.me.length
          ? OWNER.me.map((m,i)=>`<button class="tile" data-nav data-mlb="${i}" aria-label="${esc(m.cap||"Photo of Sebastian")}"><span class="art"><img src="${esc(m.url)}" alt="" loading="lazy"></span></button>`).join("")
          : [0,1,2].map(()=>`<div class="tile ph" aria-hidden="true"><span class="inner"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="6" y="13" width="36" height="26" rx="4"/><path d="M17 13l3-5h8l3 5"/><circle cx="24" cy="26" r="7"/></svg>Photo coming soon</span></div>`).join("")}
          ${assetsCap?`<button class="tile add" data-nav data-addme><span class="inner"><span><span class="plus">+</span><span class="t" style="display:block;font:600 16px var(--font-display);margin-top:8px">Add photos of me</span><span class="m" style="font-size:12px;color:var(--ink-dim)">Only you see this button</span></span></span></button>`:""}
        </div>
      </div>
      <div class="panel"><h2>Contact</h2><div class="contact">
        <div class="crow"><span class="k">Email</span><span class="v">${esc(ME.email)}</span><a class="iconbtn" href="mailto:${esc(ME.email)}" data-nav>Email</a><button class="iconbtn" data-nav data-copy="${esc(ME.email)}">Copy</button></div>
        <div class="crow"><span class="k">Based in</span><span class="v">${esc(ME.city)}</span></div>
        <div class="crow"><span class="k">Status</span><span class="v">${esc(ME.status)}</span></div>
      </div></div>
      <div class="panel"><h2>Education</h2><div class="skills">
        <div><h3>Georgia Institute of Technology</h3>B.S. Mechanical Engineering · graduating December 2026</div>
        <div><h3>Georgia State University</h3>${hot("Chemical engineering coursework, 2022–2023 · GPA 4.00 / 4.00",achKey("gsu"))}</div>
      </div></div>
      <div class="panel"><h2>Skills</h2><div class="skills">
        <div><h3>Technical</h3><div class="chips">${["Mechanical design","CAD modeling","FEA setup","Thermal analysis","Vibration testing","Electro-mechanical packaging","Mechatronics","Sensor integration","Data acquisition","Rapid prototyping"].map(s=>`<span class="chip">${s}</span>`).join("")}</div></div>
        <div><h3>Software</h3><div class="chips">${["Siemens NX","SolidWorks","Fusion 360","Altair HyperWorks","MATLAB","Python","Arduino IDE","Microsoft 365","Git"].map(s=>`<span class="chip">${s}</span>`).join("")}</div></div>
        <div><h3>Programming</h3><div class="chips">${["MATLAB data visualization","Python","Arduino / C++ control logic","OpenCV vision workflows"].map(s=>`<span class="chip">${s}</span>`).join("")}</div></div>
      </div></div>
    </div>
  </div>`;
}
function renderResume(){
  const gold=!earned().paper;
  $("#v-resume").innerHTML=`<div class="viewhead"><div><div class="eyebrow">Resume</div><h1>Resume</h1><p>Updated fall 2026.</p></div></div>
  <div class="resume">
    <div class="paper"><img src="img/res-1.webp" alt="Sebastian Acendra's resume"></div>
    <div class="rside">
      <a class="bigbtn primary${gold?" goldy":""}" id="dlLink" href="resume.pdf" download="Sebastian_Acendra_Resume.pdf" data-nav><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg><span>Download PDF<small>Sebastian_Acendra_Resume.pdf</small></span></a>
      ${false?`<button class="bigbtn primary${gold?" goldy":""}" data-nav id="dlBtn"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg><span>Download PDF<small>Sebastian_Acendra_Resume.pdf</small></span></button>`:""}
      <a class="bigbtn${gold?" goldy":""}" id="openPdf" href="resume.pdf" target="_blank" rel="noopener" data-nav><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg><span>Open PDF<small>Opens in a new tab</small></span></a>
      ${gold?`<p class="goldnote">Open or download the PDF to unlock Paper Trail (10G).</p>`:""}
      <p class="note">Contact: ${esc(ME.email)}</p>
    </div>
  </div>`;
}

/* ================= routing ================= */
const TABS=["home","achievements","profile","resume"];
let view="home";
function route(soft){
  if(soft && soft.type) soft=false;
  const h=(location.hash||"").slice(1);
  let next="home", pid=null;
  if(h.startsWith("p-") && P[h.slice(2)]){next="project";pid=h.slice(2)}
  else if(TABS.includes(h)) next=h;
  if(next==="project"){ if(pendingSec){ currentSection=pendingSec; pendingSec=null; } else if(pid!==currentProject) currentSection="overview"; renderProject(pid); }
  if(next==="achievements") renderAchievements();
  if(next==="profile"){ renderProfile(); }
  if(next==="resume"){ renderResume(); }
  if(next==="home") renderHome();
  observeVideos();
  for(const v of ["home","achievements","profile","resume","project"]) $("#v-"+v).hidden = v!==next;
  const tabFor = next==="project" ? "home" : next;
  $$(".pivot").forEach(b=>b.setAttribute("aria-current", b.dataset.tab===tabFor?"page":"false"));
  const prev=view; view=next;
  if(soft===true) return;
  window.scrollTo({top:0,behavior:"auto"});
  // put keyboard focus somewhere sensible
  requestAnimationFrame(()=>{
    if(next==="home" && prev==="project" && lastOpened){ const t=$(`#v-home [data-open="${lastOpened}"]`); if(t){t.focus({preventScroll:true});t.scrollIntoView({block:"center",inline:"nearest"});return} }
    if(usingKeys){ const first=$(`#v-${next} [data-nav]`); if(first) first.focus({preventScroll:true}); }
  });
}
let lastOpened=null, pendingSec=null;
function go(hash){ if(location.hash==="#"+hash) route(); else location.hash=hash; }
function openProject(id){ lastOpened=id; Sound.select(); go("p-"+id); }

/* ================= achievements ================= */
const toastQ=[]; let toasting=false;
function unlock(id){
  const un=earned(); if(un[id]) return;
  un[id]=Date.now(); store.set(ACH_KEY,un);
  const a=ACH.find(x=>x.id===id); if(a){ toastQ.push(a); pumpToasts(); }
  updateMini();
}
function earnFrom(el){
  const id=el.dataset.ach, a=ACH.find(x=>x.id===id); if(!a||earned()[id]) return;
  unlock(id);
  el.classList.add("done","flash"); el.removeAttribute("role"); el.removeAttribute("tabindex"); el.removeAttribute("data-nav"); el.removeAttribute("aria-label");
  const g=el.querySelector(".hotg"); if(g) g.textContent="✓ "+a.g+"G";
  if(view==="project") $$("#secStrip [data-sec]").forEach(b=>{ const pip=b.querySelector(".spip"); if(pip) pip.hidden=!openAchIn(currentProject,b.dataset.sec).length; });
}
function pumpToasts(){
  if(toasting||!toastQ.length) return; toasting=true;
  const a=toastQ.shift(); const el=document.createElement("div"); el.className="toast";
  el.innerHTML=`<span class="orb">${trophy}</span><span class="tt"><span class="k">Achievement unlocked</span><div class="v">${a.g}G – ${esc(a.name)}</div></span>`;
  $("#toasts").appendChild(el); Sound.unlock();
  setTimeout(()=>{el.classList.add("out");setTimeout(()=>{el.remove();toasting=false;pumpToasts()},350)},2600);
}
function notice(msg){
  const el=document.createElement("div"); el.className="toast plain";
  el.innerHTML=`<span class="orb">${trophy}</span><span class="tt"><span class="k">Dashboard</span><div class="v" style="white-space:normal">${esc(msg)}</div></span>`;
  $("#toasts").appendChild(el); setTimeout(()=>{el.classList.add("out");setTimeout(()=>el.remove(),350)},3200);
}
function updateMini(){ $("#miniGs").textContent=TOTAL_G; $("#miniAv").innerHTML=avatarHTML(15); }

/* ================= lightbox ================= */
let lbItems=[], lbIdx=0;
function openLB(i,items){ lbItems=items||galleryFor(currentProject); if(!lbItems.length) return; lbIdx=i; $("#lb").hidden=false; drawLB(); Sound.select(); $("#lbClose").focus(); }
function drawLB(){ const it=lbItems[lbIdx]; $("#lbImg").src=it.src; $("#lbImg").alt=it.cap; $("#lbCap").textContent=it.cap; $("#lbCount").textContent=`${lbIdx+1} / ${lbItems.length}`; $("#lbRemove").hidden=!(it.owner&&assetsCap); }
function stepLB(d){ lbIdx=(lbIdx+d+lbItems.length)%lbItems.length; drawLB(); Sound.move(); }
function closeLB(){ $("#lb").hidden=true; Sound.back(); const t=$(`#v-${view} [data-lb="${lbIdx}"],#v-${view} [data-mlb="${lbIdx}"]`)||$(`#v-${view} [data-lb],#v-${view} [data-mlb]`); if(t) t.focus({preventScroll:false}); }
const meItems=()=>OWNER.me.map(m=>({src:m.url,cap:m.cap||"Sebastian",owner:m.id,kind:"me"}));

/* ================= spatial navigation ================= */
let usingKeys=false;
function navScope(){ if(!$("#lb").hidden) return $$("#lb [data-lnav]"); return $$("[data-nav]").filter(e=>e.offsetParent!==null && !e.closest("[hidden]")); }
function moveFocus(dir){
  const list=navScope(); if(!list.length) return;
  const cur=document.activeElement;
  if(!list.includes(cur)){ const start=$(`#v-${view} [data-nav]`)||list[0]; start.focus(); start.scrollIntoView({block:"nearest",inline:"nearest"}); Sound.move(); return; }
  const a=cur.getBoundingClientRect(), ax=a.left+a.width/2, ay=a.top+a.height/2;
  const sameStrip=cur.closest(".strip");
  let best=null, bestS=Infinity;
  for(const el of list){ if(el===cur) continue;
    const b=el.getBoundingClientRect(), bx=b.left+b.width/2, by=b.top+b.height/2;
    let prim, sec;
    if(dir==="right"){prim=bx-ax;sec=Math.abs(by-ay)}
    if(dir==="left"){prim=ax-bx;sec=Math.abs(by-ay)}
    if(dir==="down"){prim=by-ay;sec=Math.abs(bx-ax)}
    if(dir==="up"){prim=ay-by;sec=Math.abs(bx-ax)}
    if(prim<=4) continue;
    if((dir==="left"||dir==="right") && sameStrip && el.closest(".strip")!==sameStrip && sec>a.height/2) continue;
    const s = (dir==="left"||dir==="right") ? prim + sec*4 : prim + sec*.7;
    if(s<bestS){bestS=s;best=el}
  }
  if(best){ best.focus({preventScroll:true}); best.scrollIntoView({block:"nearest",inline:"nearest",behavior:reduceMotion?"auto":"smooth"}); glowify(best); Sound.move(); }
}
function switchTab(d){
  const cur = view==="project" ? "home" : view;
  const i=(TABS.indexOf(cur)+d+TABS.length)%TABS.length; Sound.tab(); go(TABS[i]);
}
function back(){
  if(!$("#lb").hidden){ closeLB(); return; }
  if(view==="project"){ Sound.back(); go("home"); return; }
  if(view!=="home"){ Sound.back(); go("home"); }
}

/* random green glow per hover/focus */
function glowify(el){
  if(!el.classList||!el.classList.contains("tile")) return;
  const r=(a,b)=>a+Math.random()*(b-a);
  el.style.setProperty("--gh",Math.round(r(82,150)));
  el.style.setProperty("--gl",Math.round(r(48,66))+"%");
  el.style.setProperty("--gr",Math.round(r(18,46))+"px");
  el.style.setProperty("--gd",r(.7,2.1).toFixed(2)+"s");
  el.style.setProperty("--gx",r(-2,2).toFixed(1)+"px");
  el.style.setProperty("--gy",r(-4,0).toFixed(1)+"px");
}

/* ================= events ================= */
document.addEventListener("click",e=>{
  const hs=e.target.closest(".hot[data-ach]");
  if(hs){ if(!hs.classList.contains("done")) earnFrom(hs); return; }
  const t=e.target.closest("button,a"); if(!t) return;
  if(t.dataset.open){ if(t.dataset.opensec) pendingSec=t.dataset.opensec; openProject(t.dataset.open); return; }
  if(t.dataset.goto){ Sound.select(); go(t.dataset.goto); return; }
  if(t.dataset.tab){ Sound.tab(); go(t.dataset.tab); return; }
  if(t.id==="miniCard"){ Sound.select(); go("profile"); return; }
  if("back" in t.dataset){ back(); return; }
  if(t.dataset.sec){ showSection(t.dataset.sec); return; }
  if(t.dataset.lb!==undefined && t.closest("#v-project")){ openLB(+t.dataset.lb); return; }
  if(t.dataset.copy){ copyText(t.dataset.copy,t); return; }
  if(t.dataset.add){ pick(t.dataset.add,"image/*",true); return; }
  if(t.dataset.addvid){ pick("video:"+t.dataset.addvid,"video/mp4,video/webm,video/quicktime",false); return; }
  if("addme" in t.dataset){ pick("__me","image/*",true); return; }
  if(t.dataset.mlb!==undefined){ openLB(+t.dataset.mlb, meItems()); return; }
  if(t.id==="openPdf"||t.id==="dlLink"){ earnPaper(); return; }
  if(t.id==="avBtn"){ pick("__avatar","image/*",false); return; }
  if(t.id==="dlBtn"){ earnPaper(); downloadResume(); return; }
  if(t.id==="muteBtn"){ toggleMute(); return; }
  if(t.id==="lbClose"){ closeLB(); return; }
  if(t.id==="lbPrev"){ stepLB(-1); return; }
  if(t.id==="lbNext"){ stepLB(1); return; }
  if(t.id==="lbRemove"){ removeOwnerPhoto(); return; }
});
document.addEventListener("pointerover",e=>{ const t=e.target.closest(".tile"); if(t && !t.contains(e.relatedTarget)){ glowify(t); usingKeys=false; hoverVideo(t,true); } });
document.addEventListener("pointerout",e=>{ const t=e.target.closest(".tile"); if(t && !t.contains(e.relatedTarget)) hoverVideo(t,false); });
document.addEventListener("focusout",e=>{ const t=e.target.closest&&e.target.closest(".tile"); if(t && !t.contains(e.relatedTarget)) hoverVideo(t,false); });
function hoverVideo(tile,on){
  const v=tile.querySelector("video.hv"); if(!v) return;
  if(on){ const pr=v.play(); if(pr&&pr.then) pr.then(()=>v.classList.add("on")).catch(()=>{}); else v.classList.add("on"); }
  else { v.classList.remove("on"); v.pause(); try{v.currentTime=0}catch(e){} }
}
let vidObs=null;
function observeVideos(){
  if(!noHover||reduceMotion||!("IntersectionObserver" in window)) return;
  if(!vidObs) vidObs=new IntersectionObserver(es=>es.forEach(en=>{ const t=en.target.closest(".tile"); if(t) hoverVideo(t,en.intersectionRatio>.6); }),{threshold:[0,.6,1]});
  vidObs.disconnect(); $$("video.hv").forEach(v=>vidObs.observe(v));
}
document.addEventListener("pointerdown",()=>{ usingKeys=false; Sound.ensure(); },{passive:true});
document.addEventListener("keydown",e=>{
  if(e.target.matches("input,textarea")) return;
  const k=e.key;
  const lbOpen=!$("#lb").hidden;
  if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(k)){
    usingKeys=true; e.preventDefault();
    if(lbOpen && (k==="ArrowLeft"||k==="ArrowRight")){ stepLB(k==="ArrowLeft"?-1:1); return; }
    moveFocus(k.replace("Arrow","").toLowerCase()); return;
  }
  if(k==="Escape"||k==="Backspace"){ e.preventDefault(); back(); return; }
  if((k==="q"||k==="Q"||k==="PageUp") && !lbOpen){ e.preventDefault(); switchTab(-1); return; }
  if((k==="e"||k==="E"||k==="PageDown") && !lbOpen){ e.preventDefault(); switchTab(1); return; }
  if(k==="m"||k==="M"){ toggleMute(); return; }
  if(k==="Enter"||k===" "){ usingKeys=true;
    const ae=document.activeElement;
    if(ae&&ae.matches&&ae.matches(".hot[role=button]")){ e.preventDefault(); earnFrom(ae); } }
});
document.addEventListener("focusin",e=>{ if(e.target.classList&&e.target.classList.contains("tile")){ glowify(e.target); hoverVideo(e.target,true); } });
window.addEventListener("hashchange",route);

function copyText(text,btn){
  const done=()=>{const o=btn.textContent;btn.textContent="Copied";Sound.select();setTimeout(()=>btn.textContent=o,1400)};
  try{ navigator.clipboard.writeText(text).then(done,()=>selectFallback(btn)); }catch(e){ selectFallback(btn); }
}
function selectFallback(btn){ const v=btn.parentElement.querySelector(".v"); if(!v) return; const r=document.createRange(); r.selectNodeContents(v); const s=getSelection(); s.removeAllRanges(); s.addRange(r); notice("Selected. Press Ctrl+C or ⌘C to copy."); }

/* ================= gamepad (optional) ================= */
(function pad(){
  if(!("getGamepads" in navigator)) return;
  let prev={}, lastMove=0;
  function poll(t){
    let pads=[]; try{pads=navigator.getGamepads()||[]}catch(e){return}
    const gp=[...pads].find(Boolean);
    if(gp){
      const b=i=>gp.buttons[i]&&gp.buttons[i].pressed;
      const edge=i=>b(i)&&!prev[i];
      const ax=gp.axes[0]||0, ay=gp.axes[1]||0;
      let dir=null;
      if(b(14)||ax<-.6) dir="left"; else if(b(15)||ax>.6) dir="right"; else if(b(12)||ay<-.6) dir="up"; else if(b(13)||ay>.6) dir="down";
      if(dir && t-lastMove>170){ usingKeys=true; if(!$("#lb").hidden&&(dir==="left"||dir==="right")) stepLB(dir==="left"?-1:1); else moveFocus(dir); lastMove=t; }
      if(!dir) lastMove=0;
      if(edge(0)){ const a=document.activeElement; if(a&&a.click) a.click(); }
      if(edge(1)) back();
      if(edge(4)) switchTab(-1);
      if(edge(5)) switchTab(1);
      prev={}; gp.buttons.forEach((x,i)=>prev[i]=x.pressed);
    }
    requestAnimationFrame(poll);
  }
  addEventListener("gamepadconnected",()=>{ notice("Controller connected. A selects, B goes back, LB/RB switch sections."); requestAnimationFrame(poll); },{once:true});
})();

/* ================= background ribbons ================= */
(function bg(){
  const c=$("#bg"), x=c.getContext("2d"); let w,h,dpr;
  function size(){ dpr=Math.min(2,devicePixelRatio||1); w=c.width=innerWidth*dpr; h=c.height=innerHeight*dpr; }
  size(); addEventListener("resize",()=>{size(); if(reduceMotion) draw(0)});
  const ribbons=[
    {y:.30,a:.10,f:1.3,s:.00011,c:[105,208,42],o:.22,wd:120},
    {y:.42,a:.08,f:1.9,s:-.00008,c:[184,245,108],o:.12,wd:70},
    {y:.62,a:.12,f:1.1,s:.00006,c:[223,229,232],o:.08,wd:150},
    {y:.74,a:.07,f:2.4,s:-.00012,c:[105,208,42],o:.14,wd:60},
  ];
  function draw(t){
    const g=x.createRadialGradient(w*.5,h*.15,0,w*.5,h*.4,Math.max(w,h)*.8);
    g.addColorStop(0,"#11241a"); g.addColorStop(.55,"#07110b"); g.addColorStop(1,"#030604");
    x.fillStyle=g; x.fillRect(0,0,w,h);
    x.globalCompositeOperation="lighter";
    for(const r of ribbons){
      for(let k=0;k<3;k++){
        x.beginPath();
        for(let i=0;i<=60;i++){ const px=i/60*w; const py=h*(r.y + r.a*Math.sin(i/60*Math.PI*r.f + t*r.s*6.28 + k*.35) + k*.012); i?x.lineTo(px,py):x.moveTo(px,py); }
        x.strokeStyle=`rgba(${r.c.join(",")},${r.o/(k+1)})`; x.lineWidth=r.wd*dpr/(k*1.6+1); x.lineCap="round"; x.stroke();
      }
    }
    x.globalCompositeOperation="source-over";
  }
  if(reduceMotion){ draw(0); return; }
  let last=0;
  function loop(t){ if(!document.hidden && t-last>40){ draw(t); last=t; } requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
})();

/* ================= clock ================= */
function tick(){ const d=new Date(); $("#clock").textContent=d.toLocaleTimeString([], {hour:"numeric",minute:"2-digit"}); }
tick(); setInterval(tick,15000);

/* ================= owner tools: add photos ================= */
let pickFor=null;
function pick(target,accept,multiple){ pickFor=target; const f=$("#filePick"); f.accept=accept; f.multiple=multiple; f.click(); }
function earnPaper(){ if(earned().paper) return; unlock("paper"); $$("#v-resume .goldy").forEach(b=>b.classList.remove("goldy")); const n=$("#v-resume .goldnote"); if(n) n.remove(); }
$("#filePick").addEventListener("change",async e=>{
  let files=[...e.target.files]; e.target.value=""; if(!files.length||!assetsCap) return;
  if(pickFor.startsWith("video:")){
    const big=files.filter(f=>f.size>20*1024*1024);
    if(big.length){ notice(`${big[0].name} is over 20 MB. Trim or compress it, or send it to Claude to compress.`); files=files.filter(f=>f.size<=20*1024*1024); if(!files.length) return; }
  }
  notice(`Uploading ${files.length} ${files.length===1?"photo":"photos"}…`);
  const added=[];
  for(const f of files){
    try{ const r=await assetsCap.upload(f); added.push({id:r.id,url:r.url,cap:f.name.replace(/\.[^.]+$/,"").replace(/[_-]+/g," ")}); }
    catch(err){ notice(err&&err.code==="unsupported_type"?`${f.name} isn't a supported file type.`:err&&err.code==="too_large"?`${f.name} is too large to upload.`:`Couldn't upload ${f.name}. Try again.`); }
  }
  if(!added.length) return;
  const next=JSON.parse(JSON.stringify(OWNER));
  next.videos=next.videos||{}; next.me=next.me||[];
  let msg=`Added ${added.length} ${added.length===1?"photo":"photos"}.`;
  if(pickFor==="__avatar"){ next.avatar=added[0]; msg="Picture updated."; }
  else if(pickFor==="__me"){ next.me=next.me.concat(added); }
  else if(pickFor.startsWith("video:")){ const pid=pickFor.slice(6); const old=next.videos[pid]; next.videos[pid]=added[0]; msg="Hover video set."; if(old&&old.id) assetsCap.delete(old.id).catch(()=>{}); }
  else next.photos[pickFor]=(next.photos[pickFor]||[]).concat(added);
  await saveOwner(next,msg);
});
async function removeOwnerPhoto(){
  const it=lbItems[lbIdx]; if(!it||!it.owner) return;
  const next=JSON.parse(JSON.stringify(OWNER));
  if(it.kind==="me") next.me=(next.me||[]).filter(x=>x.id!==it.owner);
  else next.photos[currentProject]=(next.photos[currentProject]||[]).filter(x=>x.id!==it.owner);
  const ok=await saveOwner(next,"Photo removed.");
  if(ok){ try{ await assetsCap.delete(it.owner) }catch(e){} $("#lb").hidden=true; }
}
async function saveOwner(next,msg){
  if(!artifactCap){ notice("Saving isn't available in this view."); return false; }
  try{
    await artifactCap.publish({"data/owner.json": JSON.stringify(next,null,1)});
    OWNER=next; updateMini(); route(true); notice(msg); return true;
  }catch(err){
    const c=err&&err.code;
    if(c==="capability_disabled") notice("Saving is off while the page is shared publicly. Open it from your Claude gallery to add photos.");
    else if(c==="not_writer"||c==="not_granted") notice("This view is read-only.");
    else if(c==="conflict") notice("The page changed elsewhere. It's reloading; try again after.");
    else notice("Couldn't save. Try again.");
    return false;
  }
}
async function downloadResume(){
  try{
    const blob=await (await fetch("resume.pdf")).blob();
    await downloadsCap.save({filename:"Sebastian_Acendra_Resume.pdf",data:blob});
  }catch(err){
    if(err&&err.code==="declined") return;
    notice("Download didn't start. Use Open PDF instead.");
  }
}

/* ================= boot ================= */
renderMute(); updateMini();
route();
