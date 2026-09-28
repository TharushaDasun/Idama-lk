function doLogin(){
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  // Counts this browser as one real signup, once — read by the Admin Panel's
  // "Total users" stat. Demo-only (localStorage), no real backend yet.
  if (!localStorage.getItem('idama_seller_registered')) {
    var count = parseInt(localStorage.getItem('idama_user_count') || '0', 10);
    localStorage.setItem('idama_user_count', String(count + 1));
    localStorage.setItem('idama_seller_registered', 'true');
  }
  loadMyListings();
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
    if (btn.dataset.tab === 'listings') loadMyListings();
  });
});

// Loads this seller's own listings from the real backend. Sellers aren't
// really authenticated yet (demo login), so "mine" is approximated by
// matching the sellerName shown in the topbar — good enough for a demo,
// not a substitute for real per-account auth.
function loadMyListings(){
  var body = document.getElementById('myListingsBody');
  if (!body) return;
  var myName = document.getElementById('sellerName') ? document.getElementById('sellerName').textContent : '';
  fetch('/api/listings')
    .then(function(r){ return r.json(); })
    .then(function(data){
      var mine = (data.listings || []).filter(function(l){ return l.sellerName === myName; });
      if (!mine.length){
        body.innerHTML = '<tr><td colspan="5" style="color:#9AA2A8;">No listings yet — add your first property.</td></tr>';
        return;
      }
      body.innerHTML = mine.map(function(l){
        var price = l.priceUnit === 'month'
          ? 'Rs. ' + Number(l.price).toLocaleString() + '/mo'
          : 'Rs. ' + Number(l.price).toLocaleString();
        var pillClass = l.status === 'active' ? 'active' : (l.status === 'pending' ? 'pending' : 'expired');
        var pillLabel = l.status === 'active' ? 'Active' : (l.status === 'pending' ? 'Pending' : 'Rejected');
        return '<tr data-id="' + l.id + '">' +
          '<td>' + l.title + '</td><td>' + l.category + '</td><td>' + price + '</td>' +
          '<td><span class="status-pill ' + pillClass + '">' + pillLabel + '</span></td>' +
          '<td class="row-actions">' +
            '<a href="#" class="boost" onclick="goToBoost();return false;">Boost</a>' +
            '<a href="#" onclick="deleteMyListing(\'' + l.id + '\');return false;">Delete</a>' +
          '</td></tr>';
      }).join('');
    })
    .catch(function(){
      body.innerHTML = '<tr><td colspan="5" style="color:#B3413A;">Could not reach the backend API.</td></tr>';
    });
}

function deleteMyListing(id){
  fetch('/api/listings/' + id, { method: 'DELETE' })
    .then(function(){ loadMyListings(); });
}

function goToBoost(){
  document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
  document.querySelectorAll('.panel-section').forEach(function(s){ s.classList.remove('active'); });
  document.querySelector('[data-tab="boost"]').classList.add('active');
  document.getElementById('boost').classList.add('active');
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
      msg.textContent = 'Submitted — this listing is now pending admin approval.';
      msg.className = 'form-msg success';
      document.getElementById('addPropertyForm').reset();
      document.querySelectorAll('.type-field').forEach(function(f){ f.classList.remove('is-open'); });
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
