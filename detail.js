// Property detail page. Loads one listing from GET /api/listings/:id and
// renders gallery, specs, map, contact, EMI calculator and similar listings.

// Approximate town-centre coordinates, used to place the map pin from the
// listing's city. Listings don't store exact GPS coordinates yet.
var TOWN_COORDS = {
  "colombo": [6.9271, 79.8612], "negombo": [7.2008, 79.8737], "gampaha": [7.0873, 79.9925],
  "kalutara": [6.5854, 79.9607], "moratuwa": [6.7730, 79.8816], "kelaniya": [6.9553, 79.9217],
  "kandy": [7.2906, 80.6337], "matale": [7.4675, 80.6234], "nuwara eliya": [6.9497, 80.7891],
  "gampola": [7.1643, 80.5741], "galle": [6.0535, 80.2210], "matara": [5.9549, 80.5550],
  "hambantota": [6.1241, 81.1185], "tangalle": [6.0240, 80.7970], "jaffna": [9.6615, 80.0255],
  "vavuniya": [8.7514, 80.4971], "kilinochchi": [9.3803, 80.3770], "mannar": [8.9810, 79.9044],
  "batticaloa": [7.7310, 81.6747], "trincomalee": [8.5874, 81.2152], "ampara": [7.2912, 81.6724],
  "kalmunai": [7.4167, 81.8167], "kurunegala": [7.4863, 80.3647], "puttalam": [8.0362, 79.8283],
  "chilaw": [7.5758, 79.7953], "anuradhapura": [8.3114, 80.4037], "polonnaruwa": [7.9403, 81.0188],
  "badulla": [6.9934, 81.0550], "bandarawela": [6.8329, 80.9880], "monaragala": [6.8728, 81.3507],
  "ratnapura": [6.6828, 80.3992], "kegalle": [7.2513, 80.3464], "embilipitiya": [6.3333, 80.8500]
};

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function money(n) { return "Rs. " + Math.round(Number(n)).toLocaleString(); }

// Sri Lankan numbers are usually typed as 07XXXXXXXX; wa.me needs 947XXXXXXXX.
function waNumber(raw) {
  var d = String(raw || "").replace(/[^0-9]/g, "");
  if (d.indexOf("0") === 0) d = "94" + d.slice(1);
  return d;
}

var listingId = new URLSearchParams(window.location.search).get("id");
var root = document.getElementById("detailRoot");
var current = null;

function showState(msg) {
  root.innerHTML = '<p class="detail-state">' + msg + '</p>';
}

if (!listingId) {
  showState('No property selected. <a href="index.html" style="color:var(--emerald);font-weight:600;">Back to home</a>');
} else {
  fetch("/api/listings/" + encodeURIComponent(listingId))
    .then(function (r) { if (!r.ok) throw new Error("not found"); return r.json(); })
    .then(function (d) { current = d.listing; render(current); })
    .catch(function () {
      showState('This property could not be found. <a href="index.html" style="color:var(--emerald);font-weight:600;">Back to home</a>');
    });
}

