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




function showToast(message) {
  var msgEl  = document.getElementById('toast-msg');
  var toastEl = document.getElementById('liveToast');
  if (msgEl)   msgEl.textContent = message;
  if (toastEl) new bootstrap.Toast(toastEl).show();
}



document.addEventListener('DOMContentLoaded', function() {
  setupSkillInput();
  listenToFields();
  loadSavedData();
  updatePreview();

  // Smooth scroll for # links
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < anchorLinks.length; i++){
    anchorLinks[i].addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});