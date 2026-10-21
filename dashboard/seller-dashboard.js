// Real auth: identity comes entirely from Google (/api/auth/google/start ->
// Google -> /api/auth/google/callback sets a session cookie -> back here).
// This page only ever checks "am I logged in?" via /api/auth/me.
var currentUser = null;

function showDashboard(user){
  currentUser = user;
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  document.getElementById('sellerName').textContent = user.name || user.email || 'Seller';
  document.getElementById('avatarInitial').textContent = (user.name || user.email || '?').charAt(0).toUpperCase();
  loadSellerData();
}
function showLoginScreen(errorCode){
  currentUser = null;
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
  var box = document.getElementById('loginErrorBox');
  if (errorCode) {
    var messages = {
      google_denied: 'Google sign-in was cancelled.',
      bad_state: 'Your sign-in session expired — please try again.',
      token_exchange_failed: 'Could not complete sign-in with Google — please try again.',
      profile_fetch_failed: 'Could not read your Google profile — please try again.',
      server_error: 'Something went wrong — please try again.'
    };
    box.textContent = messages[errorCode] || 'Sign-in failed — please try again.';
    box.classList.remove('hidden');
  } else {
    box.classList.add('hidden');
  }
}
function doLogout(){
  fetch('/api/auth/logout', { method: 'POST' }).then(function(){ showLoginScreen(); });
}

// Checks login state on every page load. If the URL has ?loginError=... from
// a failed Google callback, show that instead of silently landing on login.
function checkSession(){
  var params = new URLSearchParams(window.location.search);
  var loginError = params.get('loginError');
  if (params.has('loginError') || params.has('loggedIn')) {
    window.history.replaceState({}, '', window.location.pathname);
  }
  fetch('/api/auth/me', { cache: 'no-store' })
    .then(function(r){ return r.json().then(function(data){ return { ok: r.ok, data: data }; }); })
    .then(function(res){
      if (res.ok && res.data.user) showDashboard(res.data.user);
      else showLoginScreen(loginError);
    })
    .catch(function(){ showLoginScreen('server_error'); });
}
document.addEventListener('DOMContentLoaded', checkSession);

// --- Email/password Log in / Sign up (real backend, alongside Google) ---
function setAuthTab(name){
  document.getElementById('tabLogin').classList.toggle('active', name === 'login');
  document.getElementById('tabSignup').classList.toggle('active', name === 'signup');
  document.getElementById('loginForm').classList.toggle('hidden', name !== 'login');
  document.getElementById('signupForm').classList.toggle('hidden', name !== 'signup');
  document.getElementById('loginErrorBox').classList.add('hidden');
}

function submitLogin(event){
  event.preventDefault();
  var btn = document.getElementById('loginSubmitBtn');
  var box = document.getElementById('loginErrorBox');
  btn.disabled = true; btn.textContent = 'Logging in...';
  fetch('/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
    body: JSON.stringify({
      email: document.getElementById('loginEmail').value,
      password: document.getElementById('loginPassword').value
    })
  })
    .then(function(r){ return r.json().then(function(data){ return { ok: r.ok, data: data }; }); })
    .then(function(res){
      if (!res.ok) {
        box.textContent = res.data.error || 'Could not log in.';
        box.classList.remove('hidden');
        return;
      }
      showDashboard(res.data.user);
    })
    .catch(function(){ box.textContent = 'Could not reach the server — please try again.'; box.classList.remove('hidden'); })
    .finally(function(){ btn.disabled = false; btn.textContent = 'Log in'; });
  return false;
}

