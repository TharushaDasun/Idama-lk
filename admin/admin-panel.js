// NOTE: this login check runs in the browser, so anyone who views this file
// can read the password. It only hides the panel UI; it does NOT protect the
// API. Real protection needs a server-side check (see the security note).
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
  refreshAll();
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
    refreshAll();
  });
});

// Seller-submitted text must never be inserted into the page unescaped.
function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function timeAgo(iso){
  var mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return mins + ' min ago';
  var hrs = Math.round(mins / 60);
  if (hrs < 24) return hrs + ' hr ago';
  return Math.round(hrs / 24) + ' day(s) ago';
}
function row(cols, text, color){
  return '<tr><td colspan="' + cols + '" style="color:' + (color || '#9AA2A8') + ';">' + text + '</td></tr>';
}

// One fetch of every listing feeds all four views.
function refreshAll(){
  fetch('/api/listings')
    .then(function(r){ if (!r.ok) throw new Error('api'); return r.json(); })
    .then(function(data){
      var all = data.listings || [];
      renderStats(all);
      renderPending(all.filter(function(l){ return l.status === 'pending'; }));
      renderReported(all.filter(function(l){ return l.reportCount > 0; }));
      renderSellers(all);
    })
    .catch(function(){
      ['pendingBody', 'reportedBody', 'usersBody'].forEach(function(id){
        document.getElementById(id).innerHTML = row(6, 'Could not reach the server.', '#B3413A');
      });
      document.getElementById('activityNote').textContent = 'Could not reach the server.';
    });
}

// One seller = one contact number (or name if no number was given).
function sellerKey(l){
  var digits = String(l.sellerContact || '').replace(/[^0-9]/g, '');
  return digits || String(l.sellerName || '').toLowerCase();
}

function renderStats(all){
  var pending = all.filter(function(l){ return l.status === 'pending'; }).length;
  var reported = all.filter(function(l){ return l.reportCount > 0; }).length;
  var sellers = {};
  all.forEach(function(l){ sellers[sellerKey(l)] = true; });
  var sellerCount = Object.keys(sellers).filter(Boolean).length;

  document.getElementById('statUsers').textContent = sellerCount.toLocaleString();
  document.getElementById('statListings').textContent = all.length.toLocaleString();
  document.getElementById('statPending').textContent = pending;
  document.getElementById('statReported').textContent = reported;
  document.getElementById('activityNote').textContent =
    pending + ' listing(s) waiting for approval, ' + reported + ' reported.';
}

function renderPending(list){
  var body = document.getElementById('pendingBody');
  body.innerHTML = list.length ? list.map(function(l){
    return '<tr><td><a href="../detail.html?id=' + encodeURIComponent(l.id) + '" target="_blank">' + esc(l.title) + '</a></td>' +
      '<td>' + esc(l.category) + '</td><td>' + esc(l.sellerName || '-') + '</td>' +
      '<td>' + timeAgo(l.createdAt) + '</td><td><span class="status-pill pending">Pending</span></td>' +
      '<td class="row-actions">' +
        '<a href="#" class="approve" onclick="setStatus(\'' + esc(l.id) + '\',\'active\');return false;">Approve</a>' +
        '<a href="#" class="reject" onclick="setStatus(\'' + esc(l.id) + '\',\'rejected\');return false;">Reject</a>' +
      '</td></tr>';
  }).join('') : row(6, 'No listings are waiting for approval.');
}

function renderReported(list){
  var body = document.getElementById('reportedBody');
  body.innerHTML = list.length ? list.map(function(l){
    var reasons = l.reportReasons || [];
    var latest = reasons.length ? reasons[reasons.length - 1] : 'No reason given';
    return '<tr><td><a href="../detail.html?id=' + encodeURIComponent(l.id) + '" target="_blank">' + esc(l.title) + '</a></td>' +
      '<td>' + l.reportCount + '</td><td>' + esc(latest) + '</td>' +
      '<td class="row-actions">' +
        '<a href="#" onclick="dismissReports(\'' + esc(l.id) + '\');return false;">Dismiss</a>' +
        '<a href="#" class="delete" onclick="deleteListing(\'' + esc(l.id) + '\');return false;">Delete</a>' +
      '</td></tr>';
  }).join('') : row(4, 'No reported listings.');
}

function renderSellers(all){
  var body = document.getElementById('usersBody');
  var map = {};
  all.forEach(function(l){
    var k = sellerKey(l);
    if (!k) return;
    var s = map[k] || (map[k] = { name: l.sellerName, contact: l.sellerContact, total: 0, live: 0, last: l.createdAt });
    s.total++;
    if (l.status === 'active') s.live++;
    if (new Date(l.createdAt) > new Date(s.last)) s.last = l.createdAt;
  });
  var sellers = Object.keys(map).map(function(k){ return map[k]; })
    .sort(function(a, b){ return new Date(b.last) - new Date(a.last); });
  body.innerHTML = sellers.length ? sellers.map(function(s){
    return '<tr><td>' + esc(s.name || '-') + '</td><td>' + esc(s.contact || '-') + '</td>' +
      '<td>' + s.total + '</td><td>' + s.live + '</td><td>' + timeAgo(s.last) + '</td></tr>';
  }).join('') : row(5, 'No sellers yet.');
}

function patchListing(id, patch){
  return fetch('/api/listings/' + encodeURIComponent(id), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  }).then(refreshAll);
}
function setStatus(id, status){ patchListing(id, { status: status }); }
function dismissReports(id){ patchListing(id, { reportCount: 0, reportReasons: [] }); }
function deleteListing(id){
  if (!confirm('Delete this listing permanently?')) return;
  fetch('/api/listings/' + encodeURIComponent(id), { method: 'DELETE' }).then(refreshAll);
}
