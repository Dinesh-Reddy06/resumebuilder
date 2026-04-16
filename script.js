

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
        name: val('fname'),
        title: val('jobtitle'),
        email: val('email'),
        phone: val('phone'),
        location: val('location'),
        linkedin: val('linkedin'),
        summary: val('summary'),
        skills: val('skills'),
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
    if (tpl === 'classic') return renderClassic(d);
    if (tpl === 'sidebar') return renderSidebar(d);
    if (tpl === 'minimal') return renderMinimal(d);
    if (tpl === 'timeline') return renderTimeline(d);
    return '';
}

// Helper to render skill pills
function skillsList(skills) {
    return skills.split(',').map(s => s.trim()).filter(Boolean)
        .map(s => `<span style="display:inline-block;background:#eee;border-radius:3px;padding:1px 7px;margin:2px;font-size:11px">${s}</span>`).join('');
}

// ---- Classic Template ----
function renderClassic(d) {
    return `<div class="tpl-classic p-5">
    <div class="r-name fs-4 fw-bold text-dark ">${d.name || 'Your Name'}</div>
    <div class="r-title text-secondary fs-6 mb-1">${d.title || 'Your Job Title'}</div>
    <div class="r-contact small text-muted border-bottom border-2 border-dark pb-2 mb-3">${[d.email, d.phone, d.location, d.linkedin].filter(Boolean).join(' · ')}</div>
    ${d.summary ? `<p style="font-size:12px;color:#444;margin-bottom:10px">${d.summary}</p>` : ''}
    ${d.exp.length ? `<div class="r-section-head small text-uppercase fw-bold text-dark border-bottom mb-2 mt-3">Experience</div>
      ${d.exp.filter(e => e.title || e.company).map(e => `
        <div style="margin-bottom:10px">
          <div class="r-item-title fw-bold small">${e.title}</div>
          <div class="r-item-sub small text-muted">${e.company}${e.duration ? ' · ' + e.duration : ''}${e.loc ? ' · ' + e.loc : ''}</div>
          ${e.desc ? `<div class="r-item-desc small text-body mt-1">${e.desc}</div>` : ''}
        </div>`).join('')}` : ''}
    ${d.edu.length ? `<div class="r-section-head small text-uppercase fw-bold text-dark border-bottom mb-2 mt-3">Education</div>
      ${d.edu.filter(e => e.degree || e.institution).map(e => `
        <div style="margin-bottom:8px">
          <div class="r-item-title  fw-bold small">${e.degree}</div>
          <div class="r-item-sub small text-muted">${e.institution}${e.year ? ' · ' + e.year : ''}</div>
        </div>`).join('')}` : ''}
    ${d.skills ? `<div class="r-section-head small text-uppercase fw-bold text-dark border-bottom mb-2 mt-3">Skills</div><div>${skillsList(d.skills)}</div>` : ''}
    ${d.projects ? `<div class="r-section-head small text-uppercase fw-bold text-dark border-bottom mb-2 mt-3">Projects</div><div style="font-size:12px;color:#444">${d.projects}</div>` : ''}
  </div>`;
}

// ---- Sidebar Template ----
function renderSidebar(d) {
    return `<div class="tpl-sidebar d-flex small min-vh-100 ">
    <div class="r-sidebar flex-shrink-0 bg-dark text-light px-3 py-4">
      <div class="r-name fw-bold text-white lh-sm text-break">${d.name || 'Your Name'}</div>
      <div class="r-title small text-white-50 mt-1 mb-0">${d.title || ''}</div>
      <div class="r-section-head text-uppercase fw-bold text-warning border-bottom border-dark pb-1 mt-3 mb-2" style="margin-top:20px">Contact</div>
      ${d.email ? `<p>${d.email}</p>` : ''}
      ${d.phone ? `<p>${d.phone}</p>` : ''}
      ${d.location ? `<p>${d.location}</p>` : ''}
      ${d.linkedin ? `<p style="word-break:break-all">${d.linkedin}</p>` : ''}
      ${d.skills ? `<div class="r-section-head text-uppercase fw-bold text-warning border-bottom border-dark pb-1 mt-3 mb-2">Skills</div>
        ${d.skills.split(',').map(s => `<p style="margin:2px 0">${s.trim()}</p>`).join('')}` : ''}
    </div>
    <div class="r-main flex-fill px-3 py-4">
      ${d.summary ? `<p style="font-size:12px;color:#555;margin-bottom:10px">${d.summary}</p>` : ''}
      ${d.exp.length ? `<div class="r-section-head text-uppercase fw-bold text-dark border-bottom border-warning border-2 mt-3 mb-2">Experience</div>
        ${d.exp.filter(e => e.title || e.company).map(e => `
          <div style="margin-bottom:10px">
            <div class="r-item-title fw-semibold small mb-0">${e.title}</div>
            <div class="r-item-sub small text-muted mb-0">${e.company}${e.duration ? ' · ' + e.duration : ''}${e.loc ? ' · ' + e.loc : ''}</div>
            ${e.desc ? `<div class="r-item-desc small text-secondary mt-1 mb-0">${e.desc}</div>` : ''}
          </div>`).join('')}` : ''}
      ${d.edu.length ? `<div class="r-section-head text-uppercase fw-bold text-dark border-bottom border-warning border-2 mt-3 mb-2">Education</div>
        ${d.edu.filter(e => e.degree || e.institution).map(e => `
          <div style="margin-bottom:8px">
            <div class="r-item-title fw-semibold small mb-0">${e.degree}</div>
            <div class="r-item-sub small text-muted mb-0">${e.institution}${e.year ? ' · ' + e.year : ''}</div>
          </div>`).join('')}` : ''}
      ${d.projects ? `<div class="r-section-head text-uppercase fw-bold text-dark border-bottom border-warning border-2 mt-3 mb-2">Projects</div><div style="font-size:12px;color:#555">${d.projects}</div>` : ''}
    </div>
  </div>`;
}

