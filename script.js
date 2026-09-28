// Province -> City/Town cascading select, and the Land-only perches field.
(function () {
  var townsByProvince = {
    "Western": ["Colombo", "Negombo", "Gampaha", "Kalutara", "Moratuwa", "Kelaniya"],
    "Central": ["Kandy", "Matale", "Nuwara Eliya", "Gampola"],
    "Southern": ["Galle", "Matara", "Hambantota", "Tangalle"],
    "Northern": ["Jaffna", "Vavuniya", "Kilinochchi", "Mannar"],
    "Eastern": ["Batticaloa", "Trincomalee", "Ampara", "Kalmunai"],
    "North Western": ["Kurunegala", "Puttalam", "Chilaw"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Uva": ["Badulla", "Bandarawela", "Monaragala"],
    "Sabaragamuwa": ["Ratnapura", "Kegalle", "Embilipitiya"]
  };

  var provinceSelect = document.getElementById("province");
  var citySelect = document.getElementById("city");
  var typeSelect = document.getElementById("type");
  var perchesField = document.getElementById("perchesField");

  if (provinceSelect && citySelect) {
    provinceSelect.addEventListener("change", function () {
      var towns = townsByProvince[provinceSelect.value];
      citySelect.innerHTML = "";
      if (!towns) {
        citySelect.disabled = true;
        var opt = document.createElement("option");
        opt.textContent = "Select province first";
        citySelect.appendChild(opt);
        return;
      }
      citySelect.disabled = false;
      var anyOpt = document.createElement("option");
      anyOpt.textContent = "Any city/town";
      citySelect.appendChild(anyOpt);
      towns.forEach(function (town) {
        var o = document.createElement("option");
        o.textContent = town;
        citySelect.appendChild(o);
      });
    });
  }

  if (typeSelect && perchesField) {
    typeSelect.addEventListener("change", function () {
      perchesField.classList.toggle("is-open", typeSelect.value === "Land");
    });
  }
})();

// Lets a visitor flag a listing as problematic — the reason is sent to the
// backend and shows up in the Admin Panel's Reported Listings tab.
function reportListing(id) {
  var reason = prompt("Why are you reporting this listing?");
  if (reason === null) return;
  fetch("/api/listings/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id, reason: reason || "No reason given" })
  })
    .then(function () { alert("Thanks — this listing has been reported."); })
    .catch(function () { alert("Couldn't submit the report right now."); });
}

// Sri Lankan numbers are usually typed as 07XXXXXXXX; wa.me needs 947XXXXXXXX.
function waNumber(raw) {
  var d = String(raw || "").replace(/[^0-9]/g, "");
  if (d.indexOf("0") === 0) d = "94" + d.slice(1);
  return d;
}

// Escapes user-submitted text before it goes into innerHTML (listing titles,
// cities etc. come from sellers, so they must never be inserted raw).
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

// Renders a list of listings into the Featured Properties grid.
function renderListings(listings, emptyMessage) {
  var grid = document.getElementById("propGrid");
  if (!grid) return;
  grid.innerHTML = "";
  if (!listings.length) {
    grid.innerHTML = '<p class="prop-empty">' + emptyMessage + '</p>';
    return;
  }
  listings.forEach(function (item, i) {
    var photoClass = "p" + ((i % 3) + 1);
    var priceLabel = item.priceUnit === "month"
      ? "Rs. " + Number(item.price).toLocaleString() + "/mo"
      : "Rs. " + Number(item.price).toLocaleString();
    var card = document.createElement("div");
    card.className = "prop-card reveal is-visible prop-card-link";
    card.setAttribute("data-id", item.id);
    var waLink = item.sellerContact
      ? '<a class="prop-whatsapp" target="_blank" href="https://wa.me/' + waNumber(item.sellerContact) + '?text=' + encodeURIComponent("Hi, I'm interested in " + item.title + " on Idama.lk") + '"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.3-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.1 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.3-.8.8-.8 1.9s.8 2.2 1 2.4c.1.1 1.6 2.5 3.9 3.5.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1-.1-.1-.2-.1-.5-.3z"/><path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1112 20.2z"/></svg></a>'
      : '';
    card.innerHTML =
      '<div class="prop-photo ' + photoClass + '"><span class="prop-tag">' + (item.priceUnit === "month" ? "For Rent" : "For Sale") + '</span>' + waLink + '</div>' +
      '<div class="prop-body">' +
        '<div class="prop-price">' + priceLabel + '</div>' +
        '<div class="prop-title">' + esc(item.title) + '</div>' +
        '<div class="prop-loc">' + esc(item.city || item.province || "Sri Lanka") + '</div>' +
        '<div class="prop-meta"><span>' + esc(item.category) + '</span></div>' +
        '<a href="#" class="prop-report" onclick="reportListing(\'' + esc(item.id) + '\');return false;">Report this listing</a>' +
      '</div>';
    card.addEventListener("click", function (e) {
      if (e.target.closest(".prop-whatsapp") || e.target.closest(".prop-report")) return;
      window.location.href = "detail.html?id=" + encodeURIComponent(item.id);
    });
    grid.appendChild(card);
  });
}

