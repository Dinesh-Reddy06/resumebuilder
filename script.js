// ResumeForge - script.js

// ---- LIVE PREVIEW ----

function val(id) { var e = document.getElementById(id); return e ? e.value : ''; }
function setEl(id, html) { var e = document.getElementById(id); if (e) e.innerHTML = html; }
function setTxt(id, txt) { var e = document.getElementById(id); if (e) e.textContent = txt; }
function getField(block, name) { var e = block.querySelector('[name="' + name + '"]'); return e ? e.value : ''; }

function updatePreview() {
    setTxt('prev-name', val('full-name') || 'Your Name');
    setTxt('prev-title', val('job-title') || 'Professional Title');

    var contact = '';
    if (val('email')) contact += '<span>✉ ' + val('email') + '</span>';
    if (val('phone')) contact += '<span>📞 ' + val('phone') + '</span>';
    if (val('location')) contact += '<span>📍 ' + val('location') + '</span>';
    if (val('linkedin')) contact += '<span>🔗 ' + val('linkedin') + '</span>';
    setEl('prev-contact', contact);

    setEl('prev-summary', val('summary') || '<em style="color:#aaa">Your summary will appear here...</em>');

    buildSection('education-entries', 'prev-education', buildEduHTML);
    buildSection('experience-entries', 'prev-experience', buildExpHTML);
    buildSection('project-entries', 'prev-projects', buildProjHTML);
    buildSection('achievement-entries', 'prev-achievements', buildAchHTML);

    var tags = document.querySelectorAll('.skill-tag'), sh = '';
    for (var i = 0; i < tags.length; i++) sh += '<span class="preview-skill-tag">' + tags[i].getAttribute('data-skill') + '</span>';
    setEl('prev-skills', sh || '<em style="color:#aaa">Add skills...</em>');

    autoSave();
}

function buildSection(cId, pId, fn) {
    var c = document.getElementById(cId), p = document.getElementById(pId);
    if (!c || !p) return;
    var blocks = c.querySelectorAll('.entry-block'), html = '';
    for (var i = 0; i < blocks.length; i++) html += fn(blocks[i]);
    p.innerHTML = html || '<em style="color:#aaa">Nothing added yet...</em>';
}

function buildEduHTML(b) {
    var deg = getField(b, 'degree'), col = getField(b, 'college');
    if (!deg && !col) return '';
    return '<div class="preview-entry"><span class="preview-entry-title">' + deg + '</span><span class="preview-entry-date">' + getField(b, 'edu-year') + '</span><div class="preview-entry-sub">' + col + (getField(b, 'cgpa') ? ' · CGPA: ' + getField(b, 'cgpa') : '') + '</div></div>';
}

function buildExpHTML(b) {
    var role = getField(b, 'role'), co = getField(b, 'company');
    if (!role && !co) return '';
    var desc = getField(b, 'exp-desc');
    return '<div class="preview-entry"><span class="preview-entry-title">' + role + '</span><span class="preview-entry-date">' + getField(b, 'duration') + '</span><div class="preview-entry-sub">' + co + '</div>' + (desc ? '<div class="preview-entry-desc">' + desc.replace(/\n/g, '<br>') + '</div>' : '') + '</div>';
}

function buildProjHTML(b) {
    var n = getField(b, 'project-name'); if (!n) return '';
    return '<div class="preview-entry"><span class="preview-entry-title">' + n + '</span><span class="preview-entry-date">' + getField(b, 'tech-stack') + '</span><div class="preview-entry-desc">' + getField(b, 'project-desc') + '</div></div>';
}

function buildAchHTML(b) {
    var t = getField(b, 'achievement');
    return t ? '<div class="preview-entry"><div class="preview-entry-desc">◆ ' + t + '</div></div>' : '';
}


// ---- ADD / REMOVE ENTRIES ----

function addEntry(cId, tplFn) {
    var c = document.getElementById(cId); if (!c) return;
    var b = document.createElement('div'); b.className = 'entry-block';
    b.innerHTML = tplFn(); c.appendChild(b);
    listenToFields(); updatePreview();
}

