// ============================================================
//  HOME PAGE: shrink navbar on scroll
// ============================================================
const mainNav = document.getElementById('mainNav');
if (mainNav) {
  window.addEventListener('scroll', () => {
    mainNav.style.padding = window.scrollY > 50 ? '4px 0' : '';
  });
}

// ============================================================
//  BUILDER PAGE
// ============================================================

// --- State ---
let expItems = [];
let eduItems = [];

// --- On load: read template from URL param ---
window.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('templateSelector');
  if (!sel) return; // not builder page

  const param = new URLSearchParams(window.location.search).get('template');
  if (param) sel.value = param;

  sel.addEventListener('change', updatePreview);

  // Add one default row each
  addExp();
  addEdu();
  updatePreview();
});

// --- Add experience row ---
function addExp() {
  const id = Date.now();
  expItems.push(id);
  const div = document.createElement('div');
  div.className = 'border rounded p-2 mb-2 position-relative';
  div.id = 'exp-' + id;
  div.innerHTML = `
    <button type="button" class="btn-close position-absolute top-0 end-0 m-1" style="font-size:10px" onclick="removeItem('exp-${id}', expItems, ${id})"></button>
    <div class="row g-1">
      <div class="col-6"><input type="text" class="form-control form-control-sm" placeholder="Job Title" oninput="updatePreview()"/></div>
      <div class="col-6"><input type="text" class="form-control form-control-sm" placeholder="Company" oninput="updatePreview()"/></div>
      <div class="col-6"><input type="text" class="form-control form-control-sm" placeholder="Duration (e.g. 2022–2024)" oninput="updatePreview()"/></div>
      <div class="col-6"><input type="text" class="form-control form-control-sm" placeholder="Location" oninput="updatePreview()"/></div>
      <div class="col-12"><textarea class="form-control form-control-sm" rows="1" placeholder="Key responsibilities" oninput="updatePreview()"></textarea></div>
    </div>`;
  document.getElementById('expContainer').appendChild(div);
}

// --- Add education row ---
function addEdu() {
  const id = Date.now();
  eduItems.push(id);
  const div = document.createElement('div');
  div.className = 'border rounded p-2 mb-2 position-relative';
  div.id = 'edu-' + id;
  div.innerHTML = `
    <button type="button" class="btn-close position-absolute top-0 end-0 m-1" style="font-size:10px" onclick="removeItem('edu-${id}', eduItems, ${id})"></button>
    <div class="row g-1">
      <div class="col-7"><input type="text" class="form-control form-control-sm" placeholder="Degree / Course" oninput="updatePreview()"/></div>
      <div class="col-5"><input type="text" class="form-control form-control-sm" placeholder="Year" oninput="updatePreview()"/></div>
      <div class="col-12"><input type="text" class="form-control form-control-sm" placeholder="Institution" oninput="updatePreview()"/></div>
    </div>`;
  document.getElementById('eduContainer').appendChild(div);
}

// --- Remove a dynamic row ---
function removeItem(elemId, arr, id) {
  const idx = arr.indexOf(id);
  if (idx > -1) arr.splice(idx, 1);
  document.getElementById(elemId)?.remove();
  updatePreview();
}

// --- Collect all form values ---
function getData() {
  const d = {
    name:     val('fname'),
    title:    val('jobtitle'),
    email:    val('email'),
    phone:    val('phone'),
    location: val('location'),
    linkedin: val('linkedin'),
    summary:  val('summary'),
    skills:   val('skills'),
    projects: val('projects'),
    exp: [],
    edu: []
  };

  document.querySelectorAll('#expContainer > div').forEach(block => {
    const inputs = block.querySelectorAll('input, textarea');
    d.exp.push({ title: inputs[0].value, company: inputs[1].value, duration: inputs[2].value, loc: inputs[3].value, desc: inputs[4].value });
  });

  document.querySelectorAll('#eduContainer > div').forEach(block => {
    const inputs = block.querySelectorAll('input');
    d.edu.push({ degree: inputs[0].value, year: inputs[1].value, institution: inputs[2].value });
  });

  return d;
}

function val(id) { return document.getElementById(id)?.value.trim() || ''; }

// --- Render preview ---
function updatePreview() {
  const d = getData();
  const tpl = document.getElementById('templateSelector')?.value || 'classic';
  const box = document.getElementById('resumePreview');
  if (!box) return;
  box.innerHTML = renderTemplate(tpl, d);
}

