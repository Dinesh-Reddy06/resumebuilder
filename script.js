// =============================================
// script.js - ResumeForge main JavaScript file
// =============================================
// This file handles:
//   1. Live resume preview updates
//   2. Adding/removing form entries
//   3. Skill tag input
//   4. Auto save and load from localStorage
//   5. PDF download
//   6. Template switching
//   7. HR dashboard filters
//   8. Company page - post job and match candidates
// =============================================


// ---- PART 1: LIVE PREVIEW ----
// Called every time user types in any field

function updatePreview() {

  // Read a field value by its id
  function val(id) {
    var el = document.getElementById(id);
    if (el) return el.value;
    return '';
  }

  // Show name in preview (or placeholder if empty)
  var name = val('full-name') || 'Your Name';
  var jobTitle = val('job-title') || 'Professional Title';

  var nameEl = document.getElementById('prev-name');
  if (nameEl) nameEl.textContent = name;

  var titleEl = document.getElementById('prev-title');
  if (titleEl) titleEl.textContent = jobTitle;

  // Build contact info line
  var contactHTML = '';
  if (val('email'))    contactHTML += '<span>&#9993; ' + val('email') + '</span>';
  if (val('phone'))    contactHTML += '<span>&#128222; ' + val('phone') + '</span>';
  if (val('location')) contactHTML += '<span>&#128205; ' + val('location') + '</span>';
  if (val('linkedin')) contactHTML += '<span>&#128279; ' + val('linkedin') + '</span>';

  var contactEl = document.getElementById('prev-contact');
  if (contactEl) contactEl.innerHTML = contactHTML;

  // Summary
  var summaryEl = document.getElementById('prev-summary');
  if (summaryEl) {
    summaryEl.innerHTML = val('summary') || '<em style="color:#aaa">Your summary will appear here...</em>';
  }

  // Education section
  buildSectionPreview('education-entries', 'prev-education', buildEducationHTML);

  // Experience section
  buildSectionPreview('experience-entries', 'prev-experience', buildExperienceHTML);

  // Projects section
  buildSectionPreview('project-entries', 'prev-projects', buildProjectHTML);

  // Achievements section
  buildSectionPreview('achievement-entries', 'prev-achievements', buildAchievementHTML);

  // References section
  buildSectionPreview('reference-entries', 'prev-references', buildReferenceHTML);

  // Skills - read all skill tags
  var allSkillTags = document.querySelectorAll('.skill-tag');
  var skillsHTML = '';
  for (var i = 0; i < allSkillTags.length; i++) {
    var skillName = allSkillTags[i].getAttribute('data-skill');
    skillsHTML += '<span class="preview-skill-tag">' + skillName + '</span>';
  }
  var skillsEl = document.getElementById('prev-skills');
  if (skillsEl) {
    skillsEl.innerHTML = skillsHTML || '<em style="color:#aaa">Add skills above...</em>';
  }

  // Save after every update
  autoSave();
}

// Loops through all entry blocks and renders preview HTML
function buildSectionPreview(formContainerId, previewId, buildFn) {
  var container = document.getElementById(formContainerId);
  var preview = document.getElementById(previewId);
  if (!container || !preview) return;

  var blocks = container.querySelectorAll('.entry-block');
  var html = '';
  for (var i = 0; i < blocks.length; i++) {
    html += buildFn(blocks[i]);
  }
  preview.innerHTML = html || '<em style="color:#aaa">Nothing added yet...</em>';
}

// Build preview HTML for one education block
function buildEducationHTML(block) {
  var degree  = getField(block, 'degree');
  var college = getField(block, 'college');
  var year    = getField(block, 'edu-year');
  var cgpa    = getField(block, 'cgpa');

  if (!degree && !college) return '';

  var html = '<div class="preview-entry">';
  html += '<span class="preview-entry-title">' + degree + '</span>';
  html += '<span class="preview-entry-date">' + year + '</span>';
  html += '<div class="preview-entry-sub">' + college;
  if (cgpa) html += ' &nbsp;&middot;&nbsp; CGPA: ' + cgpa;
  html += '</div>';
  html += '</div>';
  return html;
}

// Build preview HTML for one experience block
function buildExperienceHTML(block) {
  var role     = getField(block, 'role');
  var company  = getField(block, 'company');
  var duration = getField(block, 'duration');
  var desc     = getField(block, 'exp-desc');

  if (!role && !company) return '';

  var html = '<div class="preview-entry">';
  html += '<span class="preview-entry-title">' + role + '</span>';
  html += '<span class="preview-entry-date">' + duration + '</span>';
  html += '<div class="preview-entry-sub">' + company + '</div>';
  if (desc) html += '<div class="preview-entry-desc">' + desc.replace(/\n/g, '<br>') + '</div>';
  html += '</div>';
  return html;
}