// Loads all active listings on page load.
function renderApprovedListings() {
  fetch("/api/listings?status=active")
    .then(function (r) { if (!r.ok) throw new Error("no api"); return r.json(); })
    .then(function (data) {
      renderListings(data.listings || [], 'No listings yet — be the first to <a href="dashboard/seller-dashboard.html">list a property</a>.');
    })
    .catch(function () {
      renderListings([], "Couldn't load listings right now — please refresh.");
    });
}

// Maps the search form's Budget dropdown text to a min/max price range.
var BUDGET_RANGES = {
  "Under Rs. 5M": { max: 5000000 },
  "Rs. 5M – 15M": { min: 5000000, max: 15000000 },
  "Rs. 15M – 30M": { min: 15000000, max: 30000000 },
  "Rs. 30M – 60M": { min: 30000000, max: 60000000 },
  "Above Rs. 60M": { min: 60000000 }
};

// Runs the hero search form against the real backend and shows results
// in the Featured Properties grid.
function performSearch(event) {
  event.preventDefault();
  var province = document.getElementById("province").value;
  var city = document.getElementById("city").value;
  var type = document.getElementById("type").value;
  var budget = document.getElementById("price").value;
  var perches = document.getElementById("perches") ? document.getElementById("perches").value : "";

  var params = new URLSearchParams();
  params.set("status", "active");
  if (province && province.indexOf("Any") !== 0) params.set("province", province);
  if (city && city.indexOf("Any") !== 0 && city.indexOf("Select") !== 0) params.set("city", city);
  if (type && type.indexOf("Any") !== 0) params.set("category", type.toLowerCase());
  var range = BUDGET_RANGES[budget];
  if (range) {
    if (range.min) params.set("minPrice", range.min);
    if (range.max) params.set("maxPrice", range.max);
  }

  var sectionHead = document.querySelector("#propGrid").previousElementSibling;
  if (sectionHead) {
    var h2 = sectionHead.querySelector("h2");
    if (h2) h2.textContent = "Search results";
  }

  fetch("/api/listings?" + params.toString())
    .then(function (r) { if (!r.ok) throw new Error("no api"); return r.json(); })
    .then(function (data) {
      var results = data.listings || [];
      if (type.toLowerCase() === "land" && perches) {
        var minPerches = Number(perches);
        if (!isNaN(minPerches)) {
          results = results.filter(function (l) { return l.perches && l.perches >= minPerches; });
        }
      }
      renderListings(results, 'No properties matched your search. Try widening the filters, or <a href="dashboard/seller-dashboard.html">list a property</a> if you\'re a seller.');
      var grid = document.getElementById("propGrid");
      if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
    })
    .catch(function () {
      renderListings([], "Couldn't search right now — please try again.");
    });
}

// Fades and lifts each .reveal element into place as it enters the viewport.
document.addEventListener("DOMContentLoaded", function () {
  renderApprovedListings();
  var items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            entry.target.classList.add("is-visible");
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach(function (el) { observer.observe(el); });
});