// ---- Minimal Template ----
function renderMinimal(d) {
    return `<div class="tpl-minimal p-5">
    <div class="r-header border-start border-4 border-dark ps-3 mb-4">
      <div class="r-name fw-bold mb-0">${d.name || 'Your Name'}</div>
      <div class="r-title small text-muted mb-0">${d.title || ''}</div>
      <div class="r-contact small text-muted mt-1 mb-0">${[d.email, d.phone, d.location].filter(Boolean).join(' · ')}</div>
    </div>
    ${d.summary ? `<p style="font-size:12px;color:#555;margin-bottom:16px">${d.summary}</p>` : ''}
    ${d.exp.length ? `<div class="r-section-head text-uppercase text-muted mt-4 mb-2 small">Experience</div>
      ${d.exp.filter(e => e.title || e.company).map(e => `
        <div style="margin-bottom:12px">
          <div class="r-item-title fw-semibold mb-0">${e.title} <span style="font-weight:normal;color:#aaa">@ ${e.company}</span></div>
          <div class="r-item-sub small text-muted mb-0">${[e.duration, e.loc].filter(Boolean).join(' · ')}</div>
          ${e.desc ? `<div class="r-item-desc small text-secondary mt-1 mb-0">${e.desc}</div>` : ''}
        </div>`).join('')}` : ''}
    ${d.edu.length ? `<div class="r-section-head text-uppercase text-muted mt-4 mb-2 small">Education</div>
      ${d.edu.filter(e => e.degree || e.institution).map(e => `
        <div style="margin-bottom:10px">
          <div class="r-item-title fw-semibold mb-0">${e.degree}</div>
          <div class="r-item-sub small text-muted mb-0">${e.institution}${e.year ? ' · ' + e.year : ''}</div>
        </div>`).join('')}` : ''}
    ${d.skills ? `<div class="r-section-head text-uppercase text-muted mt-4 mb-2 small">Skills</div><div style="margin-bottom:12px">${skillsList(d.skills)}</div>` : ''}
    ${d.projects ? `<div class="r-section-head text-uppercase text-muted mt-4 mb-2 small">Projects</div><div style="font-size:12px;color:#555">${d.projects}</div>` : ''}
  </div>`;
}

// ---- Timeline Template ----
function renderTimeline(d) {
    const tlItem = (e) => `
    <div class="tl-item d-flex gap-2 mb-2 position-relative">
      <div style="position:relative">
        <div class="tl-dot bg-warning rounded-circle flex-shrink-0 position-relative mt-1" style="width:10px; height:10px;"></div>
        <div class="tl-line position-absolute bg-body-secondary"></div>
      </div>
      <div>
        <div class="r-item-title fw-semibold small mb-0">${e.title || e.degree}</div>
        <div class="r-item-sub small text-muted mb-0">${(e.company || e.institution || '')}${(e.duration || e.year) ? ' · ' + (e.duration || e.year) : ''}</div>
        ${(e.desc) ? `<div class="r-item-desc small text-secondary mt-1 mb-0">${e.desc}</div>` : ''}
      </div>
    </div>`;

    return `<div class="tpl-timeline">
    <div class="r-header bg-dark text-white px-4 py-4">
      <div class="r-name fw-bold mb-0">${d.name || 'Your Name'}</div>
      <div class="r-title small text-white-50 mt-1 mb-0">${d.title || ''}</div>
      <div class="r-contact small text-white-50 mt-2 mb-0">${[d.email, d.phone, d.location].filter(Boolean).join(' · ')}</div>
    </div>
    <div class="r-body px-4 py-4">
      ${d.summary ? `<p style="font-size:12px;color:#555;margin-bottom:14px">${d.summary}</p>` : ''}
      ${d.exp.filter(e => e.title || e.company).length ? `<div class="r-section-head text-uppercase fw-bold text-dark mt-3 mb-3">Experience</div>
        ${d.exp.filter(e => e.title || e.company).map(tlItem).join('')}` : ''}
      ${d.edu.filter(e => e.degree || e.institution).length ? `<div class="r-section-head text-uppercase fw-bold text-dark mt-3 mb-3">Education</div>
        ${d.edu.filter(e => e.degree || e.institution).map(tlItem).join('')}` : ''}
      ${d.skills ? `<div class="r-section-head text-uppercase fw-bold text-dark mt-3 mb-3">Skills</div><div style="margin-bottom:10px">${skillsList(d.skills)}</div>` : ''}
      ${d.projects ? `<div class="r-section-head text-uppercase fw-bold text-dark mt-3 mb-3">Projects</div><div style="font-size:12px;color:#555">${d.projects}</div>` : ''}
    </div>
  </div>`;
}