// Build preview HTML for one project block
function buildProjectHTML(block) {
  var pname = getField(block, 'project-name');
  var tech  = getField(block, 'tech-stack');
  var pdesc = getField(block, 'project-desc');

  if (!pname) return '';

  var html = '<div class="preview-entry">';
  html += '<span class="preview-entry-title">' + pname + '</span>';
  if (tech) html += '<span class="preview-entry-date">' + tech + '</span>';
  if (pdesc) html += '<div class="preview-entry-desc">' + pdesc + '</div>';
  html += '</div>';
  return html;
}

// Build preview HTML for one achievement
function buildAchievementHTML(block) {
  var text = getField(block, 'achievement');
  if (!text) return '';
  return '<div class="preview-entry"><div class="preview-entry-desc">&#9642; ' + text + '</div></div>';
}

// Build preview HTML for one reference
function buildReferenceHTML(block) {
  var rname    = getField(block, 'ref-name');
  var rpos     = getField(block, 'ref-pos');
  var rcontact = getField(block, 'ref-contact');

  if (!rname) return '';

  var html = '<div class="preview-entry">';
  html += '<div class="preview-entry-title">' + rname + '</div>';
  html += '<div class="preview-entry-sub">' + rpos + '</div>';
  html += '<div style="font-size:0.76rem; color:#666">' + rcontact + '</div>';
  html += '</div>';
  return html;
}

// Helper: get value of a named field inside a block
function getField(block, fieldName) {
  var el = block.querySelector('[name="' + fieldName + '"]');
  if (el) return el.value;
  return '';
}


// ---- PART 2: ADD/REMOVE FORM ENTRIES ----

function addEntry(containerId, templateFn) {
  var container = document.getElementById(containerId);
  if (!container) return;

  // Create a new div and fill it with the template HTML
  var newBlock = document.createElement('div');
  newBlock.className = 'entry-block';
  newBlock.innerHTML = templateFn();
  container.appendChild(newBlock);

  // Make sure new inputs also trigger live preview
  listenToFields();
  updatePreview();
}

function removeEntry(btn) {
  // btn is inside .entry-block, go up to find it and remove
  var block = btn.closest('.entry-block');
  if (block) {
    block.remove();
    updatePreview();
  }
}

// HTML template for one education entry
function educationTemplate() {
  return '<div class="d-flex justify-content-between align-items-center mb-2">' +
    '<small style="font-weight:600; color:#999">Education Entry</small>' +
    '<button class="btn-remove-entry" onclick="removeEntry(this)">&#10005;</button>' +
    '</div>' +
    '<div class="row g-2">' +
    '<div class="col-12"><input class="form-control" name="degree" placeholder="Degree (e.g. B.Tech in CSE)" oninput="updatePreview()"></div>' +
    '<div class="col-12"><input class="form-control" name="college" placeholder="College / University name" oninput="updatePreview()"></div>' +
    '<div class="col-6"><input class="form-control" name="edu-year" placeholder="Year (e.g. 2020-2024)" oninput="updatePreview()"></div>' +
    '<div class="col-6"><input class="form-control" name="cgpa" placeholder="CGPA or %" oninput="updatePreview()"></div>' +
    '</div>';
}

// HTML template for one experience entry
function experienceTemplate() {
  return '<div class="d-flex justify-content-between align-items-center mb-2">' +
    '<small style="font-weight:600; color:#999">Experience Entry</small>' +
    '<button class="btn-remove-entry" onclick="removeEntry(this)">&#10005;</button>' +
    '</div>' +
    '<div class="row g-2">' +
    '<div class="col-12"><input class="form-control" name="role" placeholder="Job Role / Title" oninput="updatePreview()"></div>' +
    '<div class="col-8"><input class="form-control" name="company" placeholder="Company Name" oninput="updatePreview()"></div>' +
    '<div class="col-4"><input class="form-control" name="duration" placeholder="2022-2023" oninput="updatePreview()"></div>' +
    '<div class="col-12"><textarea class="form-control" name="exp-desc" rows="2" placeholder="What did you do here?" oninput="updatePreview()"></textarea></div>' +
    '</div>';
}