function submitSignup(event){
  event.preventDefault();
  var btn = document.getElementById('signupSubmitBtn');
  var box = document.getElementById('loginErrorBox');
  btn.disabled = true; btn.textContent = 'Creating account...';
  fetch('/api/auth/signup', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
    body: JSON.stringify({
      name: document.getElementById('signupName').value,
      email: document.getElementById('signupEmail').value,
      phone: document.getElementById('signupPhone').value,
      password: document.getElementById('signupPassword').value
    })
  })
    .then(function(r){ return r.json().then(function(data){ return { ok: r.ok, data: data }; }); })
    .then(function(res){
      if (!res.ok) {
        box.textContent = res.data.error || 'Could not create account.';
        box.classList.remove('hidden');
        return;
      }
      showDashboard(res.data.user);
    })
    .catch(function(){ box.textContent = 'Could not reach the server — please try again.'; box.classList.remove('hidden'); })
    .finally(function(){ btn.disabled = false; btn.textContent = 'Create account'; });
  return false;
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
  if (!currentUser) return;
  var listBody = document.getElementById('myListingsBody');
  var pendBody = document.getElementById('pendingBody');
  fetch('/api/listings?sellerId=' + encodeURIComponent(currentUser.id), { cache: 'no-store' })
    .then(function(r){ if (!r.ok) throw new Error('api'); return r.json(); })
    .then(function(data){
      var mine = data.listings || [];
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

// --- Photo upload (Cloudinary, unsigned preset) ---
var CLOUDINARY_CLOUD_NAME = 'dxv6lxlkg';
var CLOUDINARY_UPLOAD_PRESET = 'idama_listings';
var uploadedImages = []; // array of secure_url strings, sent as the listing's "images"

function renderPhotoPreview(){
  var box = document.getElementById('photoPreview');
  box.innerHTML = uploadedImages.map(function(url, i){
    return '<div class="photo-thumb">' +
      '<img src="' + url + '" alt="">' +
      '<button type="button" class="photo-remove" onclick="removePhoto(' + i + ')">&times;</button>' +
      '</div>';
  }).join('');
  var counter = document.getElementById('photoCount');
  if (counter) counter.textContent = uploadedImages.length + ' / ' + MAX_PHOTOS + ' photos';
}
function removePhoto(i){
  uploadedImages.splice(i, 1);
  renderPhotoPreview();
}

var MAX_PHOTOS = 8;

function handlePhotoSelect(event){
  var files = Array.prototype.slice.call(event.target.files || []);
  if (!files.length) return;
  var box = document.querySelector('.upload-box');
  var originalText = box.textContent;

  var remaining = MAX_PHOTOS - uploadedImages.length;
  if (remaining <= 0) {
    box.textContent = 'Maximum ' + MAX_PHOTOS + ' photos — remove one to add another.';
    setTimeout(function(){ box.textContent = originalText; }, 2500);
    event.target.value = '';
    return;
  }
  if (files.length > remaining) {
    files = files.slice(0, remaining);
    box.textContent = 'Only ' + remaining + ' more photo(s) allowed (max ' + MAX_PHOTOS + ') — uploading those.';
  } else {
    box.textContent = 'Uploading ' + files.length + ' photo(s)...';
  }

  var uploads = files.map(function(file){
    var fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    return fetch('https://api.cloudinary.com/v1_1/' + CLOUDINARY_CLOUD_NAME + '/image/upload', {
      method: 'POST',
      body: fd
    }).then(function(r){
      if (!r.ok) throw new Error('upload failed');
      return r.json();
    });
  });

  Promise.all(uploads)
    .then(function(results){
      results.forEach(function(res){ uploadedImages.push(res.secure_url); });
      renderPhotoPreview();
      box.textContent = originalText;
    })
    .catch(function(){
      box.textContent = 'Some photos failed to upload — try again.';
      setTimeout(function(){ box.textContent = originalText; }, 2500);
    })
    .finally(function(){
      event.target.value = ''; // allow re-selecting the same file(s) later
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
    sellerContact: val('f-contact'),
    images: uploadedImages
    // sellerId/sellerName are NOT sent — the backend always fills those in
    // from your logged-in session, so a listing can't be posted under
    // someone else's name.
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
    .then(function(r){
      if (r.status === 401) { showLoginScreen(); throw new Error('logged_out'); }
      if (!r.ok) throw new Error('Request failed');
      return r.json();
    })
    .then(function(){
      msg.textContent = 'Submitted. You can track it in the Pending approval tab until an admin approves it.';
      msg.className = 'form-msg success';
      document.getElementById('addPropertyForm').reset();
      document.querySelectorAll('.type-field').forEach(function(f){ f.classList.remove('is-open'); });
      uploadedImages = [];
      renderPhotoPreview();
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