// --- Template renderer ---
function renderTemplate(tpl, d) {
  if (tpl === 'classic')  return renderClassic(d);
  if (tpl === 'sidebar')  return renderSidebar(d);
  if (tpl === 'minimal')  return renderMinimal(d);
  if (tpl === 'timeline') return renderTimeline(d);
  return '';
}

// Helper to render skill pills
function skillsList(skills) {
  return skills.split(',').map(s => s.trim()).filter(Boolean)
    .map(s => `<span style="display:inline-block;background:#eee;border-radius:3px;padding:1px 7px;margin:2px;font-size:11px">${s}</span>`).join('');
}

function expSection(exp, headClass, itemTitleClass, itemSubClass, itemDescClass, wrapFn) {
  return exp.filter(e => e.title || e.company).map(e => wrapFn(e)).join('');
}

// ---- Classic Template ----
function renderClassic(d) {
  return `<div class="tpl-classic">
    <div class="r-name">${d.name || 'Your Name'}</div>
    <div class="r-title">${d.title || 'Your Job Title'}</div>
    <div class="r-contact">${[d.email, d.phone, d.location, d.linkedin].filter(Boolean).join(' · ')}</div>
    ${d.summary ? `<p style="font-size:12px;color:#444;margin-bottom:10px">${d.summary}</p>` : ''}
    ${d.exp.length ? `<div class="r-section-head">Experience</div>
      ${d.exp.filter(e=>e.title||e.company).map(e=>`
        <div style="margin-bottom:10px">
          <div class="r-item-title">${e.title}</div>
          <div class="r-item-sub">${e.company}${e.duration?' · '+e.duration:''}${e.loc?' · '+e.loc:''}</div>
          ${e.desc?`<div class="r-item-desc">${e.desc}</div>`:''}
        </div>`).join('')}` : ''}
    ${d.edu.length ? `<div class="r-section-head">Education</div>
      ${d.edu.filter(e=>e.degree||e.institution).map(e=>`
        <div style="margin-bottom:8px">
          <div class="r-item-title">${e.degree}</div>
          <div class="r-item-sub">${e.institution}${e.year?' · '+e.year:''}</div>
        </div>`).join('')}` : ''}
    ${d.skills ? `<div class="r-section-head">Skills</div><div>${skillsList(d.skills)}</div>` : ''}
    ${d.projects ? `<div class="r-section-head">Projects</div><div style="font-size:12px;color:#444">${d.projects}</div>` : ''}
  </div>`;
}

// ---- Sidebar Template ----
function renderSidebar(d) {
  return `<div class="tpl-sidebar">
    <div class="r-sidebar">
      <div class="r-name">${d.name || 'Your Name'}</div>
      <div class="r-title">${d.title || ''}</div>
      <div class="r-section-head" style="margin-top:20px">Contact</div>
      ${d.email?`<p>${d.email}</p>`:''}
      ${d.phone?`<p>${d.phone}</p>`:''}
      ${d.location?`<p>${d.location}</p>`:''}
      ${d.linkedin?`<p style="word-break:break-all">${d.linkedin}</p>`:''}
      ${d.skills?`<div class="r-section-head">Skills</div>
        ${d.skills.split(',').map(s=>`<p style="margin:2px 0">${s.trim()}</p>`).join('')}`:''}
    </div>
    <div class="r-main">
      ${d.summary?`<p style="font-size:12px;color:#555;margin-bottom:10px">${d.summary}</p>`:''}
      ${d.exp.length?`<div class="r-section-head">Experience</div>
        ${d.exp.filter(e=>e.title||e.company).map(e=>`
          <div style="margin-bottom:10px">
            <div class="r-item-title">${e.title}</div>
            <div class="r-item-sub">${e.company}${e.duration?' · '+e.duration:''}${e.loc?' · '+e.loc:''}</div>
            ${e.desc?`<div class="r-item-desc">${e.desc}</div>`:''}
          </div>`).join('')}`:''}
      ${d.edu.length?`<div class="r-section-head">Education</div>
        ${d.edu.filter(e=>e.degree||e.institution).map(e=>`
          <div style="margin-bottom:8px">
            <div class="r-item-title">${e.degree}</div>
            <div class="r-item-sub">${e.institution}${e.year?' · '+e.year:''}</div>
          </div>`).join('')}`:''}
      ${d.projects?`<div class="r-section-head">Projects</div><div style="font-size:12px;color:#555">${d.projects}</div>`:''}
    </div>
  </div>`;
}