function removeEntry(btn) {
    var b = btn.closest('.entry-block'); if (b) { b.remove(); updatePreview(); }
}

function rmBtn() {
    return '<div class="d-flex justify-content-end"><button class="btn-remove-entry" onclick="removeEntry(this)">✕</button></div>';
}

function educationTemplate() {
    return rmBtn() + '<div class="row g-2">' +
        '<div class="col-12"><input class="form-control" name="degree" placeholder="Degree (e.g. B.Tech CSE)" oninput="updatePreview()"></div>' +
        '<div class="col-12"><input class="form-control" name="college" placeholder="College / University" oninput="updatePreview()"></div>' +
        '<div class="col-6"><input class="form-control" name="edu-year" placeholder="2020–2024" oninput="updatePreview()"></div>' +
        '<div class="col-6"><input class="form-control" name="cgpa" placeholder="CGPA / %" oninput="updatePreview()"></div>' +
        '</div>';
}

function experienceTemplate() {
    return rmBtn() + '<div class="row g-2">' +
        '<div class="col-12"><input class="form-control" name="role" placeholder="Job Role / Title" oninput="updatePreview()"></div>' +
        '<div class="col-8"><input class="form-control" name="company" placeholder="Company Name" oninput="updatePreview()"></div>' +
        '<div class="col-4"><input class="form-control" name="duration" placeholder="2022–2023" oninput="updatePreview()"></div>' +
        '<div class="col-12"><textarea class="form-control" name="exp-desc" rows="2" placeholder="Responsibilities..." oninput="updatePreview()"></textarea></div>' +
        '</div>';
}

function projectTemplate() {
    return rmBtn() + '<div class="row g-2">' +
        '<div class="col-8"><input class="form-control" name="project-name" placeholder="Project Name" oninput="updatePreview()"></div>' +
        '<div class="col-4"><input class="form-control" name="tech-stack" placeholder="Tech Used" oninput="updatePreview()"></div>' +
        '<div class="col-12"><textarea class="form-control" name="project-desc" rows="2" placeholder="Brief description..." oninput="updatePreview()"></textarea></div>' +
        '</div>';
}

function achievementTemplate() {
    return rmBtn() + '<div class="col-12 mt-1"><input class="form-control" name="achievement" placeholder="e.g. Won Hackathon 2024, AWS Certified..." oninput="updatePreview()"></div>';
}


// ---- SKILL TAGS ----

function setupSkillInput() {
    var input = document.getElementById('skill-input'); if (!input) return;
    input.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
            e.preventDefault(); addSkillTag(input.value.trim().replace(/,$/, '')); input.value = '';
        }
        if (e.key === 'Backspace' && !input.value) {
            var tags = document.querySelectorAll('.skill-tag');
            if (tags.length) { tags[tags.length - 1].remove(); updatePreview(); }
        }
    });
    var box = document.getElementById('skill-input-box');
    if (box) box.addEventListener('click', function () { input.focus(); });
}

function addSkillTag(skill) {
    if (!skill) return;
    var existing = document.querySelectorAll('.skill-tag');
    for (var i = 0; i < existing.length; i++) {
        if (existing[i].getAttribute('data-skill').toLowerCase() === skill.toLowerCase()) return;
    }
    var box = document.getElementById('skill-input-box'), input = document.getElementById('skill-input');
    if (!box || !input) return;
    var tag = document.createElement('div');
    tag.className = 'skill-tag'; tag.setAttribute('data-skill', skill);
    tag.innerHTML = skill + ' <span onclick="this.parentElement.remove();updatePreview()">✕</span>';
    box.insertBefore(tag, input); updatePreview();
}


// ---- AUTO SAVE & LOAD ----

