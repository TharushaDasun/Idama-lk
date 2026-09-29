// UI-only for now: Log in / Sign up / Google all just enter the dashboard.
// No real backend accounts yet — every "seller" is still the same demo user.
function doLogin(event){
  if (event) event.preventDefault();
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  loadSellerData();
}
function doLogout(){
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
}
function setAuthTab(name){
  document.getElementById('tabLogin').classList.toggle('active', name === 'login');
  document.getElementById('tabSignup').classList.toggle('active', name === 'signup');
  document.getElementById('loginForm').classList.toggle('hidden', name !== 'login');
  document.getElementById('signupForm').classList.toggle('hidden', name !== 'signup');
}
function showTab(name){
  document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.toggle('active', b.dataset.tab === name); });
  document.querySelectorAll('.panel-section').forEach(function(s){ s.classList.toggle('active', s.id === name); });
  if (name === 'overview' || name === 'listings' || name === 'pending') loadSellerData();
}
document.querySelectorAll('.tab-btn').forEach(function(btn){
  btn.addEventListener('click', function(){ showTab(btn.dataset.tab); });
});

function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function priceLabel(l){
  return 'Rs. ' + Number(l.price).toLocaleString() + (l.priceUnit === 'month' ? '/mo' : '');
}
function timeAgo(iso){
  var mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return mins + ' min ago';
  var hrs = Math.round(mins / 60);
  if (hrs < 24) return hrs + ' hr ago';
  return Math.round(hrs / 24) + ' day(s) ago';
}

// One fetch feeds the overview stats, My Listings (live + rejected) and the
// Pending tab. Sellers aren't authenticated yet, so "mine" is matched by the
// seller name shown in the top bar.
function loadSellerData(){
  var myName = document.getElementById('sellerName').textContent;
  var listBody = document.getElementById('myListingsBody');
  var pendBody = document.getElementById('pendingBody');
  fetch('/api/listings')
    .then(function(r){ if (!r.ok) throw new Error('api'); return r.json(); })
    .then(function(data){
      var mine = (data.listings || []).filter(function(l){ return l.sellerName === myName; });
      var active = mine.filter(function(l){ return l.status === 'active'; });
      var pending = mine.filter(function(l){ return l.status === 'pending'; });
      var rejected = mine.filter(function(l){ return l.status === 'rejected'; });

      document.getElementById('sTotal').textContent = mine.length;
      document.getElementById('sActive').textContent = active.length;
      document.getElementById('sPending').textContent = pending.length;
      document.getElementById('sRejected').textContent = rejected.length;
      document.getElementById('pendingTabBtn').textContent = pending.length ? 'Pending approval (' + pending.length + ')' : 'Pending approval';
      document.getElementById('activityNote').textContent = mine.length
        ? 'You have ' + active.length + ' listing(s) live and ' + pending.length + ' waiting for admin approval.'
        : 'You have not added any listings yet. Use the Add Property tab to post your first one.';

      var shown = active.concat(rejected);
      listBody.innerHTML = shown.length ? shown.map(function(l){
        var isActive = l.status === 'active';
        return '<tr><td>' + esc(l.title) + '</td><td>' + esc(l.category) + '</td><td>' + priceLabel(l) + '</td>' +
          '<td><span class="status-pill ' + (isActive ? 'active' : 'expired') + '">' + (isActive ? 'Live' : 'Rejected') + '</span></td>' +
          '<td class="row-actions">' +
            (isActive ? '<a href="../detail.html?id=' + encodeURIComponent(l.id) + '" target="_blank">View</a><a href="#" class="boost" onclick="showTab(\'boost\');return false;">Boost</a>' : '') +
            '<a href="#" onclick="deleteMyListing(\'' + esc(l.id) + '\');return false;">Delete</a>' +
          '</td></tr>';
      }).join('') : '<tr><td colspan="5" style="color:#9AA2A8;">No live listings yet.</td></tr>';

      pendBody.innerHTML = pending.length ? pending.map(function(l){
        return '<tr><td>' + esc(l.title) + '</td><td>' + esc(l.category) + '</td><td>' + priceLabel(l) + '</td>' +
          '<td>' + timeAgo(l.createdAt) + '</td>' +
          '<td class="row-actions"><a href="#" onclick="deleteMyListing(\'' + esc(l.id) + '\');return false;">Withdraw</a></td></tr>';
      }).join('') : '<tr><td colspan="5" style="color:#9AA2A8;">Nothing is waiting for approval.</td></tr>';
    })
    .catch(function(){
      var err = '<tr><td colspan="5" style="color:#B3413A;">Could not reach the server. Please refresh.</td></tr>';
      listBody.innerHTML = err; pendBody.innerHTML = err;
      document.getElementById('activityNote').textContent = 'Could not reach the server.';
    });
}

function deleteMyListing(id){
  if (!confirm('Remove this listing? This cannot be undone.')) return;
  fetch('/api/listings/' + encodeURIComponent(id), { method: 'DELETE' })
    .then(function(){ loadSellerData(); });
}

function toggleCategoryFields(){
  var cat = document.getElementById('category').value;
  document.querySelectorAll('.type-field').forEach(function(f){
    var cats = f.dataset.cat.split(' ');
    f.classList.toggle('is-open', cats.indexOf(cat) !== -1);
  });
}

// Submits the Add Property form to the real backend (POST /api/listings).
// New listings start as "pending" until an admin approves them.
function submitListing(event){
  event.preventDefault();
  var msg = document.getElementById('addListingMsg');
  var btn = document.getElementById('submitListingBtn');
  var val = function(id){ var el = document.getElementById(id); return el ? el.value : ''; };

  var payload = {
    title: val('f-title'),
    category: val('category'),
    price: val('f-price'),
    province: val('f-province'),
    city: val('f-city'),
    perches: val('f-perches'),
    bedrooms: val('f-bedrooms'),
    bathrooms: val('f-bathrooms'),
    floor: val('f-floor'),
    floorAreaSqft: val('f-floorarea'),
    description: val('f-description'),
    sellerName: document.getElementById('sellerName') ? document.getElementById('sellerName').textContent : '',
    sellerContact: val('f-contact')
  };

  if (!payload.title || !payload.category) {
    msg.textContent = 'Please fill in at least the category and listing title.';
    msg.className = 'form-msg error';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Submitting...';

  fetch('/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(function(r){ if (!r.ok) throw new Error('Request failed'); return r.json(); })
    .then(function(){
      msg.textContent = 'Submitted. You can track it in the Pending approval tab until an admin approves it.';
      msg.className = 'form-msg success';
      document.getElementById('addPropertyForm').reset();
      document.querySelectorAll('.type-field').forEach(function(f){ f.classList.remove('is-open'); });
      loadSellerData();
    })
    .catch(function(){
      msg.textContent = 'Something went wrong — please try again.';
      msg.className = 'form-msg error';
    })
    .finally(function(){
      btn.disabled = false;
      btn.textContent = 'Submit listing';
    });
}