// HTML template for one project entry
function projectTemplate() {
  return '<div class="d-flex justify-content-between align-items-center mb-2">' +
    '<small style="font-weight:600; color:#999">Project Entry</small>' +
    '<button class="btn-remove-entry" onclick="removeEntry(this)">&#10005;</button>' +
    '</div>' +
    '<div class="row g-2">' +
    '<div class="col-8"><input class="form-control" name="project-name" placeholder="Project Name" oninput="updatePreview()"></div>' +
    '<div class="col-4"><input class="form-control" name="tech-stack" placeholder="Tech Used" oninput="updatePreview()"></div>' +
    '<div class="col-12"><textarea class="form-control" name="project-desc" rows="2" placeholder="Describe the project briefly" oninput="updatePreview()"></textarea></div>' +
    '</div>';
}

// HTML template for one achievement entry
function achievementTemplate() {
  return '<div class="d-flex justify-content-between align-items-center mb-2">' +
    '<small style="font-weight:600; color:#999">Achievement / Certification</small>' +
    '<button class="btn-remove-entry" onclick="removeEntry(this)">&#10005;</button>' +
    '</div>' +
    '<div class="col-12 mt-1"><input class="form-control" name="achievement" placeholder="e.g. Won Hackathon 2024, AWS Certified..." oninput="updatePreview()"></div>';
}

// HTML template for one reference entry
function referenceTemplate() {
  return '<div class="d-flex justify-content-between align-items-center mb-2">' +
    '<small style="font-weight:600; color:#999">Reference</small>' +
    '<button class="btn-remove-entry" onclick="removeEntry(this)">&#10005;</button>' +
    '</div>' +
    '<div class="row g-2">' +
    '<div class="col-12"><input class="form-control" name="ref-name" placeholder="Reference Name" oninput="updatePreview()"></div>' +
    '<div class="col-7"><input class="form-control" name="ref-pos" placeholder="Their Designation & Company" oninput="updatePreview()"></div>' +
    '<div class="col-5"><input class="form-control" name="ref-contact" placeholder="Email / Phone" oninput="updatePreview()"></div>' +
    '</div>';
}


// ---- PART 3: SKILL TAGS ----

function setupSkillInput() {
  var input = document.getElementById('skill-input');
  if (!input) return;

  // When user presses Enter or comma, add the skill as a tag
  input.addEventListener('keydown', function(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.value.trim() !== '') {
      e.preventDefault();
      var skillText = input.value.trim().replace(/,$/, ''); // remove trailing comma
      addSkillTag(skillText);
      input.value = '';
    }
    // Pressing Backspace on empty input removes the last tag
    if (e.key === 'Backspace' && input.value === '') {
      var tags = document.querySelectorAll('.skill-tag');
      if (tags.length > 0) {
        tags[tags.length - 1].remove();
        updatePreview();
      }
    }
  });

  // Click anywhere in the box to focus the input
  var box = document.getElementById('skill-input-box');
  if (box) {
    box.addEventListener('click', function() {
      input.focus();
    });
  }
}

function addSkillTag(skill) {
  if (!skill) return;

  // Don't add duplicate skills
  var existingTags = document.querySelectorAll('.skill-tag');
  for (var i = 0; i < existingTags.length; i++) {
    if (existingTags[i].getAttribute('data-skill').toLowerCase() === skill.toLowerCase()) {
      return; // already exists
    }
  }

  var box = document.getElementById('skill-input-box');
  var input = document.getElementById('skill-input');
  if (!box || !input) return;

  // Create the tag element
  var tag = document.createElement('div');
  tag.className = 'skill-tag';
  tag.setAttribute('data-skill', skill);
  tag.innerHTML = skill + ' <span onclick="this.parentElement.remove(); updatePreview()">&#10005;</span>';

  // Insert tag before the input field
  box.insertBefore(tag, input);
  updatePreview();
}


// ---- PART 4: AUTO SAVE & LOAD ----