function autoSave() {
    if (!document.getElementById('full-name')) return;
    var skills = [], tags = document.querySelectorAll('.skill-tag');
    for (var i = 0; i < tags.length; i++) skills.push(tags[i].getAttribute('data-skill'));

    function collect(cId, fields) {
        var res = [], c = document.getElementById(cId); if (!c) return res;
        var blocks = c.querySelectorAll('.entry-block');
        for (var j = 0; j < blocks.length; j++) {
            var obj = {};
            for (var k = 0; k < fields.length; k++) { var el = blocks[j].querySelector('[name="' + fields[k] + '"]'); if (el) obj[fields[k]] = el.value; }
            res.push(obj);
        }
        return res;
    }

    localStorage.setItem('resumeData', JSON.stringify({
        name: val('full-name'), title: val('job-title'), email: val('email'),
        phone: val('phone'), location: val('location'), linkedin: val('linkedin'), summary: val('summary'),
        skills: skills,
        education: collect('education-entries', ['degree', 'college', 'edu-year', 'cgpa']),
        experience: collect('experience-entries', ['role', 'company', 'duration', 'exp-desc']),
        projects: collect('project-entries', ['project-name', 'tech-stack', 'project-desc']),
        achievements: collect('achievement-entries', ['achievement'])
    }));
}

function loadSavedData() {
    var stored = localStorage.getItem('resumeData'); if (!stored) return;
    var data; try { data = JSON.parse(stored); } catch (e) { return; }

    function sv(id, v) { var e = document.getElementById(id); if (e && v) e.value = v; }
    sv('full-name', data.name); sv('job-title', data.title); sv('email', data.email);
    sv('phone', data.phone); sv('location', data.location); sv('linkedin', data.linkedin); sv('summary', data.summary);

    if (data.skills) for (var i = 0; i < data.skills.length; i++) addSkillTag(data.skills[i]);

    function restore(cId, tplFn, items, fields) {
        var c = document.getElementById(cId); if (!c || !items) return;
        for (var j = 0; j < items.length; j++) {
            var b = document.createElement('div'); b.className = 'entry-block'; b.innerHTML = tplFn(); c.appendChild(b);
            for (var k = 0; k < fields.length; k++) { var el = b.querySelector('[name="' + fields[k] + '"]'); if (el && items[j][fields[k]]) el.value = items[j][fields[k]]; }
        }
    }

    restore('education-entries', educationTemplate, data.education, ['degree', 'college', 'edu-year', 'cgpa']);
    restore('experience-entries', experienceTemplate, data.experience, ['role', 'company', 'duration', 'exp-desc']);
    restore('project-entries', projectTemplate, data.projects, ['project-name', 'tech-stack', 'project-desc']);
    restore('achievement-entries', achievementTemplate, data.achievements, ['achievement']);
    listenToFields(); updatePreview();
}

function clearAllData() {
    if (confirm('Clear all resume data?')) { localStorage.removeItem('resumeData'); location.reload(); }
}


// ---- PDF DOWNLOAD ----

function downloadPDF() {
    var btn = document.getElementById('download-btn');
    if (btn) { btn.textContent = 'Generating...'; btn.disabled = true; }
    setTimeout(function () {
        var div = document.getElementById('resume-preview');
        if (!div) { if (btn) { btn.textContent = 'Download PDF'; btn.disabled = false; } return; }
        var opts = { margin: 0, filename: (val('full-name') || 'resume') + '.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } };
        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opts).from(div).save().then(function () { if (btn) { btn.textContent = 'Download PDF'; btn.disabled = false; } });
        } else { window.print(); if (btn) { btn.textContent = 'Download PDF'; btn.disabled = false; } }
    }, 100);
}


// ---- TEMPLATE SWITCHING ----

function selectTemplate(id, card) {
    document.querySelectorAll('.template-card').forEach(function (c) { c.classList.remove('selected'); });
    card.closest('.template-card').classList.add('selected');
    applyTemplate(id);
    var m = bootstrap.Modal.getInstance(document.getElementById('templateModal')); if (m) m.hide();
}