// ---- Minimal Template ----
function renderMinimal(d) {
  return `<div class="tpl-minimal">
    <div class="r-header">
      <div class="r-name">${d.name || 'Your Name'}</div>
      <div class="r-title">${d.title || ''}</div>
      <div class="r-contact">${[d.email, d.phone, d.location].filter(Boolean).join(' · ')}</div>
    </div>
    ${d.summary?`<p style="font-size:12px;color:#555;margin-bottom:16px">${d.summary}</p>`:''}
    ${d.exp.length?`<div class="r-section-head">Experience</div>
      ${d.exp.filter(e=>e.title||e.company).map(e=>`
        <div style="margin-bottom:12px">
          <div class="r-item-title">${e.title} <span style="font-weight:normal;color:#aaa">@ ${e.company}</span></div>
          <div class="r-item-sub">${[e.duration,e.loc].filter(Boolean).join(' · ')}</div>
          ${e.desc?`<div class="r-item-desc">${e.desc}</div>`:''}
        </div>`).join('')}`:''}
    ${d.edu.length?`<div class="r-section-head">Education</div>
      ${d.edu.filter(e=>e.degree||e.institution).map(e=>`
        <div style="margin-bottom:10px">
          <div class="r-item-title">${e.degree}</div>
          <div class="r-item-sub">${e.institution}${e.year?' · '+e.year:''}</div>
        </div>`).join('')}`:''}
    ${d.skills?`<div class="r-section-head">Skills</div><div style="margin-bottom:12px">${skillsList(d.skills)}</div>`:''}
    ${d.projects?`<div class="r-section-head">Projects</div><div style="font-size:12px;color:#555">${d.projects}</div>`:''}
  </div>`;
}

// ---- Timeline Template ----
function renderTimeline(d) {
  const tlItem = (e) => `
    <div class="tl-item">
      <div style="position:relative">
        <div class="tl-dot"></div>
        <div class="tl-line"></div>
      </div>
      <div>
        <div class="r-item-title">${e.title || e.degree}</div>
        <div class="r-item-sub">${(e.company||e.institution||'')}${(e.duration||e.year)?' · '+(e.duration||e.year):''}</div>
        ${(e.desc)?`<div class="r-item-desc">${e.desc}</div>`:''}
      </div>
    </div>`;

  return `<div class="tpl-timeline">
    <div class="r-header">
      <div class="r-name">${d.name || 'Your Name'}</div>
      <div class="r-title">${d.title || ''}</div>
      <div class="r-contact">${[d.email, d.phone, d.location].filter(Boolean).join(' · ')}</div>
    </div>
    <div class="r-body">
      ${d.summary?`<p style="font-size:12px;color:#555;margin-bottom:14px">${d.summary}</p>`:''}
      ${d.exp.filter(e=>e.title||e.company).length?`<div class="r-section-head">Experience</div>
        ${d.exp.filter(e=>e.title||e.company).map(tlItem).join('')}`:''}
      ${d.edu.filter(e=>e.degree||e.institution).length?`<div class="r-section-head">Education</div>
        ${d.edu.filter(e=>e.degree||e.institution).map(tlItem).join('')}`:''}
      ${d.skills?`<div class="r-section-head">Skills</div><div style="margin-bottom:10px">${skillsList(d.skills)}</div>`:''}
      ${d.projects?`<div class="r-section-head">Projects</div><div style="font-size:12px;color:#555">${d.projects}</div>`:''}
    </div>
  </div>`;
}

// --- PDF Download ---
function downloadPDF() {
  const d = getData();
  const tpl = document.getElementById('templateSelector')?.value || 'classic';

  // Create a clean off-screen element without scaling
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:white';
  el.innerHTML = renderTemplate(tpl, d);

  // Inline the relevant styles for pdf rendering
  el.querySelectorAll('[class]').forEach(node => {
    const computed = window.getComputedStyle(node);
    node.style.fontFamily = computed.fontFamily;
    node.style.fontSize   = computed.fontSize;
    node.style.color      = computed.color;
  });

  document.body.appendChild(el);

  html2pdf().set({
    margin: 0,
    filename: (d.name || 'resume') + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }
  }).from(el).save().then(() => document.body.removeChild(el));
}