function autoSave() {
  // Only save on the builder page
  if (!document.getElementById('full-name')) return;

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value : '';
  }

  // Collect all skill tag names
  var savedSkills = [];
  var skillTags = document.querySelectorAll('.skill-tag');
  for (var i = 0; i < skillTags.length; i++) {
    savedSkills.push(skillTags[i].getAttribute('data-skill'));
  }

  // Collect all entries from a given section
  function collectEntries(containerId, fieldNames) {
    var results = [];
    var container = document.getElementById(containerId);
    if (!container) return results;
    var blocks = container.querySelectorAll('.entry-block');
    for (var j = 0; j < blocks.length; j++) {
      var obj = {};
      for (var k = 0; k < fieldNames.length; k++) {
        var fieldEl = blocks[j].querySelector('[name="' + fieldNames[k] + '"]');
        if (fieldEl) obj[fieldNames[k]] = fieldEl.value;
      }
      results.push(obj);
    }
    return results;
  }

  // Build the data object to save
  var dataToSave = {
    name:     val('full-name'),
    title:    val('job-title'),
    email:    val('email'),
    phone:    val('phone'),
    location: val('location'),
    linkedin: val('linkedin'),
    summary:  val('summary'),
    skills:   savedSkills,
    education:    collectEntries('education-entries',   ['degree','college','edu-year','cgpa']),
    experience:   collectEntries('experience-entries',  ['role','company','duration','exp-desc']),
    projects:     collectEntries('project-entries',     ['project-name','tech-stack','project-desc']),
    achievements: collectEntries('achievement-entries', ['achievement']),
    references:   collectEntries('reference-entries',   ['ref-name','ref-pos','ref-contact'])
  };

  localStorage.setItem('resumeData', JSON.stringify(dataToSave));

  // Show the "Saved" indicator briefly
  var indicator = document.getElementById('save-indicator');
  if (indicator) {
    indicator.style.opacity = '1';
    clearTimeout(window.saveTimeout);
    window.saveTimeout = setTimeout(function() {
      indicator.style.opacity = '0';
    }, 1800);
  }
}