// --- PDF Download ---
function downloadPDF() {
    const d = getData();
    const previewEl = document.getElementById('resumePreview');
    if (!previewEl) return;

    // Save applicant data to localStorage for HR Dashboard
    submitToHR(d);

    html2pdf().set({
        margin: 0,
        filename: (d.name || 'resume') + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }
    }).from(previewEl).save();
}

// --- Submit applicant data to HR Dashboard via localStorage ---
function submitToHR(d) {
    if (!d.name && !d.email) return; // skip empty resumes
    const applicants = JSON.parse(localStorage.getItem('rf_applicants') || '[]');
    // Check if same email already submitted; update if so
    const existing = applicants.findIndex(a => a.email && a.email === d.email);
    const entry = { ...d, submittedAt: new Date().toISOString() };
    if (existing > -1) {
        applicants[existing] = entry;
    } else {
        applicants.push(entry);
    }
    localStorage.setItem('rf_applicants', JSON.stringify(applicants));
}





// login page
function showTab(tab) {
    document.getElementById('signinForm').style.display = tab === 'signin' ? '' : 'none';
    document.getElementById('registerForm').style.display = tab === 'register' ? '' : 'none';
    document.getElementById('signinTab').classList.toggle('active', tab === 'signin');
    document.getElementById('registerTab').classList.toggle('active', tab === 'register');
    hideAlert();
}
function showAlert(msg, type = 'danger') {
    const el = document.getElementById('alertMsg');
    el.textContent = msg;
    el.className = `alert alert-${type} small py-2`;
}
function hideAlert() {
    document.getElementById('alertMsg').className = 'alert d-none small py-2';
}
function doSignIn() {
    const username = document.getElementById('siUsername').value.trim();
    const password = document.getElementById('siPassword').value.trim();
    if (!username || !password) return showAlert('Please enter username and password.');
    const accounts = JSON.parse(localStorage.getItem('rf_hr_accounts') || '[]');
    const user = accounts.find(a => a.username === username && a.password === password);
    if (!user) return showAlert('Invalid username or password.');
    localStorage.setItem('rf_hr_session', JSON.stringify(user));
    showAlert('Login successful! Redirecting...', 'success');
    setTimeout(() => window.location.href = 'hr-dashboard.html', 800);
}
function doRegister() {
    const name = document.getElementById('regName').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const company = document.getElementById('regCompany').value.trim();
    if (!name || !username || !password || !company) return showAlert('Please fill in all fields.');
    const accounts = JSON.parse(localStorage.getItem('rf_hr_accounts') || '[]');
    if (accounts.find(a => a.username === username)) return showAlert('Username already taken.');
    accounts.push({ name, username, password, company });
    localStorage.setItem('rf_hr_accounts', JSON.stringify(accounts));
    showAlert('Account created! You can now sign in.', 'success');
    setTimeout(() => showTab('signin'), 1200);
}

if (window.location.pathname.includes('login.html')) {
    if (localStorage.getItem('rf_hr_session')) {
        window.location.href = 'hr-dashboard.html';
    }
}



// dasboard
let allApplicants = [], currentSearch = '';

if (window.location.pathname.includes('hr-dashboard.html')) {
    const session = JSON.parse(localStorage.getItem('rf_hr_session') || 'null');

    if (!session) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('navUserName').textContent = session.name;
        document.getElementById('navCompany').textContent = session.company;
        document.getElementById('welcomeName').textContent = session.name.split(' ')[0];
        document.getElementById('heroCompany').textContent = session.company;
    }
}

