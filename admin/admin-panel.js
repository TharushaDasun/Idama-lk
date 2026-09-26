// Demo-only credential check (frontend, no real backend). Change these to
// whatever you want the admin login to be.
var ADMIN_USER = 'admin';
var ADMIN_PASS = 'admin123';

function attemptLogin(){
  var u = document.getElementById('adminUser').value.trim();
  var p = document.getElementById('adminPass').value;
  var err = document.getElementById('loginError');
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    err.classList.add('hidden');
    doLogin();
  } else {
    err.classList.remove('hidden');
  }
}

function doLogin(){
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  updateStats();
}
function doLogout(){
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
}
document.querySelectorAll('.tab-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    document.querySelectorAll('.tab-btn').forEach(function(b){b.classList.remove('active');});
    document.querySelectorAll('.panel-section').forEach(function(s){s.classList.remove('active');});
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// --- Demo data layer (localStorage-based; no real backend yet) ---
function getApproved(){
  var raw = localStorage.getItem('idama_approved_listings');
  return raw ? JSON.parse(raw) : [];
}
function saveApproved(list){
  localStorage.setItem('idama_approved_listings', JSON.stringify(list));
}

function approveRow(link){
  var row = link.closest('tr');
  var cells = row.querySelectorAll('td');
  var title = cells[0].textContent.trim();
  var category = cells[1].textContent.trim();

  var list = getApproved();
  list.push({
    title: title,
    category: category,
    tag: 'For Sale',
    price: 'Price on request',
    location: 'Sri Lanka'
  });
  saveApproved(list);

  var pill = row.querySelector('.status-pill');
  pill.textContent = 'Approved';
  pill.className = 'status-pill active';
  row.querySelector('.row-actions').innerHTML = '<span style="color:#9AA2A8;font-size:12.5px;">Live on main page</span>';
  updateStats();
}
function rejectRow(link){
  var row = link.closest('tr');
  row.style.opacity = '0.4';
  var pill = row.querySelector('.status-pill');
  pill.textContent = 'Rejected';
  pill.className = 'status-pill expired';
  row.querySelector('.row-actions').innerHTML = '<span style="color:#9AA2A8;font-size:12.5px;">Done</span>';
  updateStats();
}
function deleteRow(link){
  var row = link.closest('tr');
  var title = row.querySelector('td').textContent.trim();

  var list = getApproved().filter(function(item){ return item.title !== title; });
  saveApproved(list);

  row.style.transition = 'opacity .25s ease';
  row.style.opacity = '0';
  setTimeout(function(){ row.remove(); updateStats(); }, 250);
}
function suspendRow(link){
  var row = link.closest('tr');
  var pill = row.querySelector('.status-pill');
  var isActive = pill.classList.contains('active');
  pill.textContent = isActive ? 'Suspended' : 'Active';
  pill.className = isActive ? 'status-pill expired' : 'status-pill active';
  link.textContent = isActive ? 'Activate' : 'Suspend';
}

// Live overview stats: real seller-login count + approved listings, computed
// from what's actually in this browser's demo data (no backend yet, so this
// only reflects activity made on this device/site).
function updateStats(){
  var userCount = parseInt(localStorage.getItem('idama_user_count') || '0', 10);
  var approvedCount = getApproved().length;
  var pendingCount = document.querySelectorAll('#pending .status-pill.pending').length;
  var reportedCount = document.querySelectorAll('#reported .listings-table tr').length - 1; // minus header row

  var nums = document.querySelectorAll('.stat-grid .num');
  if (nums[0]) nums[0].textContent = userCount.toLocaleString();
  if (nums[1]) nums[1].textContent = (386 + approvedCount).toLocaleString();
  if (nums[2]) nums[2].textContent = pendingCount;
  if (nums[3]) nums[3].textContent = reportedCount >= 0 ? reportedCount : 0;
}