function applyTemplate(id) {
    var prev = document.getElementById('resume-preview'); if (!prev) return;
    var hdr = prev.querySelector('.preview-header'); if (!hdr) return;
    var t = { modern: { bg: '#1a1a2e', ac: '#e94560' }, minimal: { bg: '#2d2d2d', ac: '#888' }, executive: { bg: '#0f3460', ac: '#f5a623' }, creative: { bg: '#6c35de', ac: '#ff6b6b' } };
    var c = t[id] || t.modern;
    hdr.style.backgroundColor = c.bg;
    prev.querySelectorAll('.preview-section-title').forEach(function (el) { el.style.borderColor = c.ac; });
    var jt = prev.querySelector('.preview-title'); if (jt) jt.style.color = c.ac;
}


// ---- HR FILTERS ----

function filterCandidates() {
    var q = document.getElementById('hr-search') ? document.getElementById('hr-search').value.toLowerCase() : '';
    var sf = document.getElementById('status-filter') ? document.getElementById('status-filter').value : '';
    if (typeof renderTable === 'function') { renderTable(); return; }
    document.querySelectorAll('.candidate-row').forEach(function (r) {
        r.style.display = ((!q || r.textContent.toLowerCase().indexOf(q) >= 0) && (!sf || r.getAttribute('data-status') === sf)) ? '' : 'none';
    });
}


// ---- COMPANY: POST JOB ----

function postJob() {
    var title = document.getElementById('new-job-title') ? document.getElementById('new-job-title').value.trim() : '';
    var dept = document.getElementById('new-dept') ? document.getElementById('new-dept').value.trim() : 'General';
    var type = document.getElementById('new-type') ? document.getElementById('new-type').value : 'Full-time';
    var sk = document.getElementById('new-skills') ? document.getElementById('new-skills').value : '';
    if (!title) { alert('Please enter a job title.'); return; }
    var list = document.getElementById('posted-jobs'); if (!list) return;
    var badges = sk.split(',').map(function (s) { s = s.trim(); return s ? '<span class="skill-badge">' + s + '</span>' : ''; }).join(' ');
    var card = document.createElement('div'); card.className = 'job-card';
    card.innerHTML =
        '<div class="d-flex justify-content-between align-items-start"><div><h6 style="font-weight:700;margin-bottom:4px">' + title + '</h6>' +
        '<span class="job-tag">' + dept + '</span> <span class="job-tag">' + type + '</span></div>' +
        '<span class="status-badge status-new">Open</span></div>' + (badges ? '<div class="mt-2">' + badges + '</div>' : '');
    list.prepend(card);
    ['new-job-title', 'new-dept', 'new-skills'].forEach(function (id) { var e = document.getElementById(id); if (e) e.value = ''; });
    var m = bootstrap.Modal.getInstance(document.getElementById('postJobModal')); if (m) m.hide();
}


// ---- LISTEN & INIT ----