function render(l) {
  document.title = l.title + " — Idama.lk";
  var isRent = l.priceUnit === "month";
  var priceHtml = money(l.price) + (isRent ? " <small>/ month</small>" : "");
  var where = [l.city, l.province].filter(Boolean).join(", ") || "Sri Lanka";

  var specs = [["Category", l.category]];
  if (l.perches) specs.push([l.perches + " perches", "Extent"]);
  if (l.perches && !isRent) specs.push([money(l.price / l.perches), "Per perch"]);
  if (l.bedrooms) specs.push([l.bedrooms, "Bedrooms"]);
  if (l.bathrooms) specs.push([l.bathrooms, "Bathrooms"]);
  if (l.floor) specs.push([l.floor, "Floor"]);
  if (l.floorAreaSqft) specs.push([Number(l.floorAreaSqft).toLocaleString() + " sq.ft", "Floor area"]);
  var specsHtml = specs.map(function (s, i) {
    return i === 0
      ? '<div class="spec"><b style="text-transform:capitalize;">' + esc(s[1]) + '</b><span>Category</span></div>'
      : '<div class="spec"><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>';
  }).join("");

  var imgs = (l.images || []).filter(function (u) { return /^https?:\/\//.test(u); });
  var galleryHtml = imgs.length
    ? '<div class="gallery"><img id="gImg" src="' + esc(imgs[0]) + '" alt="' + esc(l.title) + '"></div>' +
      (imgs.length > 1 ? '<div class="thumbs">' + imgs.map(function (u, i) {
        return '<img src="' + esc(u) + '" class="' + (i === 0 ? "on" : "") + '" alt="">';
      }).join("") + '</div>' : "")
    : '<div class="gallery"><div class="gallery-empty">Photos coming soon</div></div>';

  var wa = waNumber(l.sellerContact);
  var contactHtml = '<div class="card-box"><h2>Contact seller</h2>' +
    '<p class="seller-line">Listed by ' + esc(l.sellerName || "Seller") + '</p>' +
    (l.sellerContact
      ? '<a class="btn-block btn-call" href="tel:' + esc(l.sellerContact) + '">Call ' + esc(l.sellerContact) + '</a>' +
        '<a class="btn-block btn-wa" target="_blank" rel="noopener" href="https://wa.me/' + wa + '?text=' +
          encodeURIComponent("Hi, I'm interested in \"" + l.title + "\" on Idama.lk") + '">Chat on WhatsApp</a>'
      : '<p class="seller-line">The seller has not added a contact number.</p>') +
    '<button class="btn-block btn-ghost" onclick="shareThis()">Share this property</button>' +
    '<a class="report-link" onclick="reportThis()">Report this listing</a></div>';

  var emiHtml = isRent ? "" :
    '<div class="card-box emi"><h2>Loan calculator</h2>' +
    '<label>Down payment (%)</label><input id="emiDown" type="number" value="20" min="0" max="90">' +
    '<label>Interest rate (% per year)</label><input id="emiRate" type="number" value="12" min="0" step="0.1">' +
    '<label>Term (years)</label><input id="emiYears" type="number" value="15" min="1" max="40">' +
    '<div class="emi-result"><span>Estimated monthly payment</span><b id="emiMonthly">-</b><span id="emiTotals"></span></div>' +
    '<p class="emi-disc">Indicative only. Actual rates, fees and eligibility depend on your bank.</p></div>';

  root.innerHTML =
    '<p class="crumbs"><a href="index.html">Home</a> / ' + esc(l.category) + ' / ' + esc(l.city || l.province || "Sri Lanka") + '</p>' +
    (l.status !== "active" ? '<div class="notice">This listing is ' + esc(l.status) + ' and is not visible to the public yet.</div>' : "") +
    '<div class="detail-head"><div><h1>' + esc(l.title) + '</h1><div class="detail-loc">' + esc(where) + '</div>' +
      '<div class="badge-row"><span class="badge">' + (isRent ? "For rent" : "For sale") + '</span>' +
      (l.status === "active" ? '<span class="badge copper">Listed on Idama.lk</span>' : "") + '</div></div>' +
      '<div class="detail-price">' + priceHtml + '</div></div>' +
    '<div class="detail-grid"><div>' + galleryHtml +
      '<div class="card-box"><h2>Overview</h2><div class="specs">' + specsHtml + '</div></div>' +
      (l.description ? '<div class="card-box"><h2>Description</h2><p class="desc">' + esc(l.description) + '</p></div>' : "") +
      '<div class="card-box"><h2>Location</h2><div id="detailMap"></div><p class="map-note" id="mapNote"></p></div>' +
      '<div class="card-box"><h2>Similar properties</h2><div class="similar" id="similarBox"><span class="map-note">Loading...</span></div></div>' +
    '</div><aside class="side">' + contactHtml + emiHtml + '</aside></div>';

  document.querySelectorAll(".thumbs img").forEach(function (t) {
    t.addEventListener("click", function () {
      document.getElementById("gImg").src = t.src;
      document.querySelectorAll(".thumbs img").forEach(function (x) { x.classList.remove("on"); });
      t.classList.add("on");
    });
  });

  initMap(l);
  if (!isRent) initEmi(l);
  loadSimilar(l);
}

function initMap(l) {
  var box = document.getElementById("detailMap");
  if (!box || typeof L === "undefined") { if (box) box.parentNode.style.display = "none"; return; }
  var key = String(l.city || "").trim().toLowerCase();
  var coords = TOWN_COORDS[key];
  var exact = !!coords;
  var map = L.map(box, { scrollWheelZoom: false }).setView(coords || [7.8731, 80.7718], coords ? 12 : 7);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18, attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
  if (coords) L.marker(coords).addTo(map);
  document.getElementById("mapNote").textContent = exact
    ? "Approximate location (town centre). The seller can share the exact address."
    : "Exact location not available for this listing.";
}

function initEmi(l) {
  var down = document.getElementById("emiDown"), rate = document.getElementById("emiRate"), years = document.getElementById("emiYears");
  function calc() {
    var loan = l.price * (1 - (Number(down.value) || 0) / 100);
    var n = (Number(years.value) || 1) * 12;
    var r = (Number(rate.value) || 0) / 1200;
    var emi = r === 0 ? loan / n : loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    document.getElementById("emiMonthly").textContent = money(emi);
    document.getElementById("emiTotals").textContent = "Loan " + money(loan) + " · Total interest " + money(emi * n - loan);
  }
  [down, rate, years].forEach(function (el) { el.addEventListener("input", calc); });
  calc();
}

function loadSimilar(l) {
  var box = document.getElementById("similarBox");
  fetch("/api/listings?status=active&category=" + encodeURIComponent(l.category))
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var others = (d.listings || []).filter(function (x) { return x.id !== l.id; }).slice(0, 3);
      box.innerHTML = others.length ? others.map(function (x) {
        return '<a class="sim-card" href="detail.html?id=' + encodeURIComponent(x.id) + '"><b>' + money(x.price) +
          (x.priceUnit === "month" ? "/mo" : "") + '</b><span>' + esc(x.title) + '</span><span>' + esc(x.city || x.province || "Sri Lanka") + '</span></a>';
      }).join("") : '<span class="map-note">No similar properties yet.</span>';
    })
    .catch(function () { box.innerHTML = '<span class="map-note">Could not load similar properties.</span>'; });
}

function shareThis() {
  var url = window.location.href;
  if (navigator.share) { navigator.share({ title: document.title, url: url }).catch(function () {}); }
  else if (navigator.clipboard) { navigator.clipboard.writeText(url).then(function () { alert("Link copied"); }); }
  else { prompt("Copy this link:", url); }
}

function reportThis() {
  if (!confirm("Report this listing as inaccurate or fraudulent?")) return;
  fetch("/api/listings/" + encodeURIComponent(listingId))
    .then(function (r) { return r.json(); })
    .then(function (d) {
      return fetch("/api/listings/" + encodeURIComponent(listingId), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportCount: (d.listing.reportCount || 0) + 1 })
      });
    })
    .then(function () { alert("Thanks. Our team will review this listing."); })
    .catch(function () { alert("Could not send the report, please try again."); });
}
