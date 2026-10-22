const API_BASE = 'http://localhost:3000/api';
let allLoadedCases = [];
let activeFilter = 'ALL';

document.addEventListener('DOMContentLoaded', () => {
  fetchCases();
  fetchStats();
});

function switchTab(tabId) {
  ['cases', 'scan', 'register', 'alert'].forEach(t => {
    document.getElementById(`tab-${t}`).classList.add('hidden');
    const btn = document.getElementById(`tab-btn-${t}`);
    if (btn) {
      btn.className = "px-4 py-2 text-xs font-semibold rounded-lg text-gray-400 hover:text-white transition whitespace-nowrap";
    }
  });

  document.getElementById(`tab-${tabId}`).classList.remove('hidden');
  const activeBtn = document.getElementById(`tab-btn-${tabId}`);
  if (activeBtn) {
    activeBtn.className = "px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 whitespace-nowrap";
  }
}

async function fetchCases() {
  try {
    const res = await fetch(`${API_BASE}/cases`);
    allLoadedCases = await res.json();
    renderFilteredCases();
  } catch (err) {
    console.error("Failed to fetch cases", err);
  }
}

function setFilter(status) {
  activeFilter = status;
  
  // Highlight active filter button
  ['ALL', 'ACTIVE', 'FOUND'].forEach(st => {
    const btn = document.getElementById(`filter-btn-${st}`);
    if (btn) {
      if (st === status) {
        btn.className = "px-3 py-1 rounded-md text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition";
      } else {
        btn.className = "px-3 py-1 rounded-md text-xs font-medium text-gray-400 hover:text-white transition";
      }
    }
  });

  renderFilteredCases();
}

function renderFilteredCases() {
  const filtered = activeFilter === 'ALL' 
    ? allLoadedCases 
    : allLoadedCases.filter(c => c.status === activeFilter);

  renderCases(filtered);
}

function renderCases(cases) {
  const container = document.getElementById('cases-grid');
  if (!cases || cases.length === 0) {
    container.innerHTML = `<div class="col-span-3 text-center text-gray-500 text-xs py-8">No ${activeFilter.toLowerCase()} cases found in the database.</div>`;
    return;
  }

  container.innerHTML = cases.map(c => {
    const isFound = c.status === 'FOUND';
    const statusBadgeClass = isFound 
      ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
      : 'bg-red-950 text-red-400 border-red-800';

    return `
      <div class="glass-panel p-4 flex space-x-4 hover:border-cyan-500/50 transition">
        <img src="${c.photoUrl}" class="w-20 h-24 rounded-lg object-cover border border-gray-800" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'">
        <div class="space-y-1 text-xs flex-1">
          <div class="flex justify-between items-start">
            <h3 class="font-bold text-white text-sm">${c.fullName}</h3>
            <span class="text-[9px] border px-1.5 py-0.5 rounded font-mono ${statusBadgeClass}">${c.status}</span>
          </div>
          <p class="text-gray-400"><i class="fa-solid fa-user-circle mr-1 text-gray-500"></i> Age: ${c.age} (${c.gender})</p>
          <p class="text-gray-400"><i class="fa-solid fa-location-dot mr-1 text-gray-500"></i> ${c.lastSeenLoc}</p>
          <p class="text-cyan-400 pt-1 font-mono"><i class="fa-solid fa-phone mr-1"></i> ${c.contactPhone}</p>
        </div>
      </div>
    `;
  }).join('');
}

async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await res.json();
    document.getElementById('stat-total').innerText = data.totalCases;
    document.getElementById('stat-active').innerText = data.activeCases;
    document.getElementById('stat-reunited').innerText = data.reunited;
    document.getElementById('stat-accuracy').innerText = data.aiAccuracy;
  } catch (err) {
    console.log("Stats error");
  }
}

async function submitCase(event) {
  event.preventDefault();
  
  const formData = new FormData();
  formData.append('fullName', document.getElementById('reg-name').value);
  formData.append('age', document.getElementById('reg-age').value);
  formData.append('gender', document.getElementById('reg-gender').value);
  formData.append('lastSeenLoc', document.getElementById('reg-loc').value);
  formData.append('contactPhone', document.getElementById('reg-phone').value);

  const fileInput = document.getElementById('reg-file');
  if (fileInput.files.length > 0) {
    formData.append('photo', fileInput.files[0]);
  }

  try {
    const res = await fetch(`${API_BASE}/cases/register`, {
      method: 'POST',
      body: formData
    });
    
    if (res.ok) {
      alert('Missing Person Case Registered!');
      document.getElementById('register-form').reset();
      fetchCases();
      fetchStats();
      switchTab('cases');
    }
  } catch (err) {
    alert('Error connecting to backend server');
  }
}

function triggerScanInput() {
  document.getElementById('scan-file-input').click();
}

function handleScanImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.getElementById('scan-preview');
      img.src = e.target.result;
      img.classList.remove('hidden');
      document.getElementById('scan-placeholder').classList.add('hidden');
      drawFacialMesh();
    };
    reader.readAsDataURL(file);
  }
}

function drawFacialMesh() {
  const canvas = document.getElementById('mesh-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#06b6d4';
  ctx.fillStyle = '#06b6d4';
  ctx.lineWidth = 1;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const points = [];

  for (let i = 0; i < 24; i++) {
    const px = centerX + (Math.random() - 0.5) * 120;
    const py = centerY + (Math.random() - 0.5) * 140;
    points.push({ x: px, y: py });
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dist = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
      if (dist < 45) {
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
  }
}

async function runAIMatch() {
  const beam = document.getElementById('scan-beam');
  beam.style.display = 'block';

  setTimeout(async () => {
    try {
      const res = await fetch(`${API_BASE}/ai/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: 'sample' })
      });
      const data = await res.json();

      beam.style.display = 'none';
      document.getElementById('ai-idle-state').classList.add('hidden');
      document.getElementById('ai-results-state').classList.remove('hidden');

      document.getElementById('match-confidence').innerText = data.confidence + '%';
      document.getElementById('match-name').innerText = data.matchedCase.fullName;
      document.getElementById('match-age').innerText = data.matchedCase.age;
      document.getElementById('match-loc').innerText = data.matchedCase.lastSeenLoc;
      document.getElementById('match-contact').innerText = data.matchedCase.contactPhone;
      document.getElementById('match-img').src = data.matchedCase.photoUrl;

    } catch (err) {
      beam.style.display = 'none';
    }
  }, 2000);
}

async function triggerAmberAlert() {
  const radius = document.getElementById('alert-radius').value;
  const location = document.getElementById('alert-loc').value;

  try {
    const res = await fetch(`${API_BASE}/alerts/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ radius, location })
    });
    const data = await res.json();
    alert(`?? EMERGENCY BROADCAST ACTIVATED!\n\nAlert sent to approx ${data.devicesNotified} active mobile nodes in a ${radius}km radius around ${location}.`);
  } catch (err) {
    alert(`?? EMERGENCY BROADCAST SIMULATED!`);
  }
}