function listenToFields() {
    document.querySelectorAll('.form-panel input, .form-panel textarea, .form-panel select').forEach(function (f) {
        f.removeEventListener('input', updatePreview); f.addEventListener('input', updatePreview);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setupSkillInput(); listenToFields(); loadSavedData(); updatePreview();
});

var candidates = [
    { name: 'Ananya Sharma', role: 'Software Engineer', skills: ['Python', 'ML', 'SQL'], exp: '2 yrs', status: 'new', email: 'ananya@email.com', summary: 'B.Tech CSE graduate passionate about ML.' },
    { name: 'Rohan Verma', role: 'Frontend Developer', skills: ['React', 'JavaScript', 'CSS'], exp: '3 yrs', status: 'shortlisted', email: 'rohan@email.com', summary: 'Frontend dev with strong UI/UX focus.' },
    { name: 'Priya Nair', role: 'Backend Engineer', skills: ['Java', 'Spring', 'Docker'], exp: '4 yrs', status: 'review', email: 'priya@email.com', summary: 'Senior backend engineer for microservices.' },
    { name: 'Arjun Mehta', role: 'UI/UX Designer', skills: ['Figma', 'HTML', 'CSS'], exp: '1 yr', status: 'new', email: 'arjun@email.com', summary: 'Creative designer bridging design and code.' },
    { name: 'Sneha Patel', role: 'Data Analyst', skills: ['Tableau', 'SQL', 'Excel'], exp: '2 yrs', status: 'shortlisted', email: 'sneha@email.com', summary: 'Skilled in dashboarding and BI.' },
    { name: 'Vikram Singh', role: 'DevOps Engineer', skills: ['Docker', 'AWS', 'CI/CD'], exp: '5 yrs', status: 'review', email: 'vikram@email.com', summary: 'Deep cloud and containerization expertise.' },
    { name: 'Meera Krishnan', role: 'Software Engineer', skills: ['Python', 'Django', 'REST'], exp: '2 yrs', status: 'new', email: 'meera@email.com', summary: 'Full-stack Python developer.' },
    { name: 'Rahul Bose', role: 'Backend Developer', skills: ['Node.js', 'MongoDB'], exp: '3 yrs', status: 'shortlisted', email: 'rahul@email.com', summary: 'Backend dev with strong Node.js expertise.' },
    { name: 'Kavya Reddy', role: 'Frontend Developer', skills: ['Vue.js', 'GraphQL'], exp: '2 yrs', status: 'review', email: 'kavya@email.com', summary: 'Builds responsive, interactive web apps.' },
    { name: 'Aditya Joshi', role: 'Data Scientist', skills: ['ML', 'TensorFlow', 'Python'], exp: '3 yrs', status: 'rejected', email: 'aditya@email.com', summary: 'Specializes in predictive modeling.' }
];

var statusMap = {};
for (var i = 0; i < candidates.length; i++) statusMap[i] = candidates[i].status;

var statusInfo = {
    new: { cls: 'status-new', label: 'New' }, review: { cls: 'status-review', label: 'Under Review' },
    shortlisted: { cls: 'status-shortlisted', label: 'Shortlisted' }, rejected: { cls: 'status-rejected', label: 'Rejected' }
};

var jobs = [
    { title: 'Frontend Developer', dept: 'Engineering', type: 'Full-time', skills: ['React', 'JavaScript', 'CSS'] },
    { title: 'Data Scientist', dept: 'Analytics', type: 'Full-time', skills: ['Python', 'ML', 'SQL'] },
    { title: 'DevOps Engineer', dept: 'Infra', type: 'Full-time', skills: ['Docker', 'AWS', 'CI/CD'] },
    { title: 'UI/UX Designer', dept: 'Design', type: 'Contract', skills: ['Figma', 'HTML'] }
];

// ---- HR: render table ----
function renderTable() {
    var q = document.getElementById('hr-search').value.toLowerCase();
    var sf = document.getElementById('status-filter').value;
    var tbody = document.getElementById('candidate-tbody');
    tbody.innerHTML = '';
    for (var i = 0; i < candidates.length; i++) {
        var c = candidates[i]; var st = statusMap[i];
        if (sf && st !== sf) continue;
        if (q && c.name.toLowerCase().indexOf(q) < 0 && c.role.toLowerCase().indexOf(q) < 0) continue;
        var ini = c.name.split(' ').map(function (p) { return p[0]; }).join('');
        var skillsH = c.skills.map(function (s) { return '<span class="skill-badge">' + s + '</span>'; }).join('');
        var opts = ['new', 'review', 'shortlisted', 'rejected'].map(function (o) {
            return '<option value="' + o + '"' + (st === o ? ' selected' : '') + '>' + statusInfo[o].label + '</option>';
        }).join('');
        var row = document.createElement('tr');
        row.innerHTML =
            '<td><div class="d-flex align-items-center gap-2"><div class="avatar">' + ini + '</div><div><div style="font-weight:600;font-size:0.86rem">' + c.name + '</div><div style="font-size:0.74rem;color:#6c757d">' + c.email + '</div></div></div></td>' +
            '<td style="font-size:0.86rem">' + c.role + '</td>' +
            '<td>' + skillsH + '</td>' +
            '<td><select class="form-select form-select-sm" style="width:auto;font-size:0.78rem" onchange="statusMap[' + i + ']=this.value">' + opts + '</select></td>' +
            '<td><button class="btn-red" style="padding:4px 10px;font-size:0.76rem" onclick="viewResume(' + i + ')">View</button></td>';
        tbody.appendChild(row);
    }
}

function filterCandidates() { renderTable(); }

function viewResume(i) {
    var c = candidates[i];
    document.getElementById('modal-name').textContent = c.name;
    document.getElementById('modal-fullname').textContent = c.name;
    document.getElementById('modal-role').textContent = c.role;
    document.getElementById('modal-contact').innerHTML = '✉ ' + c.email + '  |  ' + c.exp + ' exp';
    document.getElementById('modal-summary').textContent = c.summary;
    document.getElementById('modal-skills').innerHTML = c.skills.map(function (s) { return '<span class="preview-skill-tag">' + s + '</span>'; }).join('');
    new bootstrap.Modal(document.getElementById('resumeModal')).show();
}

// ---- Company: render jobs ----
function renderJobs() {
    var el = document.getElementById('posted-jobs'); el.innerHTML = '';
    for (var j = 0; j < jobs.length; j++) {
        var jb = jobs[j];
        var skillH = jb.skills.map(function (s) { return '<span class="skill-badge">' + s + '</span>'; }).join(' ');
        el.innerHTML +=
            '<div class="job-card">' +
            '<div class="d-flex justify-content-between align-items-start">' +
            '<div><h6 style="font-weight:700;margin-bottom:4px">' + jb.title + '</h6>' +
            '<span class="job-tag">' + jb.dept + '</span> <span class="job-tag">' + jb.type + '</span></div>' +
            '<span class="status-badge status-new">Open</span>' +
            '</div>' +
            '<div class="mt-2">' + skillH + '</div>' +
            '</div>';
    }
}

function postJob() {
    var t = document.getElementById('new-job-title').value.trim();
    if (!t) { alert('Please enter a job title.'); return; }
    var sk = document.getElementById('new-skills').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    jobs.push({ title: t, dept: document.getElementById('new-dept').value || 'General', type: document.getElementById('new-type').value, skills: sk });
    renderJobs();
    bootstrap.Modal.getInstance(document.getElementById('postJobModal')).hide();
    document.getElementById('new-job-title').value = ''; document.getElementById('new-dept').value = ''; document.getElementById('new-skills').value = '';
}

// ---- Recent applicants ----
function renderApplicants() {
    var el = document.getElementById('applicants-list'); el.innerHTML = '';
    for (var i = 0; i < 6; i++) {
        var c = candidates[i]; var ini = c.name.split(' ').map(function (p) { return p[0]; }).join('');
        var cls = statusInfo[statusMap[i]].cls;
        el.innerHTML += '<div class="d-flex align-items-center justify-content-between p-3 border-bottom">' +
            '<div class="d-flex align-items-center gap-2"><div class="avatar">' + ini + '</div>' +
            '<div><div style="font-weight:600;font-size:0.85rem">' + c.name + '</div><div style="font-size:0.74rem;color:#6c757d">' + c.role + '</div></div></div>' +
            '<span class="status-badge ' + cls + '">' + statusInfo[statusMap[i]].label + '</span></div>';
    }
}

// ---- Tab toggle ----
function showPanel(which, btn) {
    document.querySelectorAll('.tab-toggle button').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.querySelectorAll('.section-panel').forEach(function (p) { p.classList.remove('active'); });
    document.getElementById('panel-' + which).classList.add('active');
    if (which === 'hr') {
        document.getElementById('panel-title').textContent = 'HR Dashboard';
        document.getElementById('panel-sub').textContent = 'Review candidates and manage the hiring pipeline';
        document.getElementById('role-label').textContent = 'HR Team'; document.getElementById('role-label').style.background = '#f5a623';
    } else {
        document.getElementById('panel-title').textContent = 'Company Panel';
        document.getElementById('panel-sub').textContent = 'Post jobs and track applicants';
        document.getElementById('role-label').textContent = 'Company'; document.getElementById('role-label').style.background = '#0f3460';
        renderApplicants();
    }
}

// Init
renderTable();
renderJobs();