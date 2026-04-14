// ============================================================
//  ResumeForge — script.js   (full rebuild)
// ============================================================

// ---- ENTRY TEMPLATES ----

function educationTemplate() {
  return '<div class="d-flex justify-content-between align-items-center mb-2">' +
    '<small class="fw-semibold text-secondary">Education Entry</small>' +
    '<button class="rf-btn-remove" onclick="removeEntry(this)">&#10005;</button>' +
    '</div>' +
    '<div class="row g-2">' +
    '<div class="col-12"><input class="form-control form-control-sm" name="degree" placeholder="Degree (e.g. B.Tech in CSE)" oninput="updatePreview()"></div>' +
    '<div class="col-12"><input class="form-control form-control-sm" name="college" placeholder="College / University name" oninput="updatePreview()"></div>' +
    '<div class="col-6"><input class="form-control form-control-sm" name="edu-year" placeholder="Year (e.g. 2020-2024)" oninput="updatePreview()"></div>' +
    '<div class="col-6"><input class="form-control form-control-sm" name="cgpa" placeholder="CGPA or %" oninput="updatePreview()"></div>' +
    '</div>';
}

function experienceTemplate() {
  return '<div class="d-flex justify-content-between align-items-center mb-2">' +
    '<small class="fw-semibold text-secondary">Experience Entry</small>' +
    '<button class="rf-btn-remove" onclick="removeEntry(this)">&#10005;</button>' +
    '</div>' +
    '<div class="row g-2">' +
    '<div class="col-12"><input class="form-control form-control-sm" name="role" placeholder="Job Role / Title" oninput="updatePreview()"></div>' +
    '<div class="col-8"><input class="form-control form-control-sm" name="company" placeholder="Company Name" oninput="updatePreview()"></div>' +
    '<div class="col-4"><input class="form-control form-control-sm" name="duration" placeholder="2022-2023" oninput="updatePreview()"></div>' +
    '<div class="col-12"><textarea class="form-control form-control-sm" name="exp-desc" rows="2" placeholder="What did you do here?" oninput="updatePreview()"></textarea></div>' +
    '</div>';
}

function projectTemplate() {
  return '<div class="d-flex justify-content-between align-items-center mb-2">' +
    '<small class="fw-semibold text-secondary">Project Entry</small>' +
    '<button class="rf-btn-remove" onclick="removeEntry(this)">&#10005;</button>' +
    '</div>' +
    '<div class="row g-2">' +
    '<div class="col-8"><input class="form-control form-control-sm" name="project-name" placeholder="Project Name" oninput="updatePreview()"></div>' +
    '<div class="col-4"><input class="form-control form-control-sm" name="tech-stack" placeholder="Tech Used" oninput="updatePreview()"></div>' +
    '<div class="col-12"><textarea class="form-control form-control-sm" name="project-desc" rows="2" placeholder="Describe the project briefly" oninput="updatePreview()"></textarea></div>' +
    '</div>';
}

function achievementTemplate() {
  return '<div class="d-flex justify-content-between align-items-center mb-2">' +
    '<small class="fw-semibold text-secondary">Achievement / Certification</small>' +
    '<button class="rf-btn-remove" onclick="removeEntry(this)">&#10005;</button>' +
    '</div>' +
    '<div class="col-12 mt-1"><input class="form-control form-control-sm" name="achievement" placeholder="e.g. Won Hackathon 2024, AWS Certified..." oninput="updatePreview()"></div>';
}

function referenceTemplate() {
  return '<div class="d-flex justify-content-between align-items-center mb-2">' +
    '<small class="fw-semibold text-secondary">Reference</small>' +
    '<button class="rf-btn-remove" onclick="removeEntry(this)">&#10005;</button>' +
    '</div>' +
    '<div class="row g-2">' +
    '<div class="col-12"><input class="form-control form-control-sm" name="ref-name" placeholder="Reference Name" oninput="updatePreview()"></div>' +
    '<div class="col-7"><input class="form-control form-control-sm" name="ref-pos" placeholder="Their Designation & Company" oninput="updatePreview()"></div>' +
    '<div class="col-5"><input class="form-control form-control-sm" name="ref-contact" placeholder="Email / Phone" oninput="updatePreview()"></div>' +
    '</div>';
}

// ---- ENTRY ADD / REMOVE ----

function addEntry(containerId, templateFn) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var block = document.createElement('div');
  block.className = 'rf-entry-block mb-2 p-3 bg-light border rounded';
  block.innerHTML = templateFn();
  container.appendChild(block);
}