function loadApplicants() {
    allApplicants = JSON.parse(localStorage.getItem('rf_applicants') || '[]');
    renderTable(allApplicants, currentSearch);
}

function renderTable(list, searchTerm) {
    const tbody = document.getElementById('applicantsTable');
    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-5">${searchTerm ? `🔍 No applicants with skill "${searchTerm}".` : '📭 No applicants yet.'}</td></tr>`;
        return;
    }
    tbody.innerHTML = list.map((a, i) => {
        const skillsHtml = (a.skills || '').split(',').map(s => s.trim()).filter(Boolean)
            .map(s => `<span class="skill-tag ${searchTerm && s.toLowerCase().includes(searchTerm.toLowerCase()) ? 'highlight' : ''}">${s}</span>`).join('');
        const expCount = (a.exp || []).filter(e => e.title || e.company).length;
        return `<tr>
          <td class="text-muted">${i + 1}</td>
          <td>
            <div class="fw-semibold">${a.name || '—'}</div>
            <div class="text-muted">${a.title || ''}</div>
            ${i === allApplicants.length - 1 ? '<span class="badge bg-success-subtle text-success" style="font-size:10px">NEW</span>' : ''}
          </td>
          <td>
            <div>${a.email || '—'}</div>
            <div class="text-muted">${a.phone || ''}</div>
            <div class="text-muted">${a.location || ''}</div>
          </td>
          <td style="max-width:200px">${skillsHtml || '<span class="text-muted">None</span>'}</td>
          <td>${expCount} role${expCount !== 1 ? 's' : ''}</td>
          <td><button class="btn btn-dark btn-sm" onclick="viewDetail(${allApplicants.indexOf(a)})">View</button></td>
        </tr>`;
    }).join('');
}

function doSearch() {
    currentSearch = document.getElementById('skillSearch').value.trim();
    const filtered = currentSearch ? allApplicants.filter(a => (a.skills || '').toLowerCase().includes(currentSearch.toLowerCase())) : allApplicants;
    renderTable(filtered, currentSearch);
}

function clearSearch() {
    document.getElementById('skillSearch').value = '';
    currentSearch = '';
    renderTable(allApplicants, '');
}

function viewDetail(idx) {
    const a = allApplicants[idx];
    if (!a) return;
    document.getElementById('modalName').textContent = a.name || 'Applicant';
    const expHtml = (a.exp || []).filter(e => e.title || e.company).map(e =>
        `<div class="p-2 bg-light rounded mb-2">
          <div class="fw-semibold">${e.title || ''}</div>
          <div class="text-muted">${e.company || ''}${e.duration ? ' · ' + e.duration : ''}${e.loc ? ' · ' + e.loc : ''}</div>
          ${e.desc ? `<div class="mt-1">${e.desc}</div>` : ''}
        </div>`).join('') || '<span class="text-muted">No experience listed</span>';

    const eduHtml = (a.edu || []).filter(e => e.degree || e.institution).map(e =>
        `<div class="mb-2">
          <div class="fw-semibold">${e.degree || ''}</div>
          <div class="text-muted">${e.institution || ''}${e.year ? ' · ' + e.year : ''}</div>
        </div>`).join('') || '<span class="text-muted">No education listed</span>';

    const skillsHtml = (a.skills || '').split(',').map(s => s.trim()).filter(Boolean)
        .map(s => `<span class="skill-tag">${s}</span>`).join('') || '<span class="text-muted">None</span>';

    document.getElementById('modalBody').innerHTML = `
        <p><strong>Job Title:</strong> ${a.title || '—'}</p>
        <p><strong>Email:</strong> ${a.email || '—'}</p>
        <p><strong>Phone:</strong> ${a.phone || '—'}</p>
        <p><strong>Location:</strong> ${a.location || '—'}</p>
        ${a.linkedin ? `<p><strong>LinkedIn:</strong> <a href="${a.linkedin}" target="_blank">${a.linkedin}</a></p>` : ''}
        ${a.summary ? `<p><strong>Summary:</strong> ${a.summary}</p>` : ''}
        <p><strong>Skills:</strong><br>${skillsHtml}</p>
        <p><strong>Experience:</strong></p>${expHtml}
        <p class="mt-2"><strong>Education:</strong></p>${eduHtml}
        ${a.projects ? `<p class="mt-2"><strong>Projects:</strong> ${a.projects}</p>` : ''}
      `;
    new bootstrap.Modal(document.getElementById('detailModal')).show();
}

function doLogout() {
    localStorage.removeItem('rf_hr_session');
    window.location.href = 'login.html';
}

if (window.location.pathname.includes('hr-dashboard.html')) {
    loadApplicants();
    setInterval(loadApplicants, 3000);
}