function loadSavedData() {
  var stored = localStorage.getItem('resumeData');
  if (!stored) return; // nothing saved yet

  var data;
  try {
    data = JSON.parse(stored);
  } catch (e) {
    return; // saved data was corrupted, skip
  }

  function setVal(id, value) {
    var el = document.getElementById(id);
    if (el && value) el.value = value;
  }

  // Restore personal info fields
  setVal('full-name', data.name);
  setVal('job-title', data.title);
  setVal('email',     data.email);
  setVal('phone',     data.phone);
  setVal('location',  data.location);
  setVal('linkedin',  data.linkedin);
  setVal('summary',   data.summary);

  // Restore skill tags
  if (data.skills) {
    for (var i = 0; i < data.skills.length; i++) {
      addSkillTag(data.skills[i]);
    }
  }

  // Restore a section's entries
  function restoreEntries(containerId, templateFn, items, fieldNames) {
    var container = document.getElementById(containerId);
    if (!container || !items) return;
    for (var j = 0; j < items.length; j++) {
      var block = document.createElement('div');
      block.className = 'entry-block';
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


// ---- PART 5: PDF DOWNLOAD ----

function downloadPDF() {
  var btn = document.getElementById('download-btn');
  if (btn) {
    btn.textContent = 'Generating...';
    btn.disabled = true;
  }

  setTimeout(function() {
    var resumeDiv = document.getElementById('resume-preview');
    if (!resumeDiv) {
      if (btn) { btn.textContent = 'Download PDF'; btn.disabled = false; }
      return;
    }

    var nameField = document.getElementById('full-name');
    var filename = (nameField && nameField.value) ? nameField.value : 'resume';

    var options = {
      margin: 0,
      filename: filename + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (typeof html2pdf !== 'undefined') {
      html2pdf().set(options).from(resumeDiv).save().then(function() {
        if (btn) { btn.textContent = 'Download PDF'; btn.disabled = false; }
      });
    } else {
      // Fallback: use print dialog
      window.print();
      if (btn) { btn.textContent = 'Download PDF'; btn.disabled = false; }
    }
  }, 100);
}


// ---- PART 6: TEMPLATE SWITCHING ----

function selectTemplate(templateId, clickedCard) {
  // Remove selected class from all cards
  var allCards = document.querySelectorAll('.template-card');
  for (var i = 0; i < allCards.length; i++) {
    allCards[i].classList.remove('selected');
  }
  // Add selected to the clicked one
  clickedCard.closest('.template-card').classList.add('selected');

  applyTemplate(templateId);

  // Close modal if it's open
  var modal = bootstrap.Modal.getInstance(document.getElementById('templateModal'));
  if (modal) modal.hide();
}

function applyTemplate(templateId) {
  var preview = document.getElementById('resume-preview');
  if (!preview) return;

  var header = preview.querySelector('.preview-header');
  if (!header) return;

  // Each template has its own header color and accent color
  var templates = {
    modern:    { bg: '#1a1a2e', accent: '#e94560' },
    minimal:   { bg: '#2d2d2d', accent: '#888888' },
    executive: { bg: '#0f3460', accent: '#f5a623' },
    creative:  { bg: '#6c35de', accent: '#ff6b6b' }
  };

  var chosen = templates[templateId] || templates.modern;
  header.style.backgroundColor = chosen.bg;

  // Update section title borders to match accent color
  var sectionTitles = document.querySelectorAll('.preview-section-title');
  for (var i = 0; i < sectionTitles.length; i++) {
    sectionTitles[i].style.borderColor = chosen.accent;
  }

  // Update job title color
  var jobTitleEl = document.querySelector('.preview-title');
  if (jobTitleEl) jobTitleEl.style.color = chosen.accent;
}


// ---- PART 7: HR DASHBOARD FILTERS ----

function filterCandidates() {
  var searchText   = document.getElementById('hr-search')     ? document.getElementById('hr-search').value.toLowerCase()     : '';
  var skillFilter  = document.getElementById('skill-filter')  ? document.getElementById('skill-filter').value.toLowerCase()  : '';
  var statusFilter = document.getElementById('status-filter') ? document.getElementById('status-filter').value.toLowerCase() : '';

  var rows = document.querySelectorAll('.candidate-row');
  var visible = 0;

  for (var i = 0; i < rows.length; i++) {
    var rowText   = rows[i].textContent.toLowerCase();
    var rowStatus = rows[i].getAttribute('data-status') || '';

    var matchSearch = !searchText   || rowText.includes(searchText);
    var matchSkill  = !skillFilter  || rowText.includes(skillFilter);
    var matchStatus = !statusFilter || rowStatus.toLowerCase() === statusFilter;

    if (matchSearch && matchSkill && matchStatus) {
      rows[i].style.display = '';
      visible++;
    } else {
      rows[i].style.display = 'none';
    }
  }

  var countEl = document.getElementById('result-count');
  if (countEl) countEl.textContent = visible + ' candidates';
}

function clearFilters() {
  var searchEl  = document.getElementById('hr-search');
  var skillEl   = document.getElementById('skill-filter');
  var statusEl  = document.getElementById('status-filter');
  if (searchEl)  searchEl.value  = '';
  if (skillEl)   skillEl.value   = '';
  if (statusEl)  statusEl.value  = '';
  filterCandidates();
}


// ---- PART 8: COMPANY PAGE - POST JOB AND MATCH CANDIDATES ----

function postJob() {
  var title  = document.getElementById('job-title-input') ? document.getElementById('job-title-input').value : '';
  var dept   = document.getElementById('department')      ? document.getElementById('department').value      : '';
  var type   = document.getElementById('job-type')        ? document.getElementById('job-type').value        : 'Full-time';
  var skills = document.getElementById('required-skills') ? document.getElementById('required-skills').value : '';
  var desc   = document.getElementById('job-desc')        ? document.getElementById('job-desc').value        : '';

  if (!title || !dept) {
    alert('Please fill in the Job Title and Department.');
    return;
  }

  var jobList = document.getElementById('posted-jobs');
  if (!jobList) return;

  // Build skill badges HTML
  var skillBadgesHTML = '';
  if (skills) {
    var skillArray = skills.split(',');
    for (var i = 0; i < skillArray.length; i++) {
      skillBadgesHTML += '<span class="skill-badge">' + skillArray[i].trim() + '</span> ';
    }
  }

  // Create new job card
  var card = document.createElement('div');
  card.className = 'job-card';
  card.innerHTML =
    '<div class="d-flex justify-content-between align-items-start flex-wrap gap-2">' +
      '<div>' +
        '<h5 class="fw-bold mb-1" style="font-size:1rem">' + title + '</h5>' +
        '<div class="d-flex gap-2 flex-wrap mt-1">' +
          '<span class="job-tag">' + dept + '</span>' +
          '<span class="job-tag">' + type + '</span>' +
          '<span class="job-tag" style="color:#28a745; border-color:#28a745">Open</span>' +
        '</div>' +
      '</div>' +
      '<div class="text-end">' +
        '<small class="text-muted">Posted Today</small>' +
        '<div class="mt-1"><button class="btn-red btn-sm" onclick="matchCandidates(\'' + title + '\',\'' + skills + '\')">&#128269; Match</button></div>' +
      '</div>' +
    '</div>' +
    (desc ? '<p class="mt-2 mb-1" style="font-size:0.85rem; color:#555">' + desc + '</p>' : '') +
    (skillBadgesHTML ? '<div class="mt-2">' + skillBadgesHTML + '</div>' : '');

  // Add to top of the list
  jobList.prepend(card);

  // Clear form fields
  var fieldsToClear = ['job-title-input', 'department', 'required-skills', 'job-desc'];
  for (var j = 0; j < fieldsToClear.length; j++) {
    var el = document.getElementById(fieldsToClear[j]);
    if (el) el.value = '';
  }

  // Close the modal
  var modal = bootstrap.Modal.getInstance(document.getElementById('postJobModal'));
  if (modal) modal.hide();

  // Show success toast
  showToast('Job posted successfully!');
}

function matchCandidates(jobTitle, skillsStr) {
  // Some sample candidates to match against
  var candidates = [
    { name: 'Ananya Sharma', skills: ['python','machine learning','sql'],      exp: '2 yrs' },
    { name: 'Rohan Verma',   skills: ['react','javascript','css'],             exp: '3 yrs' },
    { name: 'Priya Nair',    skills: ['java','spring boot','docker'],          exp: '4 yrs' },
    { name: 'Arjun Mehta',   skills: ['figma','html','css','javascript'],      exp: '1 yr'  },
    { name: 'Sneha Patel',   skills: ['data analysis','tableau','sql'],        exp: '2 yrs' }
  ];

  var requiredSkills = [];
  if (skillsStr) {
    var parts = skillsStr.split(',');
    for (var i = 0; i < parts.length; i++) {
      requiredSkills.push(parts[i].trim().toLowerCase());
    }
  }

  // Score each candidate
  var scored = [];
  for (var j = 0; j < candidates.length; j++) {
    var matchCount = 0;
    for (var k = 0; k < requiredSkills.length; k++) {
      for (var m = 0; m < candidates[j].skills.length; m++) {
        if (candidates[j].skills[m].includes(requiredSkills[k]) || requiredSkills[k].includes(candidates[j].skills[m])) {
          matchCount++;
          break;
        }
      }
    }
    var percent = requiredSkills.length > 0 ? Math.round((matchCount / requiredSkills.length) * 100) : 75;
    scored.push({
      name:    candidates[j].name,
      exp:     candidates[j].exp,
      skills:  candidates[j].skills,
      percent: percent
    });
  }

  // Sort highest match first
  scored.sort(function(a, b) { return b.percent - a.percent; });

  // Update modal
  var titleEl = document.getElementById('match-job-title');
  if (titleEl) titleEl.textContent = jobTitle;

  var resultsList = document.getElementById('match-results');
  if (!resultsList) return;

  resultsList.innerHTML = '';
  for (var n = 0; n < scored.length; n++) {
    var c = scored[n];
    var initials = c.name.split(' ').map(function(word) { return word[0]; }).join('');
    var badgeClass = c.percent >= 60 ? 'status-new' : 'status-review';

    resultsList.innerHTML +=
      '<div class="d-flex justify-content-between align-items-center py-2 border-bottom">' +
        '<div class="d-flex align-items-center gap-2">' +
          '<div class="avatar" style="width:34px; height:34px; font-size:0.76rem">' + initials + '</div>' +
          '<div>' +
            '<div style="font-weight:600; font-size:0.88rem">' + c.name + '</div>' +
            '<small class="text-muted">' + c.exp + ' &middot; ' + c.skills.join(', ') + '</small>' +
          '</div>' +
        '</div>' +
        '<span class="status-badge ' + badgeClass + '">' + c.percent + '% match</span>' +
      '</div>';
  }

  new bootstrap.Modal(document.getElementById('matchModal')).show();
}

function showToast(message) {
  var msgEl  = document.getElementById('toast-msg');
  var toastEl = document.getElementById('liveToast');
  if (msgEl)   msgEl.textContent = message;
  if (toastEl) new bootstrap.Toast(toastEl).show();
}


// ---- PART 9: LISTEN TO FORM INPUTS ----
// Attaches updatePreview() to all form fields in the builder

function listenToFields() {
  var fields = document.querySelectorAll('.form-panel input, .form-panel textarea, .form-panel select');
  for (var i = 0; i < fields.length; i++) {
    fields[i].removeEventListener('input', updatePreview);
    fields[i].addEventListener('input', updatePreview);
  }
}


// ---- PART 10: PAGE LOAD ----

document.addEventListener('DOMContentLoaded', function() {
  setupSkillInput();
  listenToFields();
  loadSavedData();
  updatePreview();

  // Smooth scroll for # links
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < anchorLinks.length; i++) {
    anchorLinks[i].addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});