function removeEntry(btn) {
  var block = btn.closest('.rf-entry-block');
  if (block) {
    block.remove();
    updatePreview();
    autoSave();
  }
}

// ---- SKILL TAG INPUT ----

var skills = [];

function setupSkillInput() {
  var box   = document.getElementById('skill-input-box');
  var input = document.getElementById('skill-input');
  if (!box || !input) return;

  box.addEventListener('click', function() { input.focus(); });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      var val = input.value.replace(',', '').trim();
      if (val) { addSkillTag(val); input.value = ''; }
    } else if (e.key === 'Backspace' && input.value === '' && skills.length > 0) {
      removeSkillTag(skills[skills.length - 1]);
    }
  });
}

function addSkillTag(skill) {
  skill = skill.trim();
  if (!skill || skills.indexOf(skill) !== -1) return;
  skills.push(skill);

  var box   = document.getElementById('skill-input-box');
  var input = document.getElementById('skill-input');
  if (!box) return;

  var tag = document.createElement('span');
  tag.className = 'rf-skill-tag';
  tag.dataset.skill = skill;
  tag.innerHTML = skill + ' <span onclick="removeSkillTag(\'' + skill.replace(/'/g, "\\'") + '\')">&#10005;</span>';
  box.insertBefore(tag, input);
  updatePreview();
  autoSave();
}

function removeSkillTag(skill) {
  skills = skills.filter(function(s) { return s !== skill; });
  var tag = document.querySelector('.rf-skill-tag[data-skill="' + skill + '"]');
  if (tag) tag.remove();
  updatePreview();
  autoSave();
}

// ---- LIVE PREVIEW ----

function updatePreview() {
  var v = function(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  // Name & title
  var nameEl = document.getElementById('prev-name');
  if (nameEl) nameEl.textContent = v('full-name') || 'Your Name';

  var titleEl = document.getElementById('prev-title');
  if (titleEl) titleEl.textContent = v('job-title') || 'Professional Title';

  // Contact line
  var contactEl = document.getElementById('prev-contact');
  if (contactEl) {
    var parts = [];
    if (v('email'))    parts.push(v('email'));
    if (v('phone'))    parts.push(v('phone'));
    if (v('location')) parts.push(v('location'));
    if (v('linkedin')) parts.push(v('linkedin'));
    contactEl.innerHTML = parts.map(function(p) {
      return '<span>' + escHtml(p) + '</span>';
    }).join('');
  }

  // Summary
  var sumEl = document.getElementById('prev-summary');
  if (sumEl) {
    sumEl.innerHTML = v('summary')
      ? escHtml(v('summary'))
      : '<em class="text-black-50">Your summary will appear here...</em>';
  }

  // Education
  renderSection('education-entries', 'prev-education', function(block) {
    var degree  = getField(block, 'degree');
    var college = getField(block, 'college');
    var year    = getField(block, 'edu-year');
    var cgpa    = getField(block, 'cgpa');
    if (!degree && !college) return '';
    return '<div class="rf-prev-entry mb-2">' +
      '<div class="d-flex justify-content-between">' +
      '<span class="rf-prev-title">' + escHtml(degree) + '</span>' +
      '<span class="rf-prev-date">' + escHtml(year)   + '</span>' +
      '</div>' +
      '<div class="rf-prev-sub">' + escHtml(college) + (cgpa ? ' &middot; ' + escHtml(cgpa) : '') + '</div>' +
      '</div>';
  }, '<em class="text-black-50">Add education from the form...</em>');

  // Experience
  renderSection('experience-entries', 'prev-experience', function(block) {
    var role    = getField(block, 'role');
    var company = getField(block, 'company');
    var dur     = getField(block, 'duration');
    var desc    = getField(block, 'exp-desc');
    if (!role && !company) return '';
    return '<div class="rf-prev-entry mb-2">' +
      '<div class="d-flex justify-content-between">' +
      '<span class="rf-prev-title">' + escHtml(role) + '</span>' +
      '<span class="rf-prev-date">'  + escHtml(dur)  + '</span>' +
      '</div>' +
      '<div class="rf-prev-sub">'  + escHtml(company) + '</div>' +
      (desc ? '<div class="rf-prev-desc">' + escHtml(desc) + '</div>' : '') +
      '</div>';
  }, '<em class="text-black-50">Add work experience from the form...</em>');

  // Skills
  var skillsEl = document.getElementById('prev-skills');
  if (skillsEl) {
    if (skills.length === 0) {
      skillsEl.innerHTML = '<em class="text-black-50">Add skills from the Skills tab...</em>';
    } else {
      skillsEl.innerHTML = skills.map(function(s) {
        return '<span class="rf-prev-skill">' + escHtml(s) + '</span>';
      }).join('');
    }
  }

  // Projects
  renderSection('project-entries', 'prev-projects', function(block) {
    var name  = getField(block, 'project-name');
    var tech  = getField(block, 'tech-stack');
    var desc  = getField(block, 'project-desc');
    if (!name) return '';
    return '<div class="rf-prev-entry mb-2">' +
      '<div class="d-flex justify-content-between">' +
      '<span class="rf-prev-title">' + escHtml(name) + '</span>' +
      '<span class="rf-prev-date">'  + escHtml(tech) + '</span>' +
      '</div>' +
      (desc ? '<div class="rf-prev-desc">' + escHtml(desc) + '</div>' : '') +
      '</div>';
  }, '<em class="text-black-50">Add projects from the form...</em>');

  // Achievements
  renderSection('achievement-entries', 'prev-achievements', function(block) {
    var text = getField(block, 'achievement');
    if (!text) return '';
    return '<div class="rf-prev-entry mb-1">&#8226; ' + escHtml(text) + '</div>';
  }, '<em class="text-black-50">Add achievements and certifications...</em>');

  // References
  renderSection('reference-entries', 'prev-references', function(block) {
    var name    = getField(block, 'ref-name');
    var pos     = getField(block, 'ref-pos');
    var contact = getField(block, 'ref-contact');
    if (!name) return '';
    return '<div class="rf-prev-entry mb-2">' +
      '<span class="rf-prev-title">' + escHtml(name) + '</span>' +
      (pos     ? '<div class="rf-prev-sub">'  + escHtml(pos)     + '</div>' : '') +
      (contact ? '<div class="rf-prev-desc">' + escHtml(contact) + '</div>' : '') +
      '</div>';
  }, '<em class="text-black-50">Add references here (optional)...</em>');

  autoSave();
}

function renderSection(containerId, previewId, renderFn, emptyHtml) {
  var container = document.getElementById(containerId);
  var preview   = document.getElementById(previewId);
  if (!container || !preview) return;
  var blocks = container.querySelectorAll('.rf-entry-block');
  var html = '';
  for (var i = 0; i < blocks.length; i++) {
    html += renderFn(blocks[i]);
  }
  preview.innerHTML = html || emptyHtml;
}

function getField(block, name) {
  var el = block.querySelector('[name="' + name + '"]');
  return el ? el.value.trim() : '';
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/\n/g, '<br>');
}

// ---- AUTO-SAVE ----

function listenToFields() {
  var fields = document.querySelectorAll('#tab-personal input, #tab-personal textarea');
  for (var i = 0; i < fields.length; i++) {
    fields[i].addEventListener('input', autoSave);
  }
}

function autoSave() {
  var getData = function(containerId, fieldNames) {
    var blocks = document.querySelectorAll('#' + containerId + ' .rf-entry-block');
    var arr = [];
    for (var i = 0; i < blocks.length; i++) {
      var obj = {};
      for (var k = 0; k < fieldNames.length; k++) {
        var el = blocks[i].querySelector('[name="' + fieldNames[k] + '"]');
        if (el) obj[fieldNames[k]] = el.value;
      }
      arr.push(obj);
    }
    return arr;
  };

  var data = {
    name:         (document.getElementById('full-name')  || {}).value || '',
    title:        (document.getElementById('job-title')  || {}).value || '',
    email:        (document.getElementById('email')      || {}).value || '',
    phone:        (document.getElementById('phone')      || {}).value || '',
    location:     (document.getElementById('location')   || {}).value || '',
    linkedin:     (document.getElementById('linkedin')   || {}).value || '',
    summary:      (document.getElementById('summary')    || {}).value || '',
    skills:       skills.slice(),
    education:    getData('education-entries',   ['degree','college','edu-year','cgpa']),
    experience:   getData('experience-entries',  ['role','company','duration','exp-desc']),
    projects:     getData('project-entries',     ['project-name','tech-stack','project-desc']),
    achievements: getData('achievement-entries', ['achievement']),
    references:   getData('reference-entries',   ['ref-name','ref-pos','ref-contact'])
  };

  localStorage.setItem('resumeData', JSON.stringify(data));

  // Flash "Saved" indicator
  var ind = document.getElementById('save-indicator');
  if (ind) {
    ind.style.opacity = '1';
    clearTimeout(ind._timer);
    ind._timer = setTimeout(function() { ind.style.opacity = '0'; }, 1800);
  }
}

// ---- LOAD SAVED DATA ----

function loadSavedData() {
  var stored = localStorage.getItem('resumeData');
  if (!stored) return;
  var data;
  try { data = JSON.parse(stored); } catch(e) { return; }

  function setVal(id, val) {
    var el = document.getElementById(id);
    if (el && val) el.value = val;
  }

  setVal('full-name', data.name);
  setVal('job-title', data.title);
  setVal('email',     data.email);
  setVal('phone',     data.phone);
  setVal('location',  data.location);
  setVal('linkedin',  data.linkedin);
  setVal('summary',   data.summary);

  if (data.skills) {
    for (var i = 0; i < data.skills.length; i++) addSkillTag(data.skills[i]);
  }

  function restoreEntries(containerId, templateFn, items, fieldNames) {
    var container = document.getElementById(containerId);
    if (!container || !items) return;
    for (var j = 0; j < items.length; j++) {
      var block = document.createElement('div');
      block.className = 'rf-entry-block mb-2 p-3 bg-light border rounded';
      block.innerHTML = templateFn();
      container.appendChild(block);
      for (var k = 0; k < fieldNames.length; k++) {
        var el = block.querySelector('[name="' + fieldNames[k] + '"]');
        if (el && items[j][fieldNames[k]]) el.value = items[j][fieldNames[k]];
      }
    }
  }

  restoreEntries('education-entries',   educationTemplate,   data.education,    ['degree','college','edu-year','cgpa']);
  restoreEntries('experience-entries',  experienceTemplate,  data.experience,   ['role','company','duration','exp-desc']);
  restoreEntries('project-entries',     projectTemplate,     data.projects,     ['project-name','tech-stack','project-desc']);
  restoreEntries('achievement-entries', achievementTemplate, data.achievements, ['achievement']);
  restoreEntries('reference-entries',   referenceTemplate,   data.references,   ['ref-name','ref-pos','ref-contact']);

  listenToFields();
  updatePreview();
}

function clearAllData() {
  if (confirm('Are you sure? All your resume data will be deleted.')) {
    localStorage.removeItem('resumeData');
    location.reload();
  }
}

// ---- PDF DOWNLOAD ----

function downloadPDF() {
  var btn = document.getElementById('download-btn');
  if (btn) { btn.textContent = 'Generating...'; btn.disabled = true; }

  setTimeout(function() {
    var resumeDiv = document.getElementById('resume-preview');
    if (!resumeDiv) {
      if (btn) { btn.textContent = '↓ Download PDF'; btn.disabled = false; }
      return;
    }
    var nameField = document.getElementById('full-name');
    var filename  = (nameField && nameField.value) ? nameField.value : 'resume';

    var options = {
      margin: 0,
      filename: filename + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (typeof html2pdf !== 'undefined') {
      html2pdf().set(options).from(resumeDiv).save().then(function() {
        if (btn) { btn.textContent = '↓ Download PDF'; btn.disabled = false; }
      });
    } else {
      window.print();
      if (btn) { btn.textContent = '↓ Download PDF'; btn.disabled = false; }
    }
  }, 100);
}

// ---- TEMPLATE SWITCHING ----

function selectTemplate(templateId, clickedCard) {
  document.querySelectorAll('.template-card').forEach(function(c) {
    c.classList.remove('selected');
  });
  clickedCard.closest('.template-card').classList.add('selected');
  applyTemplate(templateId);
  var modal = bootstrap.Modal.getInstance(document.getElementById('templateModal'));
  if (modal) modal.hide();
}

function applyTemplate(templateId) {
  var preview = document.getElementById('resume-preview');
  if (!preview) return;
  var header = preview.querySelector('.rf-prev-header');
  if (!header) return;

  var templates = {
    modern:    { bg: '#1a1a2e', accent: '#e94560' },
    minimal:   { bg: '#2d2d2d', accent: '#888888' },
    executive: { bg: '#0f3460', accent: '#f5a623' },
    creative:  { bg: '#6c35de', accent: '#ff6b6b' }
  };

  var t = templates[templateId] || templates.modern;
  header.style.backgroundColor = t.bg;

  document.querySelectorAll('.rf-section-title').forEach(function(el) {
    el.style.borderColor = t.accent;
  });
  var titleEl = document.querySelector('.rf-prev-job-title');
  if (titleEl) titleEl.style.color = t.accent;
}

// ---- INIT ----

document.addEventListener('DOMContentLoaded', function() {
  setupSkillInput();
  listenToFields();
  loadSavedData();
  updatePreview();